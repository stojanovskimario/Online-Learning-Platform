package com.learnix.backend.model.exceptions;

public class QuizAlreadyExistsException extends RuntimeException {
    public QuizAlreadyExistsException(Long lessonId) {
        super("A quiz already exists for lesson %d.".formatted(lessonId));
    }
}

