package com.learnix.backend.model.dto;

import com.learnix.backend.model.domain.Category;
import com.learnix.backend.model.domain.Course;
import com.learnix.backend.model.domain.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record CreateCourseDto(
        @NotNull(message = "Instructor id is required.")
        Long instructorId,
        @NotBlank(message = "A title is required.")
        @Size(max = 255, message = "The title should be up to 255 characters.")
        String title,
        @Size(max = 2000, message = "The description should be up to 2000 characters.")
        String description,
        @Size(max = 2048, message = "The thumbnail URL should be up to 2048 characters.")
        String thumbnailUrl,
        @NotNull(message = "Category id is required.")
        Long categoryId,
        @PositiveOrZero(message = "The price cannot be negative.")
        double price,
        boolean isPremium
) {
    public Course toCourse(Category category, User instructor) {
        return new Course(
                instructor,
                title,
                description,
                thumbnailUrl,
                category,
                price,
                isPremium,
                null
        );
    }
}
