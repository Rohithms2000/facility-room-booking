package com.facility.backend.controller.User;

import com.facility.backend.dto.booking.BookingRequest;
import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.dto.room.RoomResponse;
import com.facility.backend.service.UserService;
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

    @PostMapping("/booking")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request, Authentication auth){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createBooking(request, auth));
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomResponse>> getAllRooms(){
        List<RoomResponse> rooms = userService.getAllRooms();
        return rooms.isEmpty()
                ? ResponseEntity.noContent().build()
                :ResponseEntity.ok(rooms);
    }
}
