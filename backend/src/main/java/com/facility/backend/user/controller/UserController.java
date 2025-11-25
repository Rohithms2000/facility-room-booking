package com.facility.backend.user.controller;

import com.facility.backend.dto.booking.BookingRequest;
import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.dto.room.RoomResponse;
import com.facility.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('USER')")
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

//    book a room
    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createBooking(request));
    }

//    get all available rooms
    @GetMapping("/rooms")
    public ResponseEntity<List<RoomResponse>> getAllRooms(){
        List<RoomResponse> rooms = userService.getAllRooms();
        return rooms.isEmpty()
                ? ResponseEntity.noContent().build()
                :ResponseEntity.ok(rooms);
    }

//    get all the bookings to check availability
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings(){
        List<BookingResponse> bookings = userService.getAllBookings();
        return bookings.isEmpty()
                ? ResponseEntity.noContent().build()
                :ResponseEntity.ok(bookings);
    }

//    get booking for the particular room
    @GetMapping("/rooms/{roomId}/bookings")
    public ResponseEntity<List<BookingResponse>> getBookingsForRoom(@PathVariable String roomId) {
        List<BookingResponse> bookings = userService.getBookingsForRoom(roomId);
        return bookings.isEmpty()
                ? ResponseEntity.noContent().build()
                :ResponseEntity.ok(bookings);
    }

//    cancel booking
    @PatchMapping("/bookings/cancel/{id}")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable("id") String bookingId
    ) {
        BookingResponse cancelledBooking = userService.cancelBooking(bookingId);
        return ResponseEntity.ok(cancelledBooking);
    }
}
