package com.learnix.backend.model.dto;

import com.learnix.backend.model.domain.Course;
import com.learnix.backend.model.enums.CourseStatus;

import java.util.List;

public record DisplayCourseDto(
        Long id,
        Long instructorId,
        String title,
        String description,
        String thumbnailUrl,
        Long categoryId,
        String categoryName,
        double price,
        boolean isPremium,
        CourseStatus status
) {
    public static DisplayCourseDto from(Course course) {
        return new DisplayCourseDto(
                course.getId(),
                course.getInstructorId(),
                course.getTitle(),
                course.getDescription(),
                course.getThumbnailUrl(),
                course.getCategory() != null ? course.getCategory().getId() : null,
                course.getCategory() != null ? course.getCategory().getName() : null,
                course.getPrice(),
                course.isPremium(),
                course.getStatus()
        );
    }

    public static List<DisplayCourseDto> from(List<Course> courses) {
        return courses.stream()
                .map(DisplayCourseDto::from)
                .toList();
    }
}
