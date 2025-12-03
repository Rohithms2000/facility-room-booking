package com.facility.backend.auth.service;


import com.facility.backend.dto.*;
import com.facility.backend.dto.auth.AuthResponse;
import com.facility.backend.dto.auth.LoginRequest;
import com.facility.backend.dto.auth.RegisterRequest;
import com.facility.backend.exception.DuplicateDataException;
import com.facility.backend.model.User;
import com.facility.backend.repository.UserRepository;
import com.facility.backend.security.JwtService;
import com.facility.backend.security.UserDetailsImpl;
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

    /**
     * Registers a new normal user using the details provided in the registration request.
     * This method validates if the email is unique and a new user account is created and
     * assigned with a default USER role.
     *
     * @param request the registration details of the user
     * @return a success message wrapped in {@link MessageResponse}
     *
     * @throws DuplicateDataException if a user with the given email already exists
     * @throws IllegalArgumentException if the request object is null or contains invalid data.
     */

    public MessageResponse registerUser(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new DuplicateDataException("User with this email already exists");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .build();
        userRepository.save(user);

        return new MessageResponse("User registered successfully. Please log in.");
    }

    /**
     * Registers a new admin user using the details provided in the registration request.
     * This method validates if the email is unique and a new user account is created and
     * assigned with a default ADMIN role.
     *
     * @param request the registration details of the user
     * @return a success message wrapped in {@link MessageResponse}
     *
     * @throws DuplicateDataException if a user with the given email already exists
     * @throws IllegalArgumentException if the request object is null or contains invalid data.
     */
    public MessageResponse  registerAdmin(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new DuplicateDataException("User with this email already exists");
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

    /**
     * Authenticates a user using the credentials provided in the login request.
     * This method delegates authentication to the configured {@link AuthenticationManager}.
     * On successful authentication, a JWT token is generated for the authenticated user.
     * The response contains the token along with basic user details.
     *
     * @param request the login credentials (email and password)
     * @return an {@link AuthResponse} containing the JWT token, username, role, and a success message
     */
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
