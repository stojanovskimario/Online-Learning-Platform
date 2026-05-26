package com.learnix.backend.model.dto;

import com.learnix.backend.model.enums.QuestionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateQuestionDto(
        @NotNull(message = "A question type is required.")
        QuestionType type,
        @NotBlank(message = "A question text is required.")
        String text,
        @Size(max = 4000, message = "The explanation should be up to 4000 characters.")
        String explanation,
        @NotNull(message = "The order index is required.")
        Integer orderIndex,
        // true = render checkboxes and require ALL correct options selected
        // false = render radio buttons (single answer only)
        Boolean allowsMultiple,
        @NotEmpty(message = "At least two answer options are required.")
        List<@Valid CreateAnswerOptionDto> answerOptions
) {
}

