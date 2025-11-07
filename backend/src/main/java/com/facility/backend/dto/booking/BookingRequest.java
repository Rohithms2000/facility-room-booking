package com.facility.backend.dto.booking;

import com.facility.backend.model.Booking;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Data
public class BookingRequest {

    @NotBlank(message = "Room ID is required")
    private String roomId;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private Instant startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private Instant endTime;

    @NotBlank(message = "Purpose is required")
    @Size(min = 5, max = 200, message = "Purpose must be between 5 and 200 characters")
    private String purpose;
}
