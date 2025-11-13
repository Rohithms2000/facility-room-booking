package com.facility.backend.dto.stats;

import lombok.Data;

@Data
public class BookingStatsResponse {
    private Long totalBookings;
    private Long pending;
    private Long approved;
    private Long cancelled;
    private Long rejected;
}
