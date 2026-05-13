package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.QuizAttemptResultDto;
import com.learnix.backend.model.dto.QuizAttemptSubmissionDto;

public interface QuizAttemptService {
    QuizAttemptResultDto submitAttempt(Long userId, Long quizId, QuizAttemptSubmissionDto submissionDto);
}

