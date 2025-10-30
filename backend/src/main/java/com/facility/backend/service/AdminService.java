package com.facility.backend.service;

import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.dto.room.RoomRequest;
import com.facility.backend.dto.room.RoomResponse;
import com.facility.backend.mapper.BookingMapper;
import com.facility.backend.mapper.RoomMapper;
import com.facility.backend.model.Booking;
import com.facility.backend.model.Room;
import com.facility.backend.repository.BookingRepository;
import com.facility.backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import static com.facility.backend.mapper.RoomMapper.toResponse;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

//    create a room
    public RoomResponse createRoom(RoomRequest request){
        Room room = Room.builder()
                .name(request.getName())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .resources(request.getResources())
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

//    update status of a booking
    public BookingResponse updateBookingStatus(String bookingId, Booking.Status status, Authentication auth){
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(()->new RuntimeException("Booking not found"));
        booking.setStatus(status);
        Booking updatedBooking = bookingRepository.save(booking);
        return BookingMapper.toResponse(updatedBooking);
    }
}
