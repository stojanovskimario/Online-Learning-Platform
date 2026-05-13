package com.learnix.backend.model.exceptions;

public class SectionOrderConflictException extends RuntimeException {
    public SectionOrderConflictException(Long courseId, Integer orderIndex) {
        super("A section with order index %d already exists in course %d.".formatted(orderIndex, courseId));
    }
}

