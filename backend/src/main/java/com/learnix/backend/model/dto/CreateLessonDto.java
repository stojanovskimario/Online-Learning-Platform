package com.learnix.backend.model.dto;

import com.learnix.backend.model.domain.Lesson;
import com.learnix.backend.model.domain.Section;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateLessonDto(
        @NotBlank(message = "A title is required.")
        String title,
        @NotBlank(message = "Lesson content is required.")
        String content,
        @NotNull(message = "The order index is required.")
        Integer orderIndex
) {
    public Lesson toLesson(Section section) {
        Lesson lesson = new Lesson();
        lesson.setSection(section);
        lesson.setTitle(title);
        lesson.setMarkdownContent(content);
        lesson.setOrderIndex(orderIndex);
        return lesson;
    }
}

