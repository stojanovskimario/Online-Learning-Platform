package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.EnrollmentDto;

import java.util.List;
import java.util.Optional;

public interface EnrollmentService {
    
    EnrollmentDto enrollUserInCourse(Long userId, Long courseId);
    
    Optional<EnrollmentDto> unenrollUserFromCourse(Long userId, Long courseId);
    
    Optional<EnrollmentDto> findByUserIdAndCourseId(Long userId, Long courseId);
    
    List<EnrollmentDto> findEnrollmentsByUserId(Long userId);
    
    List<EnrollmentDto> findEnrollmentsByCourseId(Long courseId);
    
    boolean isUserEnrolledInCourse(Long userId, Long courseId);
    
    Optional<EnrollmentDto> updateEnrollmentStatus(Long enrollmentId, com.learnix.backend.model.enums.EnrollmentStatus status);
    
    void deleteEnrollment(Long enrollmentId);
}
