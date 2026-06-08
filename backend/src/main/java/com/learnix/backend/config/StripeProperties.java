package com.learnix.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "stripe")
public record StripeProperties(
        String secretKey,
        String webhookSecret,
        PriceIds priceId,
        String successUrl,
        String cancelUrl
) {
    public record PriceIds(String premiumMonthly, String premiumAnnual) {
    }
}

