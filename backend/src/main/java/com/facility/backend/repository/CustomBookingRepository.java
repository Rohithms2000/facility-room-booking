package com.facility.backend.repository;

import com.facility.backend.model.Booking;

import java.time.Instant;
import java.util.List;

public interface CustomBookingRepository {

    List<Booking> findConflictBookings (String roomId, Instant startTime, Instant endTime);
    List<Booking> findPendingConflicts (String roomId, Instant startTime, Instant endTime);
    List<Booking> findActiveBookingsByRoom (String roomId);
}
