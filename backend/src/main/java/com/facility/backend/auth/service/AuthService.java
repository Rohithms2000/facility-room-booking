package com.facility.backend.auth.service;


import com.facility.backend.dto.*;
import com.facility.backend.dto.auth.AuthResponse;
import com.facility.backend.dto.auth.LoginRequest;
import com.facility.backend.dto.auth.RegisterRequest;
import com.facility.backend.model.User;
import com.facility.backend.repository.UserRepository;
import com.facility.backend.auth.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

//    register user with role USER
    public MessageResponse registerUser(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }
        User user = User.builder().name(request.getName()).email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).role(User.Role.USER).build();
        userRepository.save(user);

        return new MessageResponse("User registered successfully. Please log in.");
    }

//    register admin with role ADMIN
    public MessageResponse  registerAdmin(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.ADMIN)
                .build();
        userRepository.save(user);

        return new MessageResponse("Admin registered successfully. Please log in.");
    }

//    login user/admin, provide token along with role
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(
                token,
                userDetails.getUsername(),
                userDetails.getRole().name(),
                "Login successful"
        );
    }
}
