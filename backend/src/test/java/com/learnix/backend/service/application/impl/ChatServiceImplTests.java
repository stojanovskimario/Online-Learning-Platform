package com.learnix.backend.service.application.impl;

import com.learnix.backend.config.GoogleAiProperties;
import com.learnix.backend.model.domain.AiChatMessage;
import com.learnix.backend.model.domain.Lesson;
import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.ChatResponseDto;
import com.learnix.backend.model.enums.AiMessageRole;
import com.learnix.backend.model.exceptions.AiServiceException;
import com.learnix.backend.repository.AiChatMessageRepository;
import com.learnix.backend.repository.LessonRepository;
import com.learnix.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class ChatServiceImplTests {

    private final AiChatMessageRepository chatMessageRepository = mock(AiChatMessageRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final LessonRepository lessonRepository = mock(LessonRepository.class);

    @Test
    void askSavesConversationAndReturnsGeminiAnswer() {
        RestClient.Builder restClientBuilder = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com");
        MockRestServiceServer server = MockRestServiceServer.bindTo(restClientBuilder).build();
        ChatServiceImpl service = createService(restClientBuilder.build(), "test-key");

        User user = new User();
        Lesson lesson = new Lesson();
        lesson.setTitle("Java basics");
        lesson.setMarkdownContent("Variables store values.");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(lessonRepository.findById(2L)).thenReturn(Optional.of(lesson));
        when(chatMessageRepository.findTop10ByUserIdAndLessonIdOrderByCreatedAtDesc(1L, 2L))
                .thenReturn(List.of());

        server.expect(requestTo("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"))
                .andExpect(header("x-goog-api-key", "test-key"))
                .andRespond(withSuccess("""
                        {"candidates":[{"content":{"parts":[{"text":"A variable stores a value."}]}}]}
                        """, MediaType.APPLICATION_JSON));

        ChatResponseDto response = service.ask(1L, 2L, "What is a variable?");

        assertThat(response.answer()).isEqualTo("A variable stores a value.");
        assertThat(user.getAiMessagesToday()).isEqualTo(1);
        verify(chatMessageRepository, org.mockito.Mockito.times(2)).save(any(AiChatMessage.class));
        verify(userRepository).save(user);
        server.verify();
    }

    @Test
    void askRejectsMissingApiKeyBeforeCallingRepositories() {
        ChatServiceImpl service = createService(RestClient.create(), "");

        assertThatThrownBy(() -> service.ask(1L, 2L, "Hello"))
                .isInstanceOf(AiServiceException.class)
                .hasMessage("GOOGLE_AI_API_KEY is not configured.");
    }

    @Test
    void getHistoryReturnsMessagesInRepositoryOrder() {
        ChatServiceImpl service = createService(RestClient.create(), "test-key");
        AiChatMessage userMessage = new AiChatMessage();
        userMessage.setRole(AiMessageRole.USER);
        userMessage.setContent("Question");
        AiChatMessage assistantMessage = new AiChatMessage();
        assistantMessage.setRole(AiMessageRole.ASSISTANT);
        assistantMessage.setContent("Answer");

        when(lessonRepository.existsById(2L)).thenReturn(true);
        when(chatMessageRepository.findByUserIdAndLessonIdOrderByCreatedAtAsc(1L, 2L))
                .thenReturn(List.of(userMessage, assistantMessage));

        assertThat(service.getHistory(1L, 2L))
                .extracting(message -> message.role())
                .containsExactly(AiMessageRole.USER, AiMessageRole.ASSISTANT);
    }

    @Test
    void clearHistoryDeletesOnlyCurrentUsersLessonMessages() {
        ChatServiceImpl service = createService(RestClient.create(), "test-key");
        when(lessonRepository.existsById(2L)).thenReturn(true);

        service.clearHistory(1L, 2L);

        verify(chatMessageRepository).deleteByUserIdAndLessonId(1L, 2L);
    }

    private ChatServiceImpl createService(RestClient restClient, String apiKey) {
        return new ChatServiceImpl(
                restClient,
                new GoogleAiProperties(apiKey, "gemini-2.5-flash"),
                chatMessageRepository,
                userRepository,
                lessonRepository
        );
    }
}
