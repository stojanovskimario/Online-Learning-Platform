package com.learnix.backend.model.domain;

import com.learnix.backend.model.enums.SubscriptionTier;
import com.learnix.backend.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "users")
public class User extends BaseAuditableEntity{
    @Column(nullable = false,unique = true)
    String username;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private SubscriptionTier subscriptionTier;
}
