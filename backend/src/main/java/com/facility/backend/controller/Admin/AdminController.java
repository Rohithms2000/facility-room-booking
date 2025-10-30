package com.facility.backend.controller.Admin;

import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.dto.room.RoomRequest;
import com.facility.backend.dto.room.RoomResponse;
import com.facility.backend.model.Booking;
import com.facility.backend.model.Room;
import com.facility.backend.service.AdminService;
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
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createRoom(request));
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

    @PostMapping("/booking/status/{id}")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable String bookingId,
            @RequestParam Booking.Status status,
            Authentication auth
    ){
        return ResponseEntity.ok(adminService.updateBookingStatus(bookingId, status, auth));
    }
}
