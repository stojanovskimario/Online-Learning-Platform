package com.learnix.backend.service.application;

import com.learnix.backend.model.domain.Certificate;
import com.learnix.backend.model.dto.CertificateDto;

import java.util.List;

public interface CertificateService {
    Certificate generateCertificate(Long userId, Long courseId);

    List<CertificateDto> getCertificatesForUser(Long userId);

    byte[] generateCertificatePdf(Long certificateId);

    CertificateDto verifyCertificate(String verificationCode);
}

