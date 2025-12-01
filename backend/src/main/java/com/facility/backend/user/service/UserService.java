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
//    room booking
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

//    listing rooms (filter)
    public List<RoomResponse> getRooms(Integer minCapacity, Integer maxCapacity, String location, List<String> resources ){
        List<Room> rooms = roomRepository.searchRooms(minCapacity, maxCapacity, location, resources);
        return rooms.stream()
                .map(RoomMapper::toResponse)
                .toList();
    }

//    listing all bookings
    public List<BookingResponse> getAllBookings(){
        String userId = currentUserService.getCurrentUser().getId();

        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings
                .stream()
                .filter(b -> b.getStatus() != Booking.Status.CANCELLED)
                .map(BookingMapper::toResponse)
                .toList();
    }

//    list bookings for specific room
    public List<BookingResponse> getBookingsForRoom(String roomId){
        List<Booking> bookings = bookingRepository.findActiveBookingsByRoom(roomId);
        return bookings.stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

//    cancel booking
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
