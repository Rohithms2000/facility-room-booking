package com.facility.backend.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.*;

@Document(collection = "availabilityRules")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityRule {

    @Id
    private String id;

    private String roomId;

    private RuleType ruleType;

    private String createdBy;

    private Instant date;
    private DayOfWeek dayOfWeek;
    private Instant startTime;
    private Instant endTime;

    private String reason;

    public enum RuleType {
        HOLIDAY,
        WEEKLY_CLOSED,
        TIME_BLOCK
    }
}
