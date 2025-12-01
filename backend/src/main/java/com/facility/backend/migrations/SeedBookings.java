package com.facility.backend.migrations;

import com.facility.backend.model.Booking;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.Instant;
import java.util.List;

@ChangeUnit(id = "seedBookings", order = "003", author = "rohith")
public class SeedBookings {

    @Execution
    public void execute(MongoTemplate mongo) {

        Booking booking1 = Booking.builder()
                .roomId("691c395dbd6e349f94b83f92")
                .userId("691ec478bdd9c0c744ae2d13")
                .startTime(Instant.parse("2026-01-15T10:00:00Z"))
                .endTime(Instant.parse("2026-01-15T12:00:00Z"))
                .purpose("Party")
                .status(Booking.Status.PENDING)
                .build();

        Booking booking2 = Booking.builder()
                .roomId("691acd6cc801df89687723c0")
                .userId("691ec4d1bdd9c0c744ae2d14")
                .startTime(Instant.parse("2026-02-23T11:00:00Z"))
                .endTime(Instant.parse("2026-02-23T13:00:00Z"))
                .purpose("Board Meeting")
                .status(Booking.Status.APPROVED)
                .build();

        Booking booking3 = Booking.builder()
                .roomId("691acdc3c801df89687723c1")
                .userId("691ace0bc801df89687723c2")
                .startTime(Instant.parse("2026-02-03T10:00:00Z"))
                .endTime(Instant.parse("2026-02-03T12:30:00Z"))
                .purpose("Birthday Party")
                .status(Booking.Status.PENDING)
                .build();

        Booking booking4 = Booking.builder()
                .roomId("691d92f709931ae107e6678e")
                .userId("69084849c20df417c5a57caa")
                .startTime(Instant.parse("2026-03-12T10:00:00Z"))
                .endTime(Instant.parse("2026-03-12T11:00:00Z"))
                .purpose("Meeting")
                .status(Booking.Status.PENDING)
                .build();

        mongo.insertAll(List.of(booking1, booking2, booking3, booking4));

    }

    private static final String FIELD_ROOM_ID = "roomId";
    private static final String FIELD_USER_ID = "userId";
    private static final String FIELD_PURPOSE = "purpose";

    @RollbackExecution
    public void rollback(MongoTemplate mongo) {

        List<Criteria> bookings = List.of(
                Criteria.where(FIELD_ROOM_ID).is("691c395dbd6e349f94b83f92")
                        .and(FIELD_USER_ID).is("691ec478bdd9c0c744ae2d13")
                        .and(FIELD_PURPOSE).is("Party"),
                Criteria.where(FIELD_ROOM_ID).is("691acd6cc801df89687723c0")
                        .and(FIELD_USER_ID).is("691ec4d1bdd9c0c744ae2d14")
                        .and(FIELD_PURPOSE).is("Board Meeting"),
                Criteria.where(FIELD_ROOM_ID).is("691acdc3c801df89687723c1")
                        .and(FIELD_USER_ID).is("691ace0bc801df89687723c2")
                        .and(FIELD_PURPOSE).is("Birthday Party"),
                Criteria.where(FIELD_ROOM_ID).is("691d92f709931ae107e6678e")
                        .and(FIELD_USER_ID).is("69084849c20df417c5a57caa")
                        .and(FIELD_PURPOSE).is("Meeting")
        );

                mongo.remove(
                        Query.query(
                                new Criteria().orOperator(bookings)),
                Booking.class
        );
    }
}

