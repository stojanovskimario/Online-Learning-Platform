package com.learnix.backend.service.application.impl;

import com.learnix.backend.model.domain.Category;
import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.CreateCourseDto;
import com.learnix.backend.model.dto.DisplayCourseDto;
import com.learnix.backend.model.enums.CourseStatus;
import com.learnix.backend.model.exceptions.CategoryNotFoundException;
import com.learnix.backend.model.exceptions.UserNotFoundException;
import com.learnix.backend.repository.UserRepository;
import com.learnix.backend.security.UserSecurity;
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
    private final UserRepository userRepository;
    private final UserSecurity userSecurity;

    public CourseApplicationServiceImpl(
            CourseService courseService,
            CategoryService categoryService,
            UserRepository userRepository,
            UserSecurity userSecurity
    ) {
        this.courseService = courseService;
        this.categoryService = categoryService;
        this.userRepository = userRepository;
        this.userSecurity = userSecurity;
    }

    @Override
    public List<DisplayCourseDto> findAll() {
        return DisplayCourseDto.from(canViewDraftCourses()
                ? courseService.findAll()
                : courseService.findByStatus(CourseStatus.PUBLISHED));
    }

    @Override
    public Optional<DisplayCourseDto> findById(Long id) {
        return courseService
                .findById(id)
                .filter(course -> canViewDraftCourses() || CourseStatus.PUBLISHED.equals(course.getStatus()))
                .map(DisplayCourseDto::from);
    }

    @Override
    public DisplayCourseDto create(CreateCourseDto createCourseDto) {
        Category category = categoryService
                .findById(createCourseDto.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(createCourseDto.categoryId()));
        User instructor = userRepository
                .findById(createCourseDto.instructorId())
                .orElseThrow(() -> new UserNotFoundException(createCourseDto.instructorId()));
        return DisplayCourseDto.from(courseService.create(createCourseDto.toCourse(category, instructor)));
    }

    @Override
    public Optional<DisplayCourseDto> update(Long id, CreateCourseDto createCourseDto) {
        Category category = categoryService
                .findById(createCourseDto.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(createCourseDto.categoryId()));
        User instructor = userRepository
                .findById(createCourseDto.instructorId())
                .orElseThrow(() -> new UserNotFoundException(createCourseDto.instructorId()));
        return courseService
                .update(id, createCourseDto.toCourse(category, instructor))
                .map(DisplayCourseDto::from);
    }

    @Override
    public Optional<DisplayCourseDto> publish(Long id) {
        return courseService
                .publish(id)
                .map(DisplayCourseDto::from);
    }

    @Override
    public Optional<DisplayCourseDto> deleteById(Long id) {
        return courseService
                .deleteById(id)
                .map(DisplayCourseDto::from);
    }

    private boolean canViewDraftCourses() {
        return userSecurity.isAdmin() || userSecurity.isInstructor();
    }
}
