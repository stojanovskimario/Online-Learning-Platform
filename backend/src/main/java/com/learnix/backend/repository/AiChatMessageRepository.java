package com.learnix.backend.repository;

import com.learnix.backend.model.domain.AiChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiChatMessageRepository extends JpaRepository<AiChatMessage, Long> {
    List<AiChatMessage> findByUserId(Long userId);

    List<AiChatMessage> findByLessonId(Long lessonId);

    List<AiChatMessage> findByUserIdAndLessonId(Long userId, Long lessonId);
}
