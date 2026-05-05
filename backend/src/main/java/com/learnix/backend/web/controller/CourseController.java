package com.learnix.backend.web.controller;

import com.learnix.backend.model.dto.CreateCourseDto;
import com.learnix.backend.model.dto.DisplayCourseDto;
import com.learnix.backend.service.application.CourseApplicationService;
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
@RequestMapping("/api/courses")
@Tag(name = "Courses", description = "Course management endpoints")
public class CourseController {

    private final CourseApplicationService courseApplicationService;

    public CourseController(CourseApplicationService courseApplicationService) {
        this.courseApplicationService = courseApplicationService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a course by id", description = "Returns a course when it is published, or when the current user is an instructor/admin.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Course found"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    public ResponseEntity<DisplayCourseDto> findById(@PathVariable Long id) {
        return courseApplicationService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(summary = "List courses", description = "Students receive only published courses, while instructors/admins receive all courses.")
    @ApiResponse(responseCode = "200", description = "Courses returned")
    public ResponseEntity<List<DisplayCourseDto>> findAll() {
        return ResponseEntity.ok(courseApplicationService.findAll());
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Create a course", description = "Creates a new course in DRAFT status.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Course created"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<DisplayCourseDto> create(@RequestBody @Valid CreateCourseDto createCourseDto) {
        return ResponseEntity.ok(courseApplicationService.create(createCourseDto));
    }

    @PutMapping("/{id}/edit")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Edit a course", description = "Updates course metadata without changing its publication status.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Course updated"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    public ResponseEntity<DisplayCourseDto> update(
            @PathVariable Long id,
            @RequestBody @Valid CreateCourseDto createCourseDto
    ) {
        return courseApplicationService.update(id, createCourseDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Publish a course", description = "Changes a course status from DRAFT to PUBLISHED.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Course published"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    public ResponseEntity<DisplayCourseDto> publish(@PathVariable Long id) {
        return courseApplicationService.publish(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/delete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Delete a course", description = "Deletes a course by id.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Course deleted"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    public ResponseEntity<DisplayCourseDto> deleteById(@PathVariable Long id) {
        return courseApplicationService.deleteById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
