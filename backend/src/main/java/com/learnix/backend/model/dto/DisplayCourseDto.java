package com.learnix.backend.model.dto;

import com.learnix.backend.model.domain.Course;
import com.learnix.backend.model.enums.CourseStatus;

import java.util.List;

public record DisplayCourseDto(
        Long id,
        Long instructorId,
        String instructorUsername,
        String instructorFullName,
        String title,
        String description,
        String thumbnailUrl,
        Long categoryId,
        String categoryName,
        double price,
        boolean isPremium,
        CourseStatus status,
        List<DisplaySectionDto> sections
) {
    public static DisplayCourseDto from(Course course) {
        String instructorUsername = course.getInstructor() != null ? course.getInstructor().getUsername() : null;
        String instructorFullName = UserDisplayNameHelper.getDisplayName(course.getInstructor());
        List<DisplaySectionDto> sections = course.getSections() != null
                ? course.getSections().stream()
                .sorted((a, b) -> Integer.compare(a.getOrderIndex(), b.getOrderIndex()))
                .map(section -> DisplaySectionDto.from(section))
                .toList()
                : List.of();
        return new DisplayCourseDto(
                course.getId(),
                course.getInstructor() != null ? course.getInstructor().getId() : null,
                instructorUsername,
                instructorFullName,
                course.getTitle(),
                course.getDescription(),
                course.getThumbnailUrl(),
                course.getCategory() != null ? course.getCategory().getId() : null,
                course.getCategory() != null ? course.getCategory().getName() : null,
                course.getPrice(),
                course.isPremium(),
                course.getStatus(),
                sections
        );
    }

    public static List<DisplayCourseDto> from(List<Course> courses) {
        return courses.stream()
                .map(DisplayCourseDto::from)
                .toList();
    }
}