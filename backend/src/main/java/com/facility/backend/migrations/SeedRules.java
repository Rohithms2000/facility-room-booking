package com.facility.backend.migrations;

import com.facility.backend.model.AvailabilityRule;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.DayOfWeek;
import java.time.Instant;
import java.util.List;

@ChangeUnit(id = "seedRules", order = "004", author = "rohith")
public class SeedRules {

    @Execution
    public void execute(MongoTemplate mongo) {

        AvailabilityRule rule1 = AvailabilityRule.builder()
                .roomId("691c395dbd6e349f94b83f92")
                .ruleType(AvailabilityRule.RuleType.HOLIDAY)
                .date(Instant.parse("2026-02-14T00:00:00Z"))
                .reason("Holiday")
                .build();

        AvailabilityRule rule2 = AvailabilityRule.builder()
                .roomId("691acd6cc801df89687723c0")
                .ruleType(AvailabilityRule.RuleType.WEEKLY_CLOSED)
                .dayOfWeek(DayOfWeek.SUNDAY)
                .reason("Weekly off")
                .build();

        AvailabilityRule rule3 = AvailabilityRule.builder()
                .roomId("69158920f909628a62f8b437")
                .ruleType(AvailabilityRule.RuleType.HOLIDAY)
                .date(Instant.parse("2026-01-26T00:00:00Z"))
                .reason("Republic Day")
                .build();

        AvailabilityRule rule4 = AvailabilityRule.builder()
                .roomId("691acc5bc801df89687723bd")
                .ruleType(AvailabilityRule.RuleType.TIME_BLOCK)
                .startTime(Instant.parse("2026-03-14T08:00:00Z"))
                .endTime(Instant.parse("2026-03-14T12:00:00Z"))
                .reason("Maintenance")
                .build();

        mongo.insertAll(List.of(rule1, rule2, rule3, rule4));
    }

    private static final String FIELD_ROOM_ID = "roomId";
    private static final String FIELD_RULE_TYPE = "ruleType";
    private static final String FIELD_REASON = "reason";

    @RollbackExecution
    public void rollback(MongoTemplate mongo) {

        List<Criteria> rules = List.of(
                Criteria.where(FIELD_ROOM_ID).is("691c395dbd6e349f94b83f92")
                        .and(FIELD_RULE_TYPE).is(AvailabilityRule.RuleType.HOLIDAY)
                        .and(FIELD_REASON).is("Holiday"),
                Criteria.where(FIELD_ROOM_ID).is("691acd6cc801df89687723c0")
                        .and(FIELD_RULE_TYPE).is(AvailabilityRule.RuleType.WEEKLY_CLOSED)
                        .and(FIELD_REASON).is("Weekly Off"),
                Criteria.where(FIELD_ROOM_ID).is("69158920f909628a62f8b437")
                        .and(FIELD_RULE_TYPE).is(AvailabilityRule.RuleType.HOLIDAY)
                        .and(FIELD_REASON).is("Republic Day"),
                Criteria.where(FIELD_ROOM_ID).is("691acc5bc801df89687723bd")
                        .and(FIELD_RULE_TYPE).is(AvailabilityRule.RuleType.TIME_BLOCK)
                        .and(FIELD_REASON).is("Maintenance")
        );

        mongo.remove(
                Query.query(
                        new Criteria().orOperator(rules)),
                AvailabilityRule.class
        );
    }
}
