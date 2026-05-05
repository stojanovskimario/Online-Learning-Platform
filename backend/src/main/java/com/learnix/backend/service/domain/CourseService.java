package com.learnix.backend.service.domain;

import com.learnix.backend.model.domain.Course;
import com.learnix.backend.model.enums.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface CourseService {
    List<Course> findAll();

    Page<Course> findAll(Pageable pageable);

    List<Course> findByStatus(CourseStatus status);

    Page<Course> findByStatus(CourseStatus status, Pageable pageable);

    Page<Course> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Course> findByCategoryIdAndStatus(Long categoryId, CourseStatus status, Pageable pageable);

    Optional<Course> findById(Long id);

    Course create(Course course);

    Optional<Course> update(Long id, Course course);

    Optional<Course> publish(Long id);

    Optional<Course> deleteById(Long id);
}
