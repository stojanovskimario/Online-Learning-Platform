package com.learnix.backend.model.dto;

import com.learnix.backend.model.domain.AnswerOption;

import java.util.List;

public record DisplayAnswerOptionDto(
        Long id,
        String text,
        Integer orderIndex
) {
    public static DisplayAnswerOptionDto from(AnswerOption answerOption) {
        return new DisplayAnswerOptionDto(
                answerOption.getId(),
                answerOption.getText(),
                answerOption.getOrderIndex()
        );
    }

    public static List<DisplayAnswerOptionDto> from(List<AnswerOption> answerOptions) {
        return answerOptions.stream()
                .map(DisplayAnswerOptionDto::from)
                .toList();
    }
}

