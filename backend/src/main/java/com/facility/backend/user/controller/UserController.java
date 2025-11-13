package com.facility.backend.user.controller;

import com.facility.backend.dto.booking.BookingRequest;
import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.dto.room.RoomResponse;
import com.facility.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

//    book a room
    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request, Authentication auth){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createBooking(request, auth));
    }

//    get all available rooms
    @GetMapping("/rooms")
    public ResponseEntity<List<RoomResponse>> getAllRooms(){
        List<RoomResponse> rooms = userService.getAllRooms();
        return rooms.isEmpty()
                ? ResponseEntity.noContent().build()
                :ResponseEntity.ok(rooms);
    }

//    get all the bookings to check availabilitiy
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings(Authentication auth){
        List<BookingResponse> bookings = userService.getAllBookings(auth);
        return bookings.isEmpty()
                ? ResponseEntity.noContent().build()
                :ResponseEntity.ok(bookings);
    }

    @GetMapping("/rooms/{roomId}/bookings")
    public ResponseEntity<List<BookingResponse>> getBookingsForRoom(@PathVariable String roomId) {
        List<BookingResponse> bookings = userService.getBookingsForRoom(roomId);
        return bookings.isEmpty()
                ? ResponseEntity.noContent().build()
                :ResponseEntity.ok(bookings);
    }

    @PatchMapping("/bookings/cancel/{id}")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable("id") String bookingId
    ) {
        BookingResponse cancelledBooking = userService.cancelBooking(bookingId);
        return ResponseEntity.ok(cancelledBooking);
    }
}
