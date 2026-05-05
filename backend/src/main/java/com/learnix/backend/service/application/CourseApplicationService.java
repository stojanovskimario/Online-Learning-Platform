package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.CreateCourseDto;
import com.learnix.backend.model.dto.DisplayCourseDto;

import java.util.List;
import java.util.Optional;

public interface CourseApplicationService {
    List<DisplayCourseDto> findAll();

    Optional<DisplayCourseDto> findById(Long id);

    DisplayCourseDto create(CreateCourseDto createCourseDto);

    Optional<DisplayCourseDto> update(Long id, CreateCourseDto createCourseDto);

    Optional<DisplayCourseDto> publish(Long id);

    Optional<DisplayCourseDto> deleteById(Long id);
}
