package com.facility.backend.admin.controller;

import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.dto.room.RoomRequest;
import com.facility.backend.dto.room.RoomResponse;
import com.facility.backend.model.Booking;
import com.facility.backend.admin.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/rooms")
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomRequest request, Authentication auth){
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createRoom(request, auth));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<RoomResponse> editRoom(@Valid @RequestBody RoomRequest request, @PathVariable String id){
        return ResponseEntity.ok(adminService.editRoom(request, id));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable String id){
        adminService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/bookings/status/{id}")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable("id") String bookingId,
            @RequestParam Booking.Status status
    ){
        return ResponseEntity.ok(adminService.updateBookingStatus(bookingId, status));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getBookingsForAdmin(Authentication auth){
        List<BookingResponse> bookings = adminService.getBookingsForAdmin(auth);
        return bookings.isEmpty()
                ? ResponseEntity.noContent().build()
                :ResponseEntity.ok(bookings);
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomResponse>> getRooms(Authentication auth){
        List<RoomResponse> bookings = adminService.getRooms(auth);
        return bookings.isEmpty()
                ? ResponseEntity.noContent().build()
                :ResponseEntity.ok(bookings);
    }
}
