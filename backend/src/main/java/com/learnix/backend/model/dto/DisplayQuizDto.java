package com.learnix.backend.model.dto;

import java.util.List;

public record DisplayQuizDto(
        Long id,
        Long lessonId,
        String title,
        Integer passScore,
        Integer timeLimitSeconds,
        List<DisplayQuestionDto> questions
) {
}

