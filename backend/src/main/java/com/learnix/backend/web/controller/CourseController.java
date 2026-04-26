package com.learnix.backend.web.controller;

import com.learnix.backend.model.dto.CreateCourseDto;
import com.learnix.backend.model.dto.DisplayCourseDto;
import com.learnix.backend.service.application.CourseApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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
public class CourseController {

    private final CourseApplicationService courseApplicationService;

    public CourseController(CourseApplicationService courseApplicationService) {
        this.courseApplicationService = courseApplicationService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayCourseDto> findById(@PathVariable Long id) {
        return courseApplicationService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<DisplayCourseDto>> findAll() {
        return ResponseEntity.ok(courseApplicationService.findAll());
    }

    @PostMapping("/add")
    public ResponseEntity<DisplayCourseDto> create(@RequestBody @Valid CreateCourseDto createCourseDto) {
        return ResponseEntity.ok(courseApplicationService.create(createCourseDto));
    }

    @PutMapping("/{id}/edit")
    public ResponseEntity<DisplayCourseDto> update(
            @PathVariable Long id,
            @RequestBody @Valid CreateCourseDto createCourseDto
    ) {
        return courseApplicationService.update(id, createCourseDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<DisplayCourseDto> deleteById(@PathVariable Long id) {
        return courseApplicationService.deleteById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
