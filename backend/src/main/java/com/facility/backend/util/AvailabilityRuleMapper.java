package com.facility.backend.util;


import com.facility.backend.dto.availabilityRule.AvailabilityRuleRequest;
import com.facility.backend.dto.availabilityRule.AvailabilityRuleResponse;
import com.facility.backend.model.AvailabilityRule;

public class AvailabilityRuleMapper {

    public static AvailabilityRule toEntity(AvailabilityRuleRequest dto) {
        if (dto == null) return null;

        AvailabilityRule rule = new AvailabilityRule();
        rule.setRoomId(dto.getRoomId());
        rule.setRuleType(dto.getRuleType());
        rule.setDate(dto.getDate());
        rule.setDayOfWeek(dto.getDayOfWeek());
        rule.setStartTime(dto.getStartTime());
        rule.setEndTime(dto.getEndTime());
        rule.setReason(dto.getReason());
        return rule;
    }

    public static AvailabilityRuleResponse toResponse(AvailabilityRule rule) {

        return AvailabilityRuleResponse.builder()
                .id(rule.getId())
                .roomId(rule.getRoomId())
                .ruleType(rule.getRuleType())
                .createdBy(rule.getCreatedBy())
                .date(rule.getDate())
                .dayOfWeek(rule.getDayOfWeek())
                .startTime(rule.getStartTime())
                .endTime(rule.getEndTime())
                .reason(rule.getReason())
                .build();
    }
}
