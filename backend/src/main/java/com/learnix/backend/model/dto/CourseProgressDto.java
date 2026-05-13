package com.learnix.backend.model.dto;

public record CourseProgressDto(
        Long courseId,
        long completedLessons,
        long totalLessons,
        double percentage
) {
}

