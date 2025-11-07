package com.facility.backend.admin.service;

import com.facility.backend.model.AvailabilityRule;
import com.facility.backend.model.Room;
import com.facility.backend.model.User;
import com.facility.backend.repository.AvailabilityRuleRepository;
import com.facility.backend.repository.RoomRepository;
import com.facility.backend.auth.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvailabilityRuleService {

    private final AvailabilityRuleRepository availabilityRuleRepository;
    private final RoomRepository roomRepository;

    public AvailabilityRule addRule(AvailabilityRule rule, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User admin = userDetails.getUser();

        Room room = roomRepository.findById(rule.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getCreatedBy().equals(admin.getId())) {
            throw new RuntimeException("You are not authorized to set rules for this room");
        }

        rule.setCreatedBy(admin.getId());
        return availabilityRuleRepository.save(rule);
    }

    public List<AvailabilityRule> getRulesForRoom(String roomId, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User admin = userDetails.getUser();

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getCreatedBy().equals(admin.getId())) {
            throw new RuntimeException("You are not authorized to view rules for this room");
        }

        return availabilityRuleRepository.findByRoomId(roomId);
    }

    public void deleteRule(String ruleId, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User admin = userDetails.getUser();

        AvailabilityRule rule = availabilityRuleRepository.findById(ruleId)
                .orElseThrow(() -> new RuntimeException("Rule not found"));

        Room room = roomRepository.findById(rule.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getCreatedBy().equals(admin.getId())) {
            throw new RuntimeException("You are not authorized to delete this rule");
        }

        availabilityRuleRepository.delete(rule);
    }
}

