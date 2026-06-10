package com.learnix.backend.web.controller;

import com.learnix.backend.model.dto.CreateSectionDto;
import com.learnix.backend.model.dto.DisplaySectionDto;
import com.learnix.backend.service.application.SectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Sections", description = "Section management endpoints")
public class SectionController {

    private final SectionService sectionService;

    public SectionController(SectionService sectionService) {
        this.sectionService = sectionService;
    }

    @PostMapping("/courses/{courseId}/sections")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Create a section for a course", description = "Creates a new section linked to the given course and keeps order index unique within that course.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Section created"),
            @ApiResponse(responseCode = "400", description = "Invalid section data or duplicate order index"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    public ResponseEntity<DisplaySectionDto> createSection(
            @PathVariable Long courseId,
            @RequestBody @Valid CreateSectionDto createSectionDto
    ) {
        return ResponseEntity.ok(sectionService.createSection(courseId, createSectionDto));
    }

    @GetMapping("/courses/{courseId}/sections")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get sections by course", description = "Returns all sections for a course ordered by order index ascending.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sections returned"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    public ResponseEntity<List<DisplaySectionDto>> getSectionsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(sectionService.getSectionsByCourse(courseId));
    }

    @PutMapping("/sections/{sectionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Update a section", description = "Updates section title and order index.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Section updated"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Section not found"),
            @ApiResponse(responseCode = "409", description = "Section order conflict")
    })
    public ResponseEntity<DisplaySectionDto> updateSection(
            @PathVariable Long sectionId,
            @RequestBody @Valid CreateSectionDto createSectionDto
    ) {
        return ResponseEntity.ok(sectionService.updateSection(sectionId, createSectionDto));
    }

    @DeleteMapping("/sections/{sectionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    @Operation(summary = "Delete a section", description = "Deletes a section and all its lessons.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Section deleted"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Section not found")
    })
    public ResponseEntity<Void> deleteSection(@PathVariable Long sectionId) {
        sectionService.deleteSection(sectionId);
        return ResponseEntity.noContent().build();
    }
}



