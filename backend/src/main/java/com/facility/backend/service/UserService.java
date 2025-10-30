package com.facility.backend.service;

import com.facility.backend.dto.booking.BookingRequest;
import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.dto.room.RoomResponse;
import com.facility.backend.mapper.BookingMapper;
import com.facility.backend.mapper.RoomMapper;
import com.facility.backend.model.Booking;
import com.facility.backend.model.Room;
import com.facility.backend.model.User;
import com.facility.backend.repository.BookingRepository;
import com.facility.backend.repository.RoomRepository;
import com.facility.backend.repository.UserRepository;
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

//    Room booking
    public BookingResponse createBooking(BookingRequest request, Authentication auth){
        String userEmail = auth.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(()-> new RuntimeException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(()-> new RuntimeException("Room not found"));

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

//    Listing all rooms
    public List<RoomResponse> getAllRooms(){
        List<Room> rooms = roomRepository.findAll();
        return rooms
                .stream().map(RoomMapper::toResponse)
                .collect(Collectors.toList());
    }
}
