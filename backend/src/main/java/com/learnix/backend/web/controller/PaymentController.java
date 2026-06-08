package com.learnix.backend.web.controller;

import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.CheckoutRequestDto;
import com.learnix.backend.model.dto.CheckoutResponseDto;
import com.learnix.backend.service.application.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/api/payments/checkout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CheckoutResponseDto> createCheckoutSession(@RequestBody @Valid CheckoutRequestDto requestDto) {
        return ResponseEntity.ok(paymentService.createCheckoutSession(getCurrentUserId(), requestDto.plan()));
    }

    @RequestMapping(value = "/api/webhooks/stripe", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        paymentService.handleWebhookEvent(payload, sigHeader);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user.getId();
        }
        throw new RuntimeException("User not authenticated");
    }
}

