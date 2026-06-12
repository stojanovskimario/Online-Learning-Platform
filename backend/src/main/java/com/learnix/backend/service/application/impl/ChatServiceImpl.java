package com.learnix.backend.service.application.impl;

import com.learnix.backend.config.GoogleAiProperties;
import com.learnix.backend.model.domain.AiChatMessage;
import com.learnix.backend.model.domain.Lesson;
import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.ChatMessageDto;
import com.learnix.backend.model.dto.ChatResponseDto;
import com.learnix.backend.model.enums.AiMessageRole;
import com.learnix.backend.model.exceptions.AiServiceException;
import com.learnix.backend.model.exceptions.LessonNotFoundException;
import com.learnix.backend.repository.AiChatMessageRepository;
import com.learnix.backend.repository.LessonRepository;
import com.learnix.backend.repository.UserRepository;
import com.learnix.backend.service.application.ChatService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class ChatServiceImpl implements ChatService {

    private static final String SYSTEM_INSTRUCTION = """
            You are Learnix, a helpful educational assistant.
            
            Use the lesson content when relevant, but supplement it with
            general knowledge when useful.
            
            Answer naturally without separating the response into
            "Lesson-Specific Information" and "General Knowledge" sections
            unless the user explicitly requests that distinction.
            
            Be accurate, concise, and easy to understand.
            """;

    private final RestClient googleAiRestClient;
    private final GoogleAiProperties googleAiProperties;
    private final AiChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;

    public ChatServiceImpl(
            RestClient googleAiRestClient,
            GoogleAiProperties googleAiProperties,
            AiChatMessageRepository chatMessageRepository,
            UserRepository userRepository,
            LessonRepository lessonRepository
    ) {
        this.googleAiRestClient = googleAiRestClient;
        this.googleAiProperties = googleAiProperties;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
    }

    @Override
    public ChatResponseDto ask(Long userId, Long lessonId, String message) {
        validateConfiguration();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AiServiceException("Current user was not found."));
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new LessonNotFoundException(lessonId));

        List<AiChatMessage> recentMessages = new ArrayList<>(
                chatMessageRepository.findTop10ByUserIdAndLessonIdOrderByCreatedAtDesc(userId, lessonId)
        );
        Collections.reverse(recentMessages);

        String prompt = buildPrompt(lesson, recentMessages, message);
        String answer = generateAnswer(prompt);

        chatMessageRepository.save(createMessage(user, lesson, AiMessageRole.USER, message));
        chatMessageRepository.save(createMessage(user, lesson, AiMessageRole.ASSISTANT, answer));

        user.setAiMessagesToday(user.getAiMessagesToday() + 1);
        userRepository.save(user);

        return new ChatResponseDto(answer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDto> getHistory(Long userId, Long lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new LessonNotFoundException(lessonId);
        }

        return chatMessageRepository.findByUserIdAndLessonIdOrderByCreatedAtAsc(userId, lessonId)
                .stream()
                .map(message -> new ChatMessageDto(
                        message.getId(),
                        message.getRole(),
                        message.getContent(),
                        message.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public void clearHistory(Long userId, Long lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new LessonNotFoundException(lessonId);
        }
        chatMessageRepository.deleteByUserIdAndLessonId(userId, lessonId);
    }

    private String generateAnswer(String prompt) {
        try {
            GeminiResponse response = googleAiRestClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1beta/models/{model}:generateContent")
                            .build(googleAiProperties.model()))
                    .header("x-goog-api-key", googleAiProperties.apiKey())
                    .body(new GeminiRequest(List.of(new Content(List.of(new Part(prompt))))))
                    .retrieve()
                    .body(GeminiResponse.class);

            String answer = response == null ? null : response.text();
            if (!StringUtils.hasText(answer)) {
                throw new AiServiceException("Google AI returned an empty response.");
            }
            return answer;
        } catch (AiServiceException ex) {
            throw ex;
        } catch (RestClientResponseException ex) {
            throw new AiServiceException(googleErrorMessage(ex), ex);
        } catch (ResourceAccessException ex) {
            throw new AiServiceException("Google AI took too long to respond. Please try again.", ex);
        } catch (Exception ex) {
            throw new AiServiceException("Unable to get a response from Google AI.", ex);
        }
    }

    private String googleErrorMessage(RestClientResponseException ex) {
        return switch (ex.getStatusCode().value()) {
            case 401, 403 -> "Google AI rejected the configured API key or its permissions.";
            case 429 -> "Google AI rate limit reached. Please try again shortly.";
            case 503 -> "Google AI is temporarily busy. Please try again shortly.";
            default -> "Google AI request failed with status %d.".formatted(ex.getStatusCode().value());
        };
    }

    private String buildPrompt(Lesson lesson, List<AiChatMessage> history, String message) {
        StringBuilder prompt = new StringBuilder()
                .append(SYSTEM_INSTRUCTION)
                .append("\nLesson title: ").append(lesson.getTitle())
                .append("\nLesson content:\n").append(lesson.getMarkdownContent())
                .append("\n\nRecent conversation:\n");

        for (AiChatMessage historyMessage : history) {
            prompt.append(historyMessage.getRole()).append(": ")
                    .append(historyMessage.getContent()).append('\n');
        }

        return prompt.append("USER: ").append(message).toString();
    }

    private AiChatMessage createMessage(User user, Lesson lesson, AiMessageRole role, String content) {
        AiChatMessage chatMessage = new AiChatMessage();
        chatMessage.setUser(user);
        chatMessage.setLesson(lesson);
        chatMessage.setRole(role);
        chatMessage.setContent(content);
        return chatMessage;
    }

    private void validateConfiguration() {
        if (!StringUtils.hasText(googleAiProperties.apiKey())) {
            throw new AiServiceException("GOOGLE_AI_API_KEY is not configured.");
        }
        if (!StringUtils.hasText(googleAiProperties.model())) {
            throw new AiServiceException("Google AI model is not configured.");
        }
    }

    private record GeminiRequest(List<Content> contents) {
    }

    private record Content(List<Part> parts) {
    }

    private record Part(String text) {
    }

    private record GeminiResponse(List<Candidate> candidates) {
        String text() {
            if (candidates == null || candidates.isEmpty()) {
                return null;
            }
            Content content = candidates.getFirst().content();
            if (content == null || content.parts() == null || content.parts().isEmpty()) {
                return null;
            }
            return content.parts().getFirst().text();
        }
    }

    private record Candidate(Content content) {
    }
}
