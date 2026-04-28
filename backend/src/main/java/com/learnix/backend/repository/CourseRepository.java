package com.learnix.backend.repository;

import com.learnix.backend.model.domain.Course;
import com.learnix.backend.model.enums.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructor_Id(Long instructorId);

    List<Course> findByCategoryId(Long categoryId);

    List<Course> findByStatus(CourseStatus status);
}
