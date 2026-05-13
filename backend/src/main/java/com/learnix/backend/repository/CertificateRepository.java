package com.learnix.backend.repository;

import com.learnix.backend.model.domain.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByUserId(Long userId);

    List<Certificate> findByCourseId(Long courseId);

    Optional<Certificate> findByVerificationCode(String verificationCode);
}
