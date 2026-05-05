package com.learnix.backend.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CreateQuizDto(
        @NotBlank(message = "A quiz title is required.")
        String title,
        @Min(value = 0, message = "The pass score must be at least 0.")
        @Max(value = 100, message = "The pass score cannot exceed 100.")
        Integer passScore,
        @Positive(message = "The time limit must be positive.")
        Integer timeLimitSeconds
) {
}

