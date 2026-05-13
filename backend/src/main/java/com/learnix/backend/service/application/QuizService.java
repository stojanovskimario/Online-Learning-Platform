package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.DisplayQuizDto;

public interface QuizService {
    DisplayQuizDto getQuizByLesson(Long lessonId);

    DisplayQuizDto getQuizById(Long quizId);
}

