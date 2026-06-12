package com.learnix.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "google.ai")
public record GoogleAiProperties(String apiKey, String model) {
}
