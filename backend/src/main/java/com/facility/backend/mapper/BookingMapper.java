package com.facility.backend.mapper;

import com.facility.backend.dto.booking.BookingResponse;
import com.facility.backend.model.Booking;

public class BookingMapper {
    public static BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .roomId(booking.getRoomId())
                .userId(booking.getUserId())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus())
                .purpose(booking.getPurpose())
                .build();
    }
}
