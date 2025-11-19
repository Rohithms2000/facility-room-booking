package com.facility.backend.user.service;

import com.facility.backend.dto.booking.BookingRequest;
import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.dto.room.RoomResponse;
import com.facility.backend.exception.BookingNotAllowedException;
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
import com.facility.backend.auth.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
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


    private static final ZoneId zone = ZoneId.of("Asia/Kolkata");
//    room booking
    public BookingResponse createBooking(BookingRequest request, Authentication auth){
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        String userId = userDetails.getUser().getId();
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new ResourceNotFoundException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(()-> new ResourceNotFoundException("Room not found"));

        List<AvailabilityRule> rules = availabilityRuleRepository.findByRoomId(room.getId());

//        conflict detection
//        availability rule checking
        LocalDateTime bookingStartLocal = LocalDateTime.ofInstant(request.getStartTime(), zone);
        LocalDateTime bookingEndLocal = LocalDateTime.ofInstant(request.getEndTime(), zone);

        LocalDate bookingDate = bookingStartLocal.toLocalDate();
        DayOfWeek bookingDay = bookingStartLocal.getDayOfWeek();
        LocalTime bookingStartTime = bookingStartLocal.toLocalTime();
        LocalTime bookingEndTime = bookingEndLocal.toLocalTime();

        for (AvailabilityRule rule : rules) {
            switch (rule.getRuleType()) {

                case HOLIDAY -> {
                    LocalDate holidayDate = LocalDateTime.ofInstant(rule.getDate(), zone).toLocalDate();
                    if (holidayDate.equals(bookingDate)) {
                        throw new BookingNotAllowedException("Booking not allowed — holiday on " + holidayDate);
                    }
                }

                case WEEKLY_CLOSED -> {
                    if (rule.getDayOfWeek() == bookingDay) {
                        throw new BookingNotAllowedException("Booking not allowed — weekly off on " + bookingDay);
                    }
                }

                case TIME_BLOCK -> {
                    LocalTime blockStart = LocalDateTime.ofInstant(rule.getStartTime(), zone).toLocalTime();
                    LocalTime blockEnd = LocalDateTime.ofInstant(rule.getEndTime(), zone).toLocalTime();

                    // Check if booking overlaps with blocked time range
                    boolean overlaps =
                            !bookingEndTime.isBefore(blockStart) &&
                                    !bookingStartTime.isAfter(blockEnd);

                    if (overlaps) {
                        throw new BookingNotAllowedException("Booking not allowed — time block between "
                                + blockStart + " and " + blockEnd);
                    }
                }
            }
        }

//        previous bookings overlap check
        List<Booking> conflictBookings = bookingRepository.findConflictBookings(
                room.getId(),
                request.getStartTime(),
                request.getEndTime()
        );
            if (!conflictBookings.isEmpty()) {
                throw new BookingNotAllowedException("Slot already booked for this room");
            }

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

//    listing all rooms
    public List<RoomResponse> getAllRooms(){
        List<Room> rooms = roomRepository.findAll();
        return rooms.stream()
                .map(RoomMapper::toResponse)
                .toList();
    }

//    listing all bookings
    public List<BookingResponse> getAllBookings(Authentication auth){
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        String userId = userDetails.getUser().getId();

        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings
                .stream()
                .filter(b -> b.getStatus() != Booking.Status.CANCELLED && b.getStatus() != Booking.Status.REJECTED)
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
}
