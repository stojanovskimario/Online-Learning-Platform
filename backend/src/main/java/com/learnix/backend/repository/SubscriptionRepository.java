package com.learnix.backend.repository;

import com.learnix.backend.model.domain.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserId(Long userId);

    Optional<Subscription> findByStripeSubscriptionId(String stripeSubscriptionId);
}
