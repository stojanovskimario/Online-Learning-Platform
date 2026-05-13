package com.learnix.backend.model.dto;

import com.learnix.backend.model.domain.Section;

import java.util.List;

public record DisplaySectionDto(
        Long id,
        Long courseId,
        String title,
        Integer orderIndex
) {
    public static DisplaySectionDto from(Section section) {
        return new DisplaySectionDto(
                section.getId(),
                section.getCourse() != null ? section.getCourse().getId() : null,
                section.getTitle(),
                section.getOrderIndex()
        );
    }

    public static List<DisplaySectionDto> from(List<Section> sections) {
        return sections.stream()
                .map(DisplaySectionDto::from)
                .toList();
    }
}

