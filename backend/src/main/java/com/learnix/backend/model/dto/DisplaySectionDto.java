package com.learnix.backend.model.dto;

import com.learnix.backend.model.domain.Section;

import java.util.List;

public record DisplaySectionDto(
        Long id,
        Long courseId,
        String title,
        Integer orderIndex,
        List<DisplayLessonDto> lessons
) {
    public static DisplaySectionDto from(Section section) {
        List<DisplayLessonDto> lessons = section.getLessons() != null
                ? section.getLessons().stream()
                    .sorted((a, b) -> Integer.compare(a.getOrderIndex(), b.getOrderIndex()))
                    .map(DisplayLessonDto::from)
                    .toList()
                : List.of();
        return new DisplaySectionDto(
                section.getId(),
                section.getCourse() != null ? section.getCourse().getId() : null,
                section.getTitle(),
                section.getOrderIndex(),
                lessons
        );
    }

    public static List<DisplaySectionDto> from(List<Section> sections) {
        return sections.stream()
                .map(DisplaySectionDto::from)
                .toList();
    }
}
