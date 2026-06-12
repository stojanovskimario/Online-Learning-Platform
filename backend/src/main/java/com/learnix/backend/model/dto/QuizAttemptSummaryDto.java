package com.learnix.backend.model.dto;

public record QuizAttemptSummaryDto(
        Long attemptId,
        String quizTitle,
        String courseTitle,
        int score,
        boolean passed,
        String attemptedAt
) {
}

