package com.learnix.backend.web.controller;

import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.UpdateUserDto;
import com.learnix.backend.model.dto.UserProfileDto;
import com.learnix.backend.service.application.UserManagementService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserManagementService userManagementService;

    public UserController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileDto> getCurrentUserProfile() {
        return ResponseEntity.ok(userManagementService.findById(getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Current user not found")));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<UserProfileDto> getUserById(@PathVariable Long id) {
        return userManagementService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfileDto>> getAllUsers() {
        return ResponseEntity.ok(userManagementService.findAll());
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileDto> updateCurrentUserProfile(
            @RequestBody @Valid UpdateUserDto updateUserDto) {
        return ResponseEntity.ok(userManagementService.updateProfile(getCurrentUserId(), updateUserDto));
    }

    @PutMapping("/{id}/profile")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<UserProfileDto> updateUserProfile(
            @PathVariable Long id,
            @RequestBody @Valid UpdateUserDto updateUserDto) {
        return userManagementService.findById(id)
                .map(user -> ResponseEntity.ok(userManagementService.updateProfile(id, updateUserDto)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileDto> updateUserRole(
            @PathVariable Long id,
            @RequestParam com.learnix.backend.model.enums.UserRole role) {
        return userManagementService.findById(id)
                .map(user -> ResponseEntity.ok(userManagementService.updateUserRole(id, role)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/subscription")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileDto> updateSubscriptionTier(
            @PathVariable Long id,
            @RequestParam com.learnix.backend.model.enums.SubscriptionTier tier) {
        return userManagementService.findById(id)
                .map(user -> ResponseEntity.ok(userManagementService.updateSubscriptionTier(id, tier)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userManagementService.existsById(id)) {
            userManagementService.deleteUser(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/reset-ai-messages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> resetAiMessagesCount(@PathVariable Long id) {
        if (userManagementService.existsById(id)) {
            userManagementService.resetAiMessagesCount(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return ((User) authentication.getPrincipal()).getId();
        }
        throw new RuntimeException("User not authenticated");
    }
}
