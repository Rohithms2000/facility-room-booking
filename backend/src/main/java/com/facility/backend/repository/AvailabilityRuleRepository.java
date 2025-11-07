package com.facility.backend.repository;

import com.facility.backend.model.AvailabilityRule;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AvailabilityRuleRepository extends MongoRepository<AvailabilityRule, String> {
    List<AvailabilityRule> findByRoomId(String roomId);
}
