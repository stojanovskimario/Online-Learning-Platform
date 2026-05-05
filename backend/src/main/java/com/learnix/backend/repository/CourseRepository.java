package com.learnix.backend.repository;

import com.learnix.backend.model.domain.Course;
import com.learnix.backend.model.enums.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructor_Id(Long instructorId);

    List<Course> findByCategoryId(Long categoryId);

    List<Course> findByStatus(CourseStatus status);

    Page<Course> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Course> findByStatus(CourseStatus status, Pageable pageable);

    Page<Course> findByCategoryIdAndStatus(Long categoryId, CourseStatus status, Pageable pageable);
}
