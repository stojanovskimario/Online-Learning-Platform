package com.learnix.backend.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateLessonDto(
        @NotBlank(message = "A title is required.")
        String title,
        @NotBlank(message = "Lesson content is required.")
        String content,
        @NotNull(message = "The order index is required.")
        Integer orderIndex
) {
}

