package com.learnix.backend.model.dto;

import java.time.LocalDateTime;

public record QuizAttemptResultDto(
        Long attemptId,
        Long quizId,
        int score,
        int correctAnswers,
        int totalQuestions,
        boolean passed,
        LocalDateTime attemptedAt
) {
}

