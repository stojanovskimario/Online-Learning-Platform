package com.learnix.backend.model.exceptions;

public class QuestionHasAttemptsException extends RuntimeException {
    public QuestionHasAttemptsException(Long questionId) {
        super("Question %d already has quiz attempts and answer options cannot be modified.".formatted(questionId));
    }
}

