package com.learnix.backend.model.dto;

import com.learnix.backend.model.enums.AiMessageRole;

import java.time.LocalDateTime;

public record ChatMessageDto(
        Long id,
        AiMessageRole role,
        String content,
        LocalDateTime createdAt
) {
}
