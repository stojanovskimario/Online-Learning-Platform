package com.learnix.backend.model.exceptions;

public class LessonNotFoundException extends RuntimeException {
    public LessonNotFoundException(Long id) {
        super("A lesson with id %d does not exist.".formatted(id));
    }
}

