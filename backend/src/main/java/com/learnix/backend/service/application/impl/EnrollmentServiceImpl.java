package com.learnix.backend.service.application.impl;

import com.learnix.backend.model.domain.Course;
import com.learnix.backend.model.domain.Enrollment;
import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.EnrollmentDto;
import com.learnix.backend.model.enums.EnrollmentStatus;
import com.learnix.backend.repository.CourseRepository;
import com.learnix.backend.repository.EnrollmentRepository;
import com.learnix.backend.repository.UserRepository;
import com.learnix.backend.service.application.EnrollmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentServiceImpl(EnrollmentRepository enrollmentRepository, 
                               UserRepository userRepository, 
                               CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public EnrollmentDto enrollUserInCourse(Long userId, Long courseId) {
        if (enrollmentRepository.findByUserIdAndCourseId(userId, courseId).isPresent()) {
            throw new RuntimeException("User is already enrolled in this course");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setStatus(EnrollmentStatus.ACTIVE);

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return convertToDto(savedEnrollment);
    }

    @Override
    public Optional<EnrollmentDto> unenrollUserFromCourse(Long userId, Long courseId) {
        return enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .map(enrollment -> {
                    enrollment.setStatus(EnrollmentStatus.CANCELED);
                    Enrollment updatedEnrollment = enrollmentRepository.save(enrollment);
                    return convertToDto(updatedEnrollment);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EnrollmentDto> findByUserIdAndCourseId(Long userId, Long courseId) {
        return enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentDto> findEnrollmentsByUserId(Long userId) {
        return enrollmentRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentDto> findEnrollmentsByCourseId(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUserEnrolledInCourse(Long userId, Long courseId) {
        return enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .map(enrollment -> enrollment.getStatus() == EnrollmentStatus.ACTIVE)
                .orElse(false);
    }

    @Override
    public Optional<EnrollmentDto> updateEnrollmentStatus(Long enrollmentId, EnrollmentStatus status) {
        return enrollmentRepository.findById(enrollmentId)
                .map(enrollment -> {
                    enrollment.setStatus(status);
                    if (status == EnrollmentStatus.EXPIRED) {
                        enrollment.setExpiresAt(LocalDateTime.now());
                    }
                    Enrollment updatedEnrollment = enrollmentRepository.save(enrollment);
                    return convertToDto(updatedEnrollment);
                });
    }

    @Override
    public void deleteEnrollment(Long enrollmentId) {
        if (!enrollmentRepository.existsById(enrollmentId)) {
            throw new RuntimeException("Enrollment not found with id: " + enrollmentId);
        }
        enrollmentRepository.deleteById(enrollmentId);
    }

    private EnrollmentDto convertToDto(Enrollment enrollment) {
        return new EnrollmentDto(
                enrollment.getId(),
                enrollment.getUser().getId(),
                enrollment.getUser().getUsername(),
                enrollment.getCourse().getId(),
                enrollment.getCourse().getTitle(),
                enrollment.getStatus(),
                enrollment.getExpiresAt(),
                enrollment.getCreatedAt(),
                enrollment.getUpdatedAt()
        );
    }
}
