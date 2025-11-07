package com.facility.backend.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "bookings")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

    @Id
    private String id;

    private String roomId;

    private String userId;

    private Instant startTime;

    private Instant endTime;

    private Status status;

    private String purpose;

    public enum Status {
        PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED
    }

}
