package com.learnix.backend.repository;

import com.learnix.backend.model.domain.AttemptAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttemptAnswerRepository extends JpaRepository<AttemptAnswer, Long> {
    List<AttemptAnswer> findByQuizAttemptId(Long quizAttemptId);
}
