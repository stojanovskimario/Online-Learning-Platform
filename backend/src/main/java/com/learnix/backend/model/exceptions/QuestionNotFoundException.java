package com.learnix.backend.model.exceptions;

public class QuestionNotFoundException extends RuntimeException {
    public QuestionNotFoundException(Long id) {
        super("A question with id %d does not exist.".formatted(id));
    }
}

