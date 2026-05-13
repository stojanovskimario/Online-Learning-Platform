package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.UpdateUserDto;
import com.learnix.backend.model.dto.UserProfileDto;

import java.util.List;
import java.util.Optional;

public interface UserManagementService {
    
    Optional<UserProfileDto> findById(Long id);
    
    Optional<UserProfileDto> findByEmail(String email);
    
    List<UserProfileDto> findAll();
    
    UserProfileDto updateProfile(Long userId, UpdateUserDto updateUserDto);
    
    UserProfileDto updateUserRole(Long userId, com.learnix.backend.model.enums.UserRole newRole);
    
    UserProfileDto updateSubscriptionTier(Long userId, com.learnix.backend.model.enums.SubscriptionTier newTier);
    
    void deleteUser(Long userId);
    
    boolean existsByEmail(String email);
    
    boolean existsById(Long id);
    
    void incrementAiMessagesCount(Long userId);
    
    void resetAiMessagesCount(Long userId);
}
