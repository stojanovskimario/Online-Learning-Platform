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
                        user.getEmail(),
                        user.getRole(),
                        user.getSubscriptionTier()
                )
        );
    }

    public record UserSummary(
            Long id,
            String email,
            UserRole role,
            SubscriptionTier subscriptionTier
    ) {
    }
}

