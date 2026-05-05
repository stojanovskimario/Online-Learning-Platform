package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.CreateSectionDto;
import com.learnix.backend.model.dto.DisplaySectionDto;

import java.util.List;

public interface SectionService {
    DisplaySectionDto createSection(Long courseId, CreateSectionDto createSectionDto);

    List<DisplaySectionDto> getSectionsByCourse(Long courseId);

    DisplaySectionDto updateSection(Long sectionId, CreateSectionDto createSectionDto);
}


