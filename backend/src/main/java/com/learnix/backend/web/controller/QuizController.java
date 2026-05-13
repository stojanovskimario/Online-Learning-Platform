package com.learnix.backend.web.controller;

import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.CreateQuestionDto;
import com.learnix.backend.model.dto.CreateQuizDto;
import com.learnix.backend.model.dto.DisplayQuestionDto;
import com.learnix.backend.model.dto.DisplayQuizDto;
import com.learnix.backend.model.dto.QuizAttemptResultDto;
import com.learnix.backend.model.dto.QuizAttemptSubmissionDto;
import com.learnix.backend.service.application.QuizAttemptService;
import com.learnix.backend.service.application.QuizManagementService;
import com.learnix.backend.service.application.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Quizzes", description = "Quiz management and attempt endpoints")
public class QuizController {

    private final QuizService quizService;
    private final QuizManagementService quizManagementService;
    private final QuizAttemptService quizAttemptService;

    public QuizController(
            QuizService quizService,
            QuizManagementService quizManagementService,
            QuizAttemptService quizAttemptService
    ) {
        this.quizService = quizService;
        this.quizManagementService = quizManagementService;
        this.quizAttemptService = quizAttemptService;
    }

    @PostMapping("/lessons/{lessonId}/quiz")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Create a quiz for a lesson", description = "Creates a quiz linked to the given lesson. Each lesson can have only one quiz.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Quiz created"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Lesson not found"),
            @ApiResponse(responseCode = "409", description = "Quiz already exists")
    })
    public ResponseEntity<DisplayQuizDto> createQuiz(
            @PathVariable Long lessonId,
            @RequestBody @Valid CreateQuizDto createQuizDto
    ) {
        return ResponseEntity.ok(quizManagementService.createQuiz(lessonId, createQuizDto));
    }

    @PutMapping("/quizzes/{quizId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Update a quiz", description = "Updates quiz metadata.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Quiz updated"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Quiz not found")
    })
    public ResponseEntity<DisplayQuizDto> updateQuiz(
            @PathVariable Long quizId,
            @RequestBody @Valid CreateQuizDto createQuizDto
    ) {
        return ResponseEntity.ok(quizManagementService.updateQuiz(quizId, createQuizDto));
    }

    @DeleteMapping("/quizzes/{quizId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Delete a quiz", description = "Deletes a quiz with all questions, answers, attempts, and attempt answers.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Quiz deleted"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Quiz not found")
    })
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long quizId) {
        quizManagementService.deleteQuiz(quizId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/quizzes/{quizId}/questions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Create a question", description = "Creates a question with answer options for a quiz.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Question created"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Quiz not found"),
            @ApiResponse(responseCode = "409", description = "Question order conflict")
    })
    public ResponseEntity<DisplayQuestionDto> createQuestion(
            @PathVariable Long quizId,
            @RequestBody @Valid CreateQuestionDto createQuestionDto
    ) {
        return ResponseEntity.ok(quizManagementService.createQuestion(quizId, createQuestionDto));
    }

    @PutMapping("/questions/{questionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Update a question", description = "Updates question metadata and answer options when possible.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Question updated"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Question not found"),
            @ApiResponse(responseCode = "409", description = "Question order conflict or question already has attempts")
    })
    public ResponseEntity<DisplayQuestionDto> updateQuestion(
            @PathVariable Long questionId,
            @RequestBody @Valid CreateQuestionDto createQuestionDto
    ) {
        return ResponseEntity.ok(quizManagementService.updateQuestion(questionId, createQuestionDto));
    }

    @DeleteMapping("/questions/{questionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Delete a question", description = "Deletes a question and its answer options.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Question deleted"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Question not found")
    })
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long questionId) {
        quizManagementService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/lessons/{lessonId}/quiz")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get quiz by lesson", description = "Returns the quiz, questions, and answer options for a lesson without exposing correct answers.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Quiz returned"),
            @ApiResponse(responseCode = "404", description = "Quiz not found")
    })
    public ResponseEntity<DisplayQuizDto> getQuizByLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(quizService.getQuizByLesson(lessonId));
    }

    @PostMapping("/quizzes/{quizId}/attempt")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Submit a quiz attempt", description = "Submits answers for a quiz, computes the score on the backend, and stores the attempt.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Attempt stored"),
            @ApiResponse(responseCode = "400", description = "Invalid submission"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Quiz not found"),
            @ApiResponse(responseCode = "429", description = "Attempt limit exceeded")
    })
    public ResponseEntity<QuizAttemptResultDto> submitAttempt(
            @PathVariable Long quizId,
            @RequestBody @Valid QuizAttemptSubmissionDto submissionDto
    ) {
        return ResponseEntity.ok(quizAttemptService.submitAttempt(getCurrentUserId(), quizId, submissionDto));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user.getId();
        }
        throw new RuntimeException("User not authenticated");
    }
}

