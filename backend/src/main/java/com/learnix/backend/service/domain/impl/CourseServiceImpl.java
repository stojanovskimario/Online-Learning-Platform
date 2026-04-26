package com.learnix.backend.service.domain.impl;

import com.learnix.backend.model.domain.Course;
import com.learnix.backend.repository.CourseRepository;
import com.learnix.backend.service.domain.CourseService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public List<Course> findAll() {
        return courseRepository.findAll();
    }

    @Override
    public Optional<Course> findById(Long id) {
        return courseRepository.findById(id);
    }

    @Override
    public Course create(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public Optional<Course> update(Long id, Course course) {
        return courseRepository.findById(id).map(existingCourse -> {
            existingCourse.setTitle(course.getTitle());
            existingCourse.setDescription(course.getDescription());
            existingCourse.setCategory(course.getCategory());
            return courseRepository.save(existingCourse);
        });
    }

    @Override
    public Optional<Course> deleteById(Long id) {
        Optional<Course> course = courseRepository.findById(id);
        course.ifPresent(courseRepository::delete);
        return course;
    }
}
