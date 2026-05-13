package com.learnix.backend.model.dto.auth;

import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.enums.SubscriptionTier;
import com.learnix.backend.model.enums.UserRole;

public record AuthResponseDto(
        String accessToken,
        UserSummary user
) {
    public static AuthResponseDto from(String accessToken, User user) {
        return new AuthResponseDto(
                accessToken,
                new UserSummary(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getRole(),
                        user.getSubscriptionTier()
                )
        );
    }

    public record UserSummary(
            Long id,
            String username,
            String email,
            String firstName,
            String lastName,
            UserRole role,
            SubscriptionTier subscriptionTier
    ) {
    }
}