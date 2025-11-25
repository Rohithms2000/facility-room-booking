package com.facility.backend.admin.controller;

import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.dto.room.RoomRequest;
import com.facility.backend.dto.room.RoomResponse;
import com.facility.backend.dto.stats.BookingStatsResponse;
import com.facility.backend.model.Booking;
import com.facility.backend.admin.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

//    create a room
    @PostMapping("/rooms")
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createRoom(request));
    }

//    update a room
    @PutMapping("/rooms/{id}")
    public ResponseEntity<RoomResponse> editRoom(@Valid @RequestBody RoomRequest request, @PathVariable String id){
        return ResponseEntity.ok(adminService.editRoom(request, id));
    }

//    delete a room by id
    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable String id){
        adminService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

//    booking status update - approve or reject
    @PatchMapping("/bookings/status/{id}")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable("id") String bookingId,
            @RequestParam Booking.Status status
    ){
        return ResponseEntity.ok(adminService.updateBookingStatus(bookingId, status));
    }

//    list the bookings for the rooms created by admin
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getBookingsForAdmin(){
        List<BookingResponse> bookings = adminService.getBookingsForAdmin();
        return bookings.isEmpty()
                ? ResponseEntity.noContent().build()
                :ResponseEntity.ok(bookings);
    }

//    list the rooms created by admin
    @GetMapping("/rooms")
    public ResponseEntity<List<RoomResponse>> getRooms(){
        List<RoomResponse> bookings = adminService.getRooms();
        return bookings.isEmpty()
                ? ResponseEntity.noContent().build()
                :ResponseEntity.ok(bookings);
    }

//    get booking stats for admin
    @GetMapping("/bookingStats")
    public ResponseEntity<BookingStatsResponse> getBookingStatsForAdmin(){
        BookingStatsResponse bookingStats = adminService.getBookingStatsForAdmin();
        return ResponseEntity.ok(bookingStats);
    }
}
