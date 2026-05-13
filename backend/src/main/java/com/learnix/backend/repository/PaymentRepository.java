package com.learnix.backend.repository;

import com.learnix.backend.model.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);

    List<Payment> findByCourseId(Long courseId);

    Optional<Payment> findByStripeCheckoutSessionId(String stripeCheckoutSessionId);

    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);
}
