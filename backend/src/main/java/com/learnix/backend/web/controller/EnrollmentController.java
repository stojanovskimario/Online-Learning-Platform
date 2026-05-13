package com.learnix.backend.web.controller;

import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.EnrollmentDto;
import com.learnix.backend.service.application.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/courses/{courseId}/enroll")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EnrollmentDto> enrollInCourse(@PathVariable Long courseId) {
        Long currentUserId = getCurrentUserId();
        return ResponseEntity.ok(enrollmentService.enrollUserInCourse(currentUserId, courseId));
    }

    @DeleteMapping("/courses/{courseId}/unenroll")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EnrollmentDto> unenrollFromCourse(@PathVariable Long courseId) {
        Long currentUserId = getCurrentUserId();
        return enrollmentService.unenrollUserFromCourse(currentUserId, courseId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/courses/{courseId}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> checkEnrollmentStatus(@PathVariable Long courseId) {
        Long currentUserId = getCurrentUserId();
        boolean isEnrolled = enrollmentService.isUserEnrolledInCourse(currentUserId, courseId);
        return ResponseEntity.ok(isEnrolled);
    }

    @GetMapping("/my-enrollments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EnrollmentDto>> getMyEnrollments() {
        Long currentUserId = getCurrentUserId();
        return ResponseEntity.ok(enrollmentService.findEnrollmentsByUserId(currentUserId));
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#userId)")
    public ResponseEntity<List<EnrollmentDto>> getUserEnrollments(@PathVariable Long userId) {
        return ResponseEntity.ok(enrollmentService.findEnrollmentsByUserId(userId));
    }

    @GetMapping("/courses/{courseId}/enrollments")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<List<EnrollmentDto>> getCourseEnrollments(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.findEnrollmentsByCourseId(courseId));
    }

    @GetMapping("/{enrollmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnrollmentDto> getEnrollmentById(@PathVariable Long enrollmentId) {
        return enrollmentService.findByUserIdAndCourseId(null, null)
                .filter(enrollment -> enrollment.getId().equals(enrollmentId))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{enrollmentId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnrollmentDto> updateEnrollmentStatus(
            @PathVariable Long enrollmentId,
            @RequestParam com.learnix.backend.model.enums.EnrollmentStatus status) {
        return enrollmentService.updateEnrollmentStatus(enrollmentId, status)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{enrollmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long enrollmentId) {
        enrollmentService.deleteEnrollment(enrollmentId);
        return ResponseEntity.noContent().build();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return ((User) authentication.getPrincipal()).getId();
        }
        throw new RuntimeException("User not authenticated");
    }
}
