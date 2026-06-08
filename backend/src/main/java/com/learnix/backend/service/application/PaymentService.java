package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.CheckoutResponseDto;

public interface PaymentService {
    CheckoutResponseDto createCheckoutSession(Long userId, String plan);

    void handleWebhookEvent(String payload, String sigHeader);
}

