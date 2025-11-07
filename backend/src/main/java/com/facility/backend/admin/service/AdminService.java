package com.facility.backend.admin.service;

import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.dto.room.RoomRequest;
import com.facility.backend.dto.room.RoomResponse;
import com.facility.backend.util.BookingMapper;
import com.facility.backend.util.RoomMapper;
import com.facility.backend.model.Booking;
import com.facility.backend.model.Room;
import com.facility.backend.model.User;
import com.facility.backend.repository.BookingRepository;
import com.facility.backend.repository.RoomRepository;
import com.facility.backend.auth.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

//    create a room
    public RoomResponse createRoom(RoomRequest request, Authentication auth){
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User admin = userDetails.getUser();
        Room room = Room.builder()
                .name(request.getName())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .resources(request.getResources())
                .createdBy(admin.getId())
                .build();
        Room saved = roomRepository.save(room);
        return RoomMapper.toResponse(saved);
    }

//    update a room by id
    public RoomResponse editRoom(RoomRequest request, String id){
        Room room = roomRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Room not found"));
                room.setName(request.getName());
                room.setCapacity(request.getCapacity());
                room.setLocation(request.getLocation());
                room.setResources(request.getResources());
        return RoomMapper.toResponse(roomRepository.save(room));
    }

//   delete a room by id
    public void deleteRoom(String id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found");
        }
            roomRepository.deleteById(id);
    }
//    get all bookings
    public List<BookingResponse> getBookingsForAdmin(Authentication auth){
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User admin = userDetails.getUser();
        List<Room> rooms = roomRepository.findByCreatedBy(admin.getId());
        List<String> roomIds = rooms.stream()
                .map(Room::getId)
                .toList();
        List<Booking> bookings = bookingRepository.findByRoomIdIn(roomIds);
        return bookings
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    public List<RoomResponse> getRooms(Authentication auth){
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User admin = userDetails.getUser();
        List<Room> rooms = roomRepository.findByCreatedBy(admin.getId());
        return rooms.stream()
                .map(RoomMapper::toResponse)
                .collect(Collectors.toList());
    }

//    update status of a booking
    public BookingResponse updateBookingStatus(String bookingId, Booking.Status status){
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(()->new RuntimeException("Booking not found"));

        booking.setStatus(status);
        Booking updatedBooking = bookingRepository.save(booking);
        return BookingMapper.toResponse(updatedBooking);
    }
}
