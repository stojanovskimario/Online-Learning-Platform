package com.learnix.backend.service.application.impl;

import com.learnix.backend.model.domain.Category;
import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.CreateCourseDto;
import com.learnix.backend.model.dto.DisplayCourseDto;
import com.learnix.backend.model.enums.CourseStatus;
import com.learnix.backend.model.exceptions.CategoryNotFoundException;
import com.learnix.backend.service.application.CourseApplicationService;
import com.learnix.backend.service.domain.CategoryService;
import com.learnix.backend.service.domain.CourseService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseApplicationServiceImpl implements CourseApplicationService {

    private final CourseService courseService;
    private final CategoryService categoryService;

    public CourseApplicationServiceImpl(
            CourseService courseService,
            CategoryService categoryService
    ) {
        this.courseService = courseService;
        this.categoryService = categoryService;
    }

    @Override
    public List<DisplayCourseDto> findAll() {
        return findAll(Pageable.unpaged(), null).getContent();
    }

    @Override
    public Page<DisplayCourseDto> findAll(Pageable pageable, Long categoryId) {
        return canViewDraftCourses()
                ? findAllForPrivilegedUser(pageable, categoryId)
                : findAllForStandardUser(pageable, categoryId);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
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
        User instructor = getCurrentUser();
        return DisplayCourseDto.from(courseService.create(createCourseDto.toCourse(category, instructor)));
    }

    @Override
    public Optional<DisplayCourseDto> update(Long id, CreateCourseDto createCourseDto) {
        Category category = categoryService
                .findById(createCourseDto.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(createCourseDto.categoryId()));
        User instructor = getCurrentUser();
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

    private Page<DisplayCourseDto> findAllForPrivilegedUser(Pageable pageable, Long categoryId) {
        return (categoryId == null
                ? courseService.findAll(pageable)
                : courseService.findByCategoryId(categoryId, pageable))
                .map(DisplayCourseDto::from);
    }

    private Page<DisplayCourseDto> findAllForStandardUser(Pageable pageable, Long categoryId) {
        return (categoryId == null
                ? courseService.findByStatus(CourseStatus.PUBLISHED, pageable)
                : courseService.findByCategoryIdAndStatus(categoryId, CourseStatus.PUBLISHED, pageable))
                .map(DisplayCourseDto::from);
    }

    private boolean canViewDraftCourses() {
        return hasRole("ROLE_ADMIN") || hasRole("ROLE_INSTRUCTOR");
    }

    private boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(role));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user;
        }
        throw new RuntimeException("User not authenticated");
    }
}
