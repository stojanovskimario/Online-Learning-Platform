package com.learnix.backend.model.exceptions;

public class CourseNotFoundException extends RuntimeException {
    public CourseNotFoundException(Long id) {
        super("A course with id %d does not exist.".formatted(id));
    }
}

