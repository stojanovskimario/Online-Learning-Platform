package com.learnix.backend.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateAnswerOptionDto(
        @NotBlank(message = "Answer option text is required.")
        String text,
        @NotNull(message = "Answer option order is required.")
        Integer orderIndex,
        boolean correct
) {
}

