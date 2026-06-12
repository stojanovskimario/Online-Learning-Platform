package com.learnix.backend.web.controller;

import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.ChatMessageDto;
import com.learnix.backend.model.dto.ChatRequestDto;
import com.learnix.backend.model.dto.ChatResponseDto;
import com.learnix.backend.service.application.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@PreAuthorize("isAuthenticated()")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDto> ask(@RequestBody @Valid ChatRequestDto request) {
        return ResponseEntity.ok(chatService.ask(getCurrentUserId(), request.lessonId(), request.message()));
    }

    @GetMapping("/lessons/{lessonId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getHistory(@PathVariable Long lessonId) {
        return ResponseEntity.ok(chatService.getHistory(getCurrentUserId(), lessonId));
    }

    @DeleteMapping("/lessons/{lessonId}/messages")
    public ResponseEntity<Void> clearHistory(@PathVariable Long lessonId) {
        chatService.clearHistory(getCurrentUserId(), lessonId);
        return ResponseEntity.noContent().build();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user.getId();
        }
        throw new IllegalStateException("User not authenticated.");
    }
}
