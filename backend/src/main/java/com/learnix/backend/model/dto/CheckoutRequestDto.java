package com.learnix.backend.model.dto;

import jakarta.validation.constraints.NotNull;

public record CheckoutRequestDto(
        @NotNull String plan
) {
}

