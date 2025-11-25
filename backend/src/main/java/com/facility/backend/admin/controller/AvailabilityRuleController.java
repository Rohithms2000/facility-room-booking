package com.facility.backend.admin.controller;

import com.facility.backend.dto.availability.AvailabilityRuleRequest;
import com.facility.backend.dto.availability.AvailabilityRuleResponse;
import com.facility.backend.admin.service.AvailabilityRuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/availability")
@RequiredArgsConstructor
public class AvailabilityRuleController {

    private final AvailabilityRuleService availabilityRuleService;

//    add an availability rule
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<AvailabilityRuleResponse> addRule(@Valid @RequestBody  AvailabilityRuleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(availabilityRuleService.addRule(request));
    }

//    get the rules for the particular room
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{roomId}")
    public ResponseEntity<List<AvailabilityRuleResponse>> getRulesForRoom(@PathVariable String roomId) {
        return ResponseEntity.ok(availabilityRuleService.getRulesForRoom(roomId));
    }

//    delete a rule
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{ruleId}")
    public ResponseEntity<String> deleteRule(@PathVariable String ruleId) {
        availabilityRuleService.deleteRule(ruleId);
        return ResponseEntity.ok("Rule deleted successfully");
    }
}
