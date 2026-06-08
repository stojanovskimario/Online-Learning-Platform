package com.learnix.backend.service.application.impl;

import com.learnix.backend.config.StripeProperties;
import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.CheckoutResponseDto;
import com.learnix.backend.model.enums.SubscriptionTier;
import com.learnix.backend.repository.UserRepository;
import com.learnix.backend.service.application.PaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.Invoice;
import com.stripe.model.StripeObject;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final UserRepository userRepository;
    private final StripeProperties stripeProperties;

    public PaymentServiceImpl(UserRepository userRepository, StripeProperties stripeProperties) {
        this.userRepository = userRepository;
        this.stripeProperties = stripeProperties;
    }

    @Override
    public CheckoutResponseDto createCheckoutSession(Long userId, String plan) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String priceId = resolvePriceId(plan);

        if (user.getStripeCustomerId() == null || user.getStripeCustomerId().isBlank()) {
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                    .setEmail(user.getEmail())
                    .build();
            Customer customer = createCustomer(customerParams);
            user.setStripeCustomerId(customer.getId());
            userRepository.save(user);
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setClientReferenceId(userId.toString())
                .putMetadata("plan", plan)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(priceId)
                                .setQuantity(1L)
                                .build()
                )
                .setCustomer(user.getStripeCustomerId())
                .setSuccessUrl(stripeProperties.successUrl())
                .setCancelUrl(stripeProperties.cancelUrl())
                .build();

        Session session = createSession(params);
        return new CheckoutResponseDto(session.getUrl());
    }

    @Override
    @Transactional
    public void handleWebhookEvent(String payload, String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeProperties.webhookSecret());
        } catch (SignatureVerificationException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Stripe signature", ex);
        }

        switch (event.getType()) {
            case "checkout.session.completed" -> handleCheckoutSessionCompleted(event);
            case "customer.subscription.deleted" -> handleSubscriptionDeleted(event);
            case "invoice.payment_failed" -> handleInvoicePaymentFailed(event);
            default -> log.debug("Ignoring unsupported Stripe event type: {}", event.getType());
        }
    }

    private void handleCheckoutSessionCompleted(Event event) {
        Session session = deserialize(event, Session.class);
        String userIdValue = session.getClientReferenceId();
        String plan = Optional.ofNullable(session.getMetadata()).map(metadata -> metadata.get("plan")).orElse(null);

        if (userIdValue == null || plan == null) {
            log.warn("Stripe checkout.session.completed is missing clientReferenceId or plan metadata");
            return;
        }

        long userId;
        try {
            userId = Long.parseLong(userIdValue);
        } catch (NumberFormatException ex) {
            log.warn("Invalid clientReferenceId on Stripe session: {}", userIdValue);
            return;
        }

        SubscriptionTier tier = resolveTier(plan);
        if (tier == null) {
            log.warn("Unknown subscription plan in Stripe metadata: {}", plan);
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));

        user.setSubscriptionTier(tier);
        userRepository.saveAndFlush(user);
        log.info("Updated user {} to {} after successful Stripe checkout", user.getId(), tier);
    }

    private void handleSubscriptionDeleted(Event event) {
        Subscription subscription = deserialize(event, Subscription.class);
        String customerId = subscription.getCustomer();
        if (customerId == null || customerId.isBlank()) {
            return;
        }

        userRepository.findByStripeCustomerId(customerId).ifPresent(user -> {
            user.setSubscriptionTier(SubscriptionTier.FREE);
            userRepository.saveAndFlush(user);
            log.info("Downgraded user {} to FREE after Stripe subscription deletion", user.getId());
        });
    }

    private void handleInvoicePaymentFailed(Event event) {
        Invoice invoice = deserialize(event, Invoice.class);
        String customerId = invoice.getCustomer();
        if (customerId == null || customerId.isBlank()) {
            log.warn("Stripe invoice.payment_failed received without a customer id");
            return;
        }

        userRepository.findByStripeCustomerId(customerId).ifPresent(user ->
                log.warn("Stripe payment failed for user {} (customer {})", user.getId(), customerId)
        );
    }

    private String resolvePriceId(String plan) {
        return switch (plan) {
            case "PREMIUM_MONTHLY" -> stripeProperties.priceId().premiumMonthly();
            case "PREMIUM_ANNUAL" -> stripeProperties.priceId().premiumAnnual();
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported plan: " + plan);
        };
    }

    private SubscriptionTier resolveTier(String plan) {
        return switch (plan) {
            case "PREMIUM_MONTHLY" -> SubscriptionTier.PREMIUM_MONTHLY;
            case "PREMIUM_ANNUAL" -> SubscriptionTier.PREMIUM_ANNUAL;
            default -> null;
        };
    }

    private Customer createCustomer(CustomerCreateParams params) {
        try {
            return Customer.create(params);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to create Stripe customer", ex);
        }
    }

    private Session createSession(SessionCreateParams params) {
        try {
            return Session.create(params);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to create Stripe checkout session", ex);
        }
    }

    @SuppressWarnings("deprecation")
    private <T extends StripeObject> T deserialize(Event event, Class<T> type) {
        StripeObject stripeObject = event.getData().getObject();
        if (stripeObject == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to deserialize Stripe event");
        }

        return type.cast(stripeObject);
    }
}












