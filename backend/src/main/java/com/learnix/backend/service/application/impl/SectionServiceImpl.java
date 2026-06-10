package com.learnix.backend.service.application.impl;

import com.learnix.backend.model.domain.Course;
import com.learnix.backend.model.domain.Section;
import com.learnix.backend.model.dto.CreateSectionDto;
import com.learnix.backend.model.dto.DisplaySectionDto;
import com.learnix.backend.model.exceptions.CourseNotFoundException;
import com.learnix.backend.model.exceptions.SectionNotFoundException;
import com.learnix.backend.model.exceptions.SectionOrderConflictException;
import com.learnix.backend.repository.CourseRepository;
import com.learnix.backend.repository.SectionRepository;
import com.learnix.backend.service.application.SectionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SectionServiceImpl implements SectionService {

    private final SectionRepository sectionRepository;
    private final CourseRepository courseRepository;

    public SectionServiceImpl(SectionRepository sectionRepository, CourseRepository courseRepository) {
        this.sectionRepository = sectionRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public DisplaySectionDto createSection(Long courseId, CreateSectionDto createSectionDto) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        if (sectionRepository.existsByCourseIdAndOrderIndex(courseId, createSectionDto.orderIndex())) {
            throw new SectionOrderConflictException(courseId, createSectionDto.orderIndex());
        }

        Section section = createSectionDto.toSection();
        section.setCourse(course);
        return DisplaySectionDto.from(sectionRepository.save(section));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisplaySectionDto> getSectionsByCourse(Long courseId) {
        courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        return DisplaySectionDto.from(sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId));
    }

    @Override
    public DisplaySectionDto updateSection(Long sectionId, CreateSectionDto createSectionDto) {
        Section existingSection = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new SectionNotFoundException(sectionId));

        Long courseId = existingSection.getCourse().getId();
        if (!existingSection.getOrderIndex().equals(createSectionDto.orderIndex())
                && sectionRepository.existsByCourseIdAndOrderIndexAndIdNot(courseId, createSectionDto.orderIndex(), sectionId)) {
            throw new SectionOrderConflictException(courseId, createSectionDto.orderIndex());
        }

        existingSection.setTitle(createSectionDto.title());
        existingSection.setOrderIndex(createSectionDto.orderIndex());
        return DisplaySectionDto.from(sectionRepository.save(existingSection));
    }


    @Override
    public void deleteSection(Long sectionId) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new SectionNotFoundException(sectionId));
        sectionRepository.delete(section);
    }
}

