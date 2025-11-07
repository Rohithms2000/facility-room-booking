package com.facility.backend.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "availabilityRules")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityRule {

    @Id
    private String id;

    private String roomId;

    private RuleType ruleType;

    private String createdBy;

    private LocalDate date;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;

    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;

    public enum RuleType {
        HOLIDAY,
        WEEKLY_CLOSED,
        TIME_BLOCK,
        DATE_RANGE
    }
}
