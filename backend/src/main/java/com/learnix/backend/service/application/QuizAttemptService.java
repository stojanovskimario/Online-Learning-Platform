package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.QuizAttemptResultDto;
import com.learnix.backend.model.dto.QuizAttemptSummaryDto;
import com.learnix.backend.model.dto.QuizAttemptSubmissionDto;

import java.util.List;

public interface QuizAttemptService {
    QuizAttemptResultDto submitAttempt(Long userId, Long quizId, QuizAttemptSubmissionDto submissionDto);

    List<QuizAttemptSummaryDto> getRecentAttempts(Long userId, int limit);
}

