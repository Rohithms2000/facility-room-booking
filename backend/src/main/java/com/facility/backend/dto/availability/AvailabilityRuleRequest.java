package com.facility.backend.dto.availability;

import com.facility.backend.model.AvailabilityRule.RuleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.Instant;

@Data
public class AvailabilityRuleRequest {

    @NotBlank(message = "Room ID is required")
    private String roomId;

    @NotNull(message = "Rule type is required")
    private RuleType ruleType;

    private Instant date;
    private DayOfWeek dayOfWeek;
    private Instant startTime;
    private Instant endTime;

    @NotBlank(message = "Reason is required")
    private String reason;
}
