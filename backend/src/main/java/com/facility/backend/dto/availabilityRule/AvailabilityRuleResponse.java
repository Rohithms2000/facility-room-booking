package com.facility.backend.dto.availabilityRule;

import com.facility.backend.model.AvailabilityRule.RuleType;
import lombok.Builder;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.Instant;

@Data
@Builder
public class AvailabilityRuleResponse {

    private String id;
    private String roomId;
    private RuleType ruleType;
    private String createdBy;

    private Instant date;
    private DayOfWeek dayOfWeek;
    private Instant startTime;
    private Instant endTime;

    private String reason;
}
