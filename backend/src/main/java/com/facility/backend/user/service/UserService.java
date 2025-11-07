package com.facility.backend.user.service;

import com.facility.backend.dto.booking.BookingRequest;
import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.dto.room.RoomResponse;
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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

//    room booking
    public BookingResponse createBooking(BookingRequest request, Authentication auth){
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        String userId = userDetails.getUser().getId();
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(()-> new RuntimeException("Room not found"));
//        overlapping check
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                room.getId(),
                request.getStartTime(),
                request.getEndTime()
        );
            if (!overlapping.isEmpty()) {
                throw new RuntimeException("Slot already booked for this room");
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
                .collect(Collectors.toList());
    }

//    listing all bookings
    public List<BookingResponse> getAllBookings(Authentication auth){
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        String userId = userDetails.getUser().getId();

        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings
                .stream().map(BookingMapper::toResponse)
                .collect(Collectors.toList());
    }

//    list bookings for specific room
    public List<BookingResponse> getBookingsForRoom(String roomId){
        List<Booking> bookings = bookingRepository.findByRoomId(roomId);
        return bookings.stream()
                .map(BookingMapper::toResponse)
                .collect(Collectors.toList());
    }

//    cancel booking
    public BookingResponse cancelBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                        .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(Booking.Status.CANCELLED);
        Booking cancelledBooking = bookingRepository.save(booking);
        return BookingMapper.toResponse(cancelledBooking);
    }
}
