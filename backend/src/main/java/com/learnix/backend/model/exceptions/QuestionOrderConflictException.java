package com.learnix.backend.model.exceptions;

public class QuestionOrderConflictException extends RuntimeException {
    public QuestionOrderConflictException(Long quizId, Integer orderIndex) {
        super("A question with order index %d already exists in quiz %d.".formatted(orderIndex, quizId));
    }
}

