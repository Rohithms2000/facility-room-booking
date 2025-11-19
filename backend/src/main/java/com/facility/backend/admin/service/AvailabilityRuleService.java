package com.facility.backend.admin.service;

import com.facility.backend.dto.availability.AvailabilityRuleRequest;
import com.facility.backend.dto.availability.AvailabilityRuleResponse;
import com.facility.backend.exception.ResourceNotFoundException;
import com.facility.backend.exception.UnauthorizedAccessException;
import com.facility.backend.model.AvailabilityRule;
import com.facility.backend.model.Room;
import com.facility.backend.model.User;
import com.facility.backend.repository.AvailabilityRuleRepository;
import com.facility.backend.repository.RoomRepository;
import com.facility.backend.auth.security.UserDetailsImpl;
import com.facility.backend.util.AvailabilityRuleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvailabilityRuleService {

    private final AvailabilityRuleRepository availabilityRuleRepository;
    private final RoomRepository roomRepository;

//    add a rule
    public AvailabilityRuleResponse addRule(AvailabilityRuleRequest ruleRequest, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User admin = userDetails.getUser();

        Room room = roomRepository.findById(ruleRequest.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (!room.getCreatedBy().equals(admin.getId())) {
            throw new UnauthorizedAccessException("You are not authorized to set rules for this room");
        }
        AvailabilityRule rule = AvailabilityRuleMapper.toEntity(ruleRequest);
        rule.setCreatedBy(admin.getId());

        AvailabilityRule savedRule = availabilityRuleRepository.save(rule);

        return AvailabilityRuleMapper.toResponse(savedRule);
    }

//    get rules for the room
    public List<AvailabilityRuleResponse> getRulesForRoom(String roomId) {

        List<AvailabilityRule> rules = availabilityRuleRepository.findByRoomId(roomId);

        return rules.stream()
                .map(AvailabilityRuleMapper::toResponse)
                .toList();
    }

//    delete a rule
    public void deleteRule(String ruleId, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User admin = userDetails.getUser();

        AvailabilityRule rule = availabilityRuleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found"));

        Room room = roomRepository.findById(rule.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (!room.getCreatedBy().equals(admin.getId())) {
            throw new UnauthorizedAccessException("You are not authorized to delete this rule");
        }

        availabilityRuleRepository.delete(rule);
    }
}

