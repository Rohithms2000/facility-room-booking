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
import com.facility.backend.util.AvailabilityRuleMapper;
import com.facility.backend.util.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvailabilityRuleService {

    private final AvailabilityRuleRepository availabilityRuleRepository;
    private final RoomRepository roomRepository;
    private final CurrentUserService currentUserService;

    /**
     * Creates a new availability rule for a room after ensuring that the currently
     * authenticated admin user is authorized to manage the room. The rule is then
     * saved to the database and returned as a {@link AvailabilityRuleResponse}.
     *
     * @param ruleRequest The request object containing the room ID and the details
     *                    of the rule to be created.
     * @return An {@link AvailabilityRuleResponse} representing the newly created rule.
     *
     * @throws ResourceNotFoundException   if the room specified in the request does not exist.
     * @throws UnauthorizedAccessException if the current user is not the creator of the room.
     */
    public AvailabilityRuleResponse addRule(AvailabilityRuleRequest ruleRequest) {
        User admin = currentUserService.getCurrentUser();

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

    /**
     * Retrieves all availability rules associated with the specified room.
     *
     * @param roomId The ID of the room whose availability rules are to be fetched.
     * @return A list of {@link AvailabilityRuleResponse} objects representing all rules
     *         defined for the given room.
     */
    public List<AvailabilityRuleResponse> getRulesForRoom(String roomId) {

        List<AvailabilityRule> rules = availabilityRuleRepository.findByRoomId(roomId);

        return rules.stream()
                .map(AvailabilityRuleMapper::toResponse)
                .toList();
    }

    /**
     * Deletes an availability rule by its ID, ensuring that only the room's creator (admin)
     * is allowed to perform this action.
     *
     * @param ruleId the ID of the rule to delete
     * @throws ResourceNotFoundException if the rule or its associated room is not found
     * @throws UnauthorizedAccessException if the current user is not the creator of the room
     */

    public void deleteRule(String ruleId) {
        User admin = currentUserService.getCurrentUser();

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

