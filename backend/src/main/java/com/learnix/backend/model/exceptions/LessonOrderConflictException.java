package com.learnix.backend.model.exceptions;

public class LessonOrderConflictException extends RuntimeException {
    public LessonOrderConflictException(Long courseId, Integer orderIndex) {
        super("A lesson with order index %d already exists in course %d.".formatted(orderIndex, courseId));
    }
}

