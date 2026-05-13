package com.learnix.backend.model.exceptions;

public class QuizAttemptLimitExceededException extends RuntimeException {
    public QuizAttemptLimitExceededException(Long quizId, Long userId) {
        super("You have reached the maximum of 3 quiz attempts for today for quiz %d and user %d.".formatted(quizId, userId));
    }
}

