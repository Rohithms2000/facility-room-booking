package com.facility.backend.admin.controller;

import com.facility.backend.dto.availability.AvailabilityRuleRequest;
import com.facility.backend.dto.availability.AvailabilityRuleResponse;
import com.facility.backend.admin.service.AvailabilityRuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/availability")
@RequiredArgsConstructor
public class AvailabilityRuleController {

    private final AvailabilityRuleService availabilityRuleService;

//    add an availability rule
    @PostMapping
    public ResponseEntity<AvailabilityRuleResponse> addRule(@RequestBody AvailabilityRuleRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(availabilityRuleService.addRule(request, auth));
    }

//    get the rules for the particular room
    @GetMapping("/{roomId}")
    public ResponseEntity<List<AvailabilityRuleResponse>> getRulesForRoom(@PathVariable String roomId) {
        return ResponseEntity.ok(availabilityRuleService.getRulesForRoom(roomId));
    }

//    delete a rule
    @DeleteMapping("/{ruleId}")
    public ResponseEntity<String> deleteRule(@PathVariable String ruleId, Authentication auth) {
        availabilityRuleService.deleteRule(ruleId, auth);
        return ResponseEntity.ok("Rule deleted successfully");
    }
}
