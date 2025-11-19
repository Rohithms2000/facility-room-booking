package com.facility.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[@#$%^&+=!]).{6,}$",
            message = "Password must contain at least one alphabet, one number, one special character, and be at least 6 characters long"
    )
    private String password;
}
