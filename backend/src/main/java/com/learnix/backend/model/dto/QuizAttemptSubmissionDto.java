package com.learnix.backend.model.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.Map;

public record QuizAttemptSubmissionDto(
        @NotEmpty(message = "Answers are required.")
        Map<Long, Long> answers
) {
}

