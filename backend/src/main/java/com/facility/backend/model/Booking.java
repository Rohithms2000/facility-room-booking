package com.facility.backend.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bookings")
@Data
public class Booking {

    @Id
    private String id;

    private String roomId;

    private String userId;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Status status;

    private String purpose;

    public enum Status {
        PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED
    }

}
