package com.facility.backend.dto.booking;

import com.facility.backend.model.Booking;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Data
@Builder
public class BookingResponse {

    private String id;

    private String roomId;

    private String userId;

    private String startTime;

    private String endTime;

    private Booking.Status status;

    private String purpose;
}
