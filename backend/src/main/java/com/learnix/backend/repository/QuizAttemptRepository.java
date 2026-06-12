package com.learnix.backend.repository;

import com.learnix.backend.model.domain.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

import java.util.List;
import org.springframework.data.domain.Pageable;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserId(Long userId);

    List<QuizAttempt> findByQuizId(Long quizId);

    List<QuizAttempt> findByUserIdAndQuizId(Long userId, Long quizId);

    List<QuizAttempt> findByUserIdOrderByAttemptedAtDesc(Long userId, Pageable pageable);

    long countByUserIdAndQuizIdAndAttemptedAtGreaterThanEqualAndAttemptedAtLessThan(
            Long userId,
            Long quizId,
            LocalDateTime start,
            LocalDateTime end
    );
}
