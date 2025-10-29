package com.facility.backend.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "availabilityRules")
@Data
public class AvailabilityRule {

    @Id
    private String id;

    private String roomId;

    private RuleType ruleType;

    public enum RuleType{
        WEEKLY_CLOSED, HOLIDAY, TIME_BLOCK
    }

}
