package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.CreateQuestionDto;
import com.learnix.backend.model.dto.CreateQuizDto;
import com.learnix.backend.model.dto.DisplayQuestionDto;
import com.learnix.backend.model.dto.DisplayQuizDto;

public interface QuizManagementService {
    DisplayQuizDto createQuiz(Long lessonId, CreateQuizDto createQuizDto);

    DisplayQuizDto updateQuiz(Long quizId, CreateQuizDto createQuizDto);

    void deleteQuiz(Long quizId);

    DisplayQuestionDto createQuestion(Long quizId, CreateQuestionDto createQuestionDto);

    DisplayQuestionDto updateQuestion(Long questionId, CreateQuestionDto createQuestionDto);

    void deleteQuestion(Long questionId);
}

