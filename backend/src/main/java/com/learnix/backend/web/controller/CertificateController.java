package com.learnix.backend.web.controller;

import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.CertificateDto;
import com.learnix.backend.service.application.CertificateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Certificates", description = "Certificate generation and verification")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @GetMapping("/certificates")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get certificates for current user")
    public ResponseEntity<List<CertificateDto>> getCertificatesForUser() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(certificateService.getCertificatesForUser(userId));
    }

    @GetMapping("/certificates/{id}/download")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Download certificate PDF")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable Long id) {
        byte[] pdf = certificateService.generateCertificatePdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate-" + id + ".pdf")
                .body(pdf);
    }

    @GetMapping("/verify/{code}")
    @Operation(summary = "Verify a certificate by code")
    public ResponseEntity<CertificateDto> verify(@PathVariable String code) {
        return ResponseEntity.ok(certificateService.verifyCertificate(code));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user.getId();
        }
        throw new RuntimeException("User not authenticated");
    }
}

