package com.learnix.backend.service.application.impl;

import com.learnix.backend.model.domain.Category;
import com.learnix.backend.model.domain.Course;
import com.learnix.backend.model.dto.CreateCourseDto;
import com.learnix.backend.model.dto.DisplayCourseDto;
import com.learnix.backend.model.exceptions.CategoryNotFoundException;
import com.learnix.backend.service.application.CourseApplicationService;
import com.learnix.backend.service.domain.CategoryService;
import com.learnix.backend.service.domain.CourseService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseApplicationServiceImpl implements CourseApplicationService {

    private final CourseService courseService;
    private final CategoryService categoryService;

    public CourseApplicationServiceImpl(CourseService courseService, CategoryService categoryService) {
        this.courseService = courseService;
        this.categoryService = categoryService;
    }

    @Override
    public List<DisplayCourseDto> findAll() {
        return DisplayCourseDto.from(courseService.findAll());
    }

    @Override
    public Optional<DisplayCourseDto> findById(Long id) {
        return courseService
                .findById(id)
                .map(DisplayCourseDto::from);
    }

    @Override
    public DisplayCourseDto create(CreateCourseDto createCourseDto) {
        Category category = categoryService
                .findById(createCourseDto.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(createCourseDto.categoryId()));
        return DisplayCourseDto.from(courseService.create(createCourseDto.toCourse(category)));
    }

    @Override
    public Optional<DisplayCourseDto> update(Long id, CreateCourseDto createCourseDto) {
        Category category = categoryService
                .findById(createCourseDto.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(createCourseDto.categoryId()));
        return courseService
                .update(id, createCourseDto.toCourse(category))
                .map(DisplayCourseDto::from);
    }

    @Override
    public Optional<DisplayCourseDto> deleteById(Long id) {
        Optional<DisplayCourseDto> course = courseService
                .deleteById(id)
                .map(DisplayCourseDto::from);
        return course;
    }
}
