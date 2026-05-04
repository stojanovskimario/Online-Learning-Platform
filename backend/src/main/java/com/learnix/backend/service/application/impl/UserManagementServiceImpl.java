package com.learnix.backend.service.application.impl;

import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.UpdateUserDto;
import com.learnix.backend.model.dto.UserProfileDto;
import com.learnix.backend.repository.UserRepository;
import com.learnix.backend.service.application.UserManagementService;
import com.learnix.backend.service.domain.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserManagementServiceImpl implements UserManagementService {

    private final UserRepository userRepository;
    private final UserService userService;

    public UserManagementServiceImpl(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserProfileDto> findById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserProfileDto> findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileDto> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserProfileDto updateProfile(Long userId, UpdateUserDto updateUserDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (updateUserDto.getUsername() != null) {
            user.setUsername(updateUserDto.getUsername());
        }
        if (updateUserDto.getEmail() != null) {
            if (!user.getEmail().equals(updateUserDto.getEmail()) && 
                userRepository.existsByEmail(updateUserDto.getEmail())) {
                throw new RuntimeException("Email already exists: " + updateUserDto.getEmail());
            }
            user.setEmail(updateUserDto.getEmail());
        }
        if (updateUserDto.getFirstName() != null) {
            user.setFirstName(updateUserDto.getFirstName());
        }
        if (updateUserDto.getLastName() != null) {
            user.setLastName(updateUserDto.getLastName());
        }
        if (updateUserDto.getRole() != null) {
            user.setRole(updateUserDto.getRole());
        }
        if (updateUserDto.getSubscriptionTier() != null) {
            user.setSubscriptionTier(updateUserDto.getSubscriptionTier());
        }

        User savedUser = userService.save(user);
        return convertToDto(savedUser);
    }

    @Override
    public UserProfileDto updateUserRole(Long userId, com.learnix.backend.model.enums.UserRole newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setRole(newRole);
        User savedUser = userService.save(user);
        return convertToDto(savedUser);
    }

    @Override
    public UserProfileDto updateSubscriptionTier(Long userId, com.learnix.backend.model.enums.SubscriptionTier newTier) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setSubscriptionTier(newTier);
        User savedUser = userService.save(user);
        return convertToDto(savedUser);
    }

    @Override
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }

    @Override
    public void incrementAiMessagesCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setAiMessagesToday(user.getAiMessagesToday() + 1);
        userService.save(user);
    }

    @Override
    public void resetAiMessagesCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setAiMessagesToday(0);
        userService.save(user);
    }

    private UserProfileDto convertToDto(User user) {
        return new UserProfileDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getSubscriptionTier(),
                user.getAiMessagesToday(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
