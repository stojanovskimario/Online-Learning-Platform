package com.learnix.backend.model.dto;

import com.learnix.backend.model.domain.LessonProgress;

import java.time.LocalDateTime;

public record LessonProgressDto(
        Long lessonId,
        Long userId,
        boolean completed,
        LocalDateTime completedAt
) {
    public static LessonProgressDto from(LessonProgress lessonProgress) {
        return new LessonProgressDto(
                lessonProgress.getLesson() != null ? lessonProgress.getLesson().getId() : null,
                lessonProgress.getUser() != null ? lessonProgress.getUser().getId() : null,
                lessonProgress.isCompleted(),
                lessonProgress.getCompletedAt()
        );
    }
}

