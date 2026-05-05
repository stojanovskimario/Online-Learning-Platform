package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.CreateCourseDto;
import com.learnix.backend.model.dto.DisplayCourseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface CourseApplicationService {
    List<DisplayCourseDto> findAll();

    Page<DisplayCourseDto> findAll(Pageable pageable, Long categoryId);

    Optional<DisplayCourseDto> findById(Long id);

    DisplayCourseDto create(CreateCourseDto createCourseDto);

    Optional<DisplayCourseDto> update(Long id, CreateCourseDto createCourseDto);

    Optional<DisplayCourseDto> publish(Long id);

    Optional<DisplayCourseDto> deleteById(Long id);
}
