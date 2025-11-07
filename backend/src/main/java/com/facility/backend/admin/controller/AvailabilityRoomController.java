package com.facility.backend.admin.controller;

import com.facility.backend.model.AvailabilityRule;
import com.facility.backend.admin.service.AvailabilityRuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/availability")
@RequiredArgsConstructor
public class AvailabilityRoomController {

    private final AvailabilityRuleService availabilityRuleService;

    @PostMapping
    public ResponseEntity<?> addRule(@RequestBody AvailabilityRule request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(availabilityRuleService.addRule(request, auth));
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRulesForRoom(@PathVariable String roomId, Authentication auth) {
        return ResponseEntity.ok(availabilityRuleService.getRulesForRoom(roomId, auth));
    }

    @DeleteMapping("/{ruleId}")
    public ResponseEntity<?> deleteRule(@PathVariable String ruleId, Authentication auth) {
        availabilityRuleService.deleteRule(ruleId, auth);
        return ResponseEntity.ok("Rule deleted successfully");
    }
}
