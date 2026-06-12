package com.learnix.backend.model.dto;

import com.learnix.backend.model.domain.Certificate;

import java.time.LocalDateTime;

public record CertificateDto(
        Long id,
        String studentName,
        String courseTitle,
        String instructorName,
        LocalDateTime issuedAt,
        String verificationCode
) {
    public static CertificateDto from(Certificate cert) {
        String instructorName = "";
        if (cert.getCourse() != null && cert.getCourse().getInstructor() != null) {
            instructorName = cert.getCourse().getInstructor().getFirstName() + " " + cert.getCourse().getInstructor().getLastName();
        }
        return new CertificateDto(
                cert.getId(),
                cert.getUser().getFirstName() + " " + cert.getUser().getLastName(),
                cert.getCourse() == null ? null : cert.getCourse().getTitle(),
                instructorName,
                cert.getIssuedAt(),
                cert.getVerificationCode()
        );
    }
}

