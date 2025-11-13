package com.facility.backend.repository;

import com.facility.backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

//    conflict detection logic(overlapping check)
    @Query("{ 'roomId': ?0, 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 }, 'status': { $nin: ['CANCELLED', 'REJECTED'] } }")
    List<Booking> findConflictBookings(String roomId, Instant startTime, Instant endTime);

    List<Booking> findByUserId(String userId);

    @Query("{ 'roomId': ?0, 'status': { $nin: ['CANCELLED', 'REJECTED'] } }")
    List<Booking> findActiveBookingsByRoom(String roomId);

    List<Booking> findByRoomIdIn(List<String> roomIds);


}
