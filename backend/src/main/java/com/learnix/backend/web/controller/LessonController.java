package com.learnix.backend.web.controller;

import com.learnix.backend.model.dto.CreateLessonDto;
import com.learnix.backend.model.dto.DisplayLessonDto;
import com.learnix.backend.model.dto.UpdateLessonDto;
import com.learnix.backend.service.application.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Lessons", description = "Lesson management endpoints")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @PostMapping("/courses/{courseId}/lessons")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Create a lesson for a course", description = "Creates a new lesson linked to the given course and keeps order index unique within that course.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lesson created"),
            @ApiResponse(responseCode = "400", description = "Invalid lesson data or duplicate order index"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    public ResponseEntity<DisplayLessonDto> createLesson(
            @PathVariable Long courseId,
            @RequestBody @Valid CreateLessonDto createLessonDto
    ) {
        return ResponseEntity.ok(lessonService.createLesson(courseId, createLessonDto));
    }

    @GetMapping("/courses/{courseId}/lessons")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get lessons by course", description = "Returns all lessons for a course ordered by order index ascending.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lessons returned"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    public ResponseEntity<List<DisplayLessonDto>> getLessonsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getLessonsByCourse(courseId));
    }

    @PutMapping("/lessons/{lessonId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Update a lesson", description = "Updates lesson title, content, and order index.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lesson updated"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Lesson not found"),
            @ApiResponse(responseCode = "409", description = "Lesson order conflict")
    })
    public ResponseEntity<DisplayLessonDto> updateLesson(
            @PathVariable Long lessonId,
            @RequestBody @Valid UpdateLessonDto updateLessonDto
    ) {
        return ResponseEntity.ok(lessonService.updateLesson(lessonId, updateLessonDto));
    }

    @DeleteMapping("/lessons/{lessonId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Delete a lesson", description = "Deletes a lesson by id.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Lesson deleted"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Lesson not found")
    })
    public ResponseEntity<Void> deleteLesson(@PathVariable Long lessonId) {
        lessonService.deleteLesson(lessonId);
        return ResponseEntity.noContent().build();
    }
}

