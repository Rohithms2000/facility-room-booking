package com.facility.backend.user.service;

import com.facility.backend.dto.booking.BookingRequest;
import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.dto.room.RoomResponse;
import com.facility.backend.exception.ActionNotAllowedException;
import com.facility.backend.exception.ResourceNotFoundException;
import com.facility.backend.model.AvailabilityRule;
import com.facility.backend.repository.AvailabilityRuleRepository;
import com.facility.backend.util.BookingMapper;
import com.facility.backend.util.RoomMapper;
import com.facility.backend.model.Booking;
import com.facility.backend.model.Room;
import com.facility.backend.model.User;
import com.facility.backend.repository.BookingRepository;
import com.facility.backend.repository.RoomRepository;
import com.facility.backend.repository.UserRepository;
import com.facility.backend.util.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final AvailabilityRuleRepository availabilityRuleRepository;
    private final CurrentUserService currentUserService;


    private static final ZoneId zone = ZoneId.of("Asia/Kolkata");
    /**
     * Creates a new booking request for a room on behalf of the currently authenticated user.
     * <p>
     * This method ensures that no conflicting bookings already exist for the
     * specified room and time period. If all validations pass, the booking is created with
     * a default status of {@code PENDING}.
     *
     * @param request the booking details including room ID, time range, and purpose
     * @return a {@link BookingResponse} representing the newly created booking
     *
     * @throws ResourceNotFoundException if the user or room specified in the request is not found
     * @throws ActionNotAllowedException if the booking conflicts with existing bookings
     */

    public BookingResponse createBooking(BookingRequest request){
        String userId = currentUserService.getCurrentUser().getId();
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new ResourceNotFoundException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(()-> new ResourceNotFoundException("Room not found"));

        validateBooking(room.getId(), request.getStartTime(), request.getEndTime());

        ensureNoConflictBookings(room.getId(), request.getStartTime(), request.getEndTime());

        Booking booking = Booking.builder()
                .roomId(room.getId())
                .userId(user.getId())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(Booking.Status.PENDING)
                .purpose(request.getPurpose())
                .build();
        Booking savedBooking = bookingRepository.save(booking);
        return BookingMapper.toResponse(savedBooking);
    }

    /**
     * Retrieves a list of rooms filtered by the provided search criteria.
     *
     * @param minCapacity the minimum required capacity of the room
     * @param maxCapacity the maximum allowed capacity of the room
     * @param location the location of the room to filter by
     * @param resources a list of required resources that the room must contain
     * @return a list of {@link RoomResponse} objects matching the given criteria
     */
    public List<RoomResponse> getRooms(Integer minCapacity, Integer maxCapacity, String location, List<String> resources ){
        List<Room> rooms = roomRepository.searchRooms(minCapacity, maxCapacity, location, resources);
        return rooms.stream()
                .map(RoomMapper::toResponse)
                .toList();
    }

    /**
     * Retrieves all non-cancelled bookings of the currently authenticated user.
     *
     * @return A list of {@link BookingResponse} objects representing all active
     *         bookings of the user.
     */
    public List<BookingResponse> getAllBookings(){
        String userId = currentUserService.getCurrentUser().getId();

        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings
                .stream()
                .filter(b -> b.getStatus() != Booking.Status.CANCELLED)
                .map(BookingMapper::toResponse)
                .toList();
    }

    /**
     * Retrieves all active bookings for the specified room.
     *
     * @param roomId the ID of the room whose active bookings are to be retrieved.
     * @return A list of {@link BookingResponse} objects representing all active
     *         bookings for the room.
     */
    public List<BookingResponse> getBookingsForRoom(String roomId){
        List<Booking> bookings = bookingRepository.findActiveBookingsByRoom(roomId);
        return bookings.stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    /**
     * Cancels an existing booking by updating its status to {@code CANCELLED}.
     *
     * @param bookingId the ID of the booking to cancel
     * @return a {@link BookingResponse} representing the cancelled booking
     *
     * @throws ResourceNotFoundException if no booking exists with the given ID
     */

    public BookingResponse cancelBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus(Booking.Status.CANCELLED);
        Booking cancelledBooking = bookingRepository.save(booking);
        return BookingMapper.toResponse(cancelledBooking);
    }

//    HELPER METHODS
//    validate booking with availability rules
    private void validateBooking(String roomId, Instant startTime, Instant endTime){

        List<AvailabilityRule> rules = availabilityRuleRepository.findByRoomId(roomId);

        LocalDateTime bookingStartLocal = LocalDateTime.ofInstant(startTime, zone);
        LocalDateTime bookingEndLocal = LocalDateTime.ofInstant(endTime, zone);

        LocalDate bookingDate = bookingStartLocal.toLocalDate();
        DayOfWeek bookingDay = bookingStartLocal.getDayOfWeek();
        LocalTime bookingStartTime = bookingStartLocal.toLocalTime();
        LocalTime bookingEndTime = bookingEndLocal.toLocalTime();

        for (AvailabilityRule rule : rules) {
            switch (rule.getRuleType()) {

                case HOLIDAY -> validateHolidayRule(rule, bookingDate);

                case WEEKLY_CLOSED -> validateWeeklyRule(rule, bookingDay);

                case TIME_BLOCK -> validateTimeBlock(rule, bookingStartTime, bookingEndTime);
            }
        }
    }

//    holiday check
    private void validateHolidayRule(AvailabilityRule rule, LocalDate bookingDate) {
        LocalDate holiday = LocalDateTime.ofInstant(rule.getDate(), zone).toLocalDate();
        if (holiday.equals(bookingDate)) {
            throw new ActionNotAllowedException(
                    "Booking not allowed — holiday on " + holiday
            );
        }
    }

//    weekly-off check
    private void validateWeeklyRule(AvailabilityRule rule, DayOfWeek bookingDay) {
        if (rule.getDayOfWeek() == bookingDay) {
            throw new ActionNotAllowedException(
                    "Booking not allowed — weekly off on " + bookingDay
            );
        }
    }

//    time-block check
    private void validateTimeBlock(AvailabilityRule rule, LocalTime start, LocalTime end) {

        LocalTime blockStart = LocalDateTime.ofInstant(rule.getStartTime(), zone).toLocalTime();
        LocalTime blockEnd = LocalDateTime.ofInstant(rule.getEndTime(), zone).toLocalTime();

        boolean overlaps =
                !end.isBefore(blockStart) &&
                        !start.isAfter(blockEnd);

        if (overlaps) {
            throw new ActionNotAllowedException(
                    "Booking not allowed — time block between " + blockStart + " and " + blockEnd
            );
        }
    }

//    previous booking conflict check
    private void ensureNoConflictBookings(String roomId, Instant start, Instant end){
        List<Booking> conflictBookings = bookingRepository.findConflictBookings(roomId, start, end);
        if (!conflictBookings.isEmpty()) {
            throw new ActionNotAllowedException("Slot already booked for this room");
        }
    }

}
