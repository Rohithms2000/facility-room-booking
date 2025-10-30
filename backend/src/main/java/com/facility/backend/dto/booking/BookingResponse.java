package com.facility.backend.dto.booking;

import com.facility.backend.model.Booking;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {

    private String id;

    private String roomId;

    private String userId;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Booking.Status status;

    private String purpose;
}
