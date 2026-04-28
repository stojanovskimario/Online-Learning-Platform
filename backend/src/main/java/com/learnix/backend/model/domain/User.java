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

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private SubscriptionTier subscriptionTier;

    @Column(name = "ai_messages_today", nullable = false)
    private int aiMessagesToday = 0;

    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;
}
