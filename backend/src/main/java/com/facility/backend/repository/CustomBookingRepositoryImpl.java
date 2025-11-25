package com.facility.backend.repository;

import com.facility.backend.model.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomBookingRepositoryImpl implements CustomBookingRepository {

    private final MongoTemplate mongoTemplate;

//
    private List<Booking> findConflicts(String roomId, Instant start, Instant end, Booking.Status status) {
        Criteria criteria = new Criteria().andOperator(
                Criteria.where("roomId").is(roomId),
                Criteria.where("startTime").lt(end),
                Criteria.where("endTime").gt(start),
                Criteria.where("status").is(status)
        );
        return mongoTemplate.find(new Query(criteria), Booking.class);
    }

    @Override
    public List<Booking> findConflictBookings(String roomId, Instant start, Instant end) {
        return findConflicts(roomId, start, end, Booking.Status.APPROVED);
    }

    @Override
    public List<Booking> findPendingConflicts(String roomId, Instant start, Instant end) {
        return findConflicts(roomId, start, end, Booking.Status.PENDING);
    }

    @Override
    public List<Booking> findActiveBookingsByRoom(String roomId) {
        Criteria criteria = new Criteria().andOperator(
                Criteria.where("roomId").is(roomId),
                Criteria.where("status").is(Booking.Status.APPROVED)
        );
        return mongoTemplate.find(new Query(criteria), Booking.class);
    }
}

