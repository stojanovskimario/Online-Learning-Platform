package com.learnix.backend.model.dto;

import com.learnix.backend.model.domain.Lesson;

import java.util.List;

public record DisplayLessonDto(
        Long id,
        Long courseId,
        Long sectionId,
        String title,
        String content,
        Integer orderIndex,
        String videoUrl
) {
    public static DisplayLessonDto from(Lesson lesson) {
        return new DisplayLessonDto(
                lesson.getId(),
                lesson.getSection() != null && lesson.getSection().getCourse() != null ? lesson.getSection().getCourse().getId() : null,
                lesson.getSection() != null ? lesson.getSection().getId() : null,
                lesson.getTitle(),
                lesson.getMarkdownContent(),
                lesson.getOrderIndex(),
                lesson.getVideoUrl()
        );
    }

    public static List<DisplayLessonDto> from(List<Lesson> lessons) {
        return lessons.stream()
                .map(DisplayLessonDto::from)
                .toList();
    }
}

