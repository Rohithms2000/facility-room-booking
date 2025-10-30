package com.facility.backend.controller;

import com.facility.backend.dto.auth.LoginRequest;
import com.facility.backend.dto.auth.RegisterRequest;
import com.facility.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register-user")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request){
        return ResponseEntity.ok(authService.registerUser(request));
    }

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody RegisterRequest request){
        return ResponseEntity.ok(authService.registerAdmin(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request){
        return ResponseEntity.ok(authService.login(request));
    }
}
