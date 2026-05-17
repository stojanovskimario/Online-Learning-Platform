package com.learnix.backend.web.controller;

import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.CourseProgressDto;
import com.learnix.backend.model.dto.LessonProgressDto;
import com.learnix.backend.service.application.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Progress", description = "Lesson completion and course progress endpoints")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping("/progress/{lessonId}/complete")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark a lesson as completed", description = "Marks the current authenticated user's lesson progress as completed and prevents duplicates.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lesson marked complete"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<LessonProgressDto> completeLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(progressService.completeLesson(getCurrentUserId(), lessonId));
    }

    @GetMapping("/progress/{lessonId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get lesson progress", description = "Returns whether the current authenticated user has completed the lesson.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lesson progress returned"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<LessonProgressDto> getLessonProgress(@PathVariable Long lessonId) {
        return ResponseEntity.ok(progressService.getLessonProgress(getCurrentUserId(), lessonId));
    }

    @GetMapping("/courses/{courseId}/progress")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get course progress", description = "Returns completed lesson count, total lessons, and percentage for the current authenticated user.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Course progress returned"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<CourseProgressDto> getCourseProgress(@PathVariable Long courseId) {
        return ResponseEntity.ok(progressService.getCourseProgress(getCurrentUserId(), courseId));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user.getId();
        }
        throw new RuntimeException("User not authenticated");
    }
}

