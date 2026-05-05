package com.learnix.backend.service.domain;

import com.learnix.backend.model.domain.Course;
import com.learnix.backend.model.enums.CourseStatus;

import java.util.List;
import java.util.Optional;

public interface CourseService {
    List<Course> findAll();

    List<Course> findByStatus(CourseStatus status);

    Optional<Course> findById(Long id);

    Course create(Course course);

    Optional<Course> update(Long id, Course course);

    Optional<Course> publish(Long id);

    Optional<Course> deleteById(Long id);
}
