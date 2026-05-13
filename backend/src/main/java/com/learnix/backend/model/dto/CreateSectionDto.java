package com.learnix.backend.model.dto;

import com.learnix.backend.model.domain.Section;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateSectionDto(
        @NotBlank(message = "A title is required.")
        String title,
        @NotNull(message = "The order index is required.")
        Integer orderIndex
) {
    public Section toSection() {
        Section section = new Section();
        section.setTitle(title);
        section.setOrderIndex(orderIndex);
        return section;
    }
}

