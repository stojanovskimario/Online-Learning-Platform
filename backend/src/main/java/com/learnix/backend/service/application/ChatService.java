package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.ChatMessageDto;
import com.learnix.backend.model.dto.ChatResponseDto;

import java.util.List;

public interface ChatService {
    ChatResponseDto ask(Long userId, Long lessonId, String message);

    List<ChatMessageDto> getHistory(Long userId, Long lessonId);

    void clearHistory(Long userId, Long lessonId);
}
