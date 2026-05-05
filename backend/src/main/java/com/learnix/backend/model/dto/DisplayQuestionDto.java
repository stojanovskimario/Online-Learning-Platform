package com.learnix.backend.model.dto;

import com.learnix.backend.model.domain.AnswerOption;
import com.learnix.backend.model.domain.Question;
import com.learnix.backend.model.enums.QuestionType;

import java.util.List;

public record DisplayQuestionDto(
        Long id,
        QuestionType type,
        String text,
        String explanation,
        Integer orderIndex,
        List<DisplayAnswerOptionDto> answerOptions
) {
    public static DisplayQuestionDto from(Question question, List<AnswerOption> answerOptions) {
        return new DisplayQuestionDto(
                question.getId(),
                question.getType(),
                question.getPrompt(),
                question.getExplanation(),
                question.getOrderIndex(),
                DisplayAnswerOptionDto.from(answerOptions)
        );
    }

    public static List<DisplayQuestionDto> from(List<Question> questions, java.util.function.Function<Long, List<AnswerOption>> answerOptionsLoader) {
        return questions.stream()
                .map(question -> from(question, answerOptionsLoader.apply(question.getId())))
                .toList();
    }
}

