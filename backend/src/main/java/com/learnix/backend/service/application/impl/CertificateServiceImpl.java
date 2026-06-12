package com.learnix.backend.service.application.impl;

import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.learnix.backend.model.domain.Certificate;
import com.learnix.backend.model.domain.Course;
import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.CertificateDto;
import com.learnix.backend.repository.CertificateRepository;
import com.learnix.backend.repository.CourseRepository;
import com.learnix.backend.repository.UserRepository;
import com.learnix.backend.service.application.CertificateService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.borders.Border;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public CertificateServiceImpl(CertificateRepository certificateRepository,
                                  UserRepository userRepository,
                                  CourseRepository courseRepository) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public Certificate generateCertificate(Long userId, Long courseId) {
        if (certificateRepository.existsByUserIdAndCourseId(userId, courseId)) {
            return certificateRepository.findByUserIdAndCourseId(userId, courseId).orElseThrow();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        Certificate cert = new Certificate();
        cert.setUser(user);
        cert.setCourse(course);
        cert.setVerificationCode(UUID.randomUUID().toString());
        cert.setIssuedAt(LocalDateTime.now());

        return certificateRepository.save(cert);
    }

    @Override
    public List<CertificateDto> getCertificatesForUser(Long userId) {
        return certificateRepository.findByUserId(userId).stream().map(CertificateDto::from).toList();
    }


    @Override
    public byte[] generateCertificatePdf(Long certificateId) {
        Certificate cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certificate not found"));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4.rotate());
            document.setMargins(0, 0, 0, 0);

            float pageWidth = PageSize.A4.rotate().getWidth();
            float pageHeight = PageSize.A4.rotate().getHeight();

            // Colors
            DeviceRgb navyBlue = new DeviceRgb(15, 37, 93);
            DeviceRgb gold = new DeviceRgb(212, 175, 55);
            DeviceRgb lightGold = new DeviceRgb(247, 231, 161);
            DeviceRgb white = new DeviceRgb(255, 255, 255);
            DeviceRgb lightBlue = new DeviceRgb(232, 240, 254);
            DeviceRgb darkText = new DeviceRgb(30, 30, 60);
            DeviceRgb mutedText = new DeviceRgb(100, 100, 130);
            DeviceRgb accentBlue = new DeviceRgb(37, 99, 235);

            PdfCanvas canvas = new PdfCanvas(pdf.addNewPage());

            // Background gradient simulation - navy at top and bottom, light in middle
            canvas.setFillColor(navyBlue);
            canvas.rectangle(0, pageHeight - 80, pageWidth, 80);
            canvas.fill();

            canvas.setFillColor(navyBlue);
            canvas.rectangle(0, 0, pageWidth, 80);
            canvas.fill();

            canvas.setFillColor(lightBlue);
            canvas.rectangle(0, 80, pageWidth, pageHeight - 160);
            canvas.fill();

            // Gold border lines - outer
            canvas.setStrokeColor(gold);
            canvas.setLineWidth(4f);
            canvas.rectangle(20, 20, pageWidth - 40, pageHeight - 40);
            canvas.stroke();

            // Gold border lines - inner
            canvas.setStrokeColor(gold);
            canvas.setLineWidth(1.5f);
            canvas.rectangle(28, 28, pageWidth - 56, pageHeight - 56);
            canvas.stroke();

            // Decorative gold line under header
            canvas.setStrokeColor(gold);
            canvas.setLineWidth(2f);
            canvas.moveTo(60, pageHeight - 88);
            canvas.lineTo(pageWidth - 60, pageHeight - 88);
            canvas.stroke();

            // Decorative gold line above footer
            canvas.setStrokeColor(gold);
            canvas.setLineWidth(2f);
            canvas.moveTo(60, 88);
            canvas.lineTo(pageWidth - 60, 88);
            canvas.stroke();

            // Decorative corner ornaments (simple diamond shapes at each corner)
            float[][] corners = {
                    {40f, pageHeight - 40f},
                    {pageWidth - 40f, pageHeight - 40f},
                    {40f, 40f},
                    {pageWidth - 40f, 40f}
            };
            canvas.setFillColor(gold);
            for (float[] corner : corners) {
                float cx = corner[0];
                float cy = corner[1];
                canvas.moveTo(cx, cy + 8);
                canvas.lineTo(cx + 8, cy);
                canvas.lineTo(cx, cy - 8);
                canvas.lineTo(cx - 8, cy);
                canvas.closePath();
                canvas.fill();
            }

            // Center decorative divider line with diamond
            float centerY = pageHeight / 2f - 10;
            canvas.setStrokeColor(gold);
            canvas.setLineWidth(1f);
            canvas.moveTo(80, centerY);
            canvas.lineTo(pageWidth / 2f - 20, centerY);
            canvas.stroke();
            canvas.moveTo(pageWidth / 2f + 20, centerY);
            canvas.lineTo(pageWidth - 80, centerY);
            canvas.stroke();
            canvas.setFillColor(gold);
            canvas.moveTo(pageWidth / 2f, centerY + 8);
            canvas.lineTo(pageWidth / 2f + 10, centerY);
            canvas.lineTo(pageWidth / 2f, centerY - 8);
            canvas.lineTo(pageWidth / 2f - 10, centerY);
            canvas.closePath();
            canvas.fill();

            canvas.release();

            // Header text on navy background
            Paragraph header = new Paragraph("✦  LEARNIX  ✦")
                    .setFontSize(11)
                    .setBold()
                    .setFontColor(lightGold)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(30)
                    .setMarginBottom(0)
                    .setCharacterSpacing(6);
            document.add(header);

            Paragraph titlePara = new Paragraph("Certificate of Completion")
                    .setFontSize(30)
                    .setBold()
                    .setFontColor(white)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(0)
                    .setMarginBottom(0)
                    .setCharacterSpacing(2);
            document.add(titlePara);

            // Spacer into light area
            document.add(new Paragraph(" ").setFontSize(8).setMarginBottom(6));

            Paragraph certifies = new Paragraph("This is to certify that")
                    .setFontSize(14)
                    .setItalic()
                    .setFontColor(mutedText)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(8);
            document.add(certifies);

            String studentFullName = cert.getUser().getFirstName() + " " + cert.getUser().getLastName();
            Paragraph studentName = new Paragraph(studentFullName)
                    .setFontSize(38)
                    .setBold()
                    .setFontColor(accentBlue)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(0);
            document.add(studentName);

            // Underline effect using a thin gold line paragraph
            Paragraph nameLine = new Paragraph("─────────────────────────────")
                    .setFontSize(10)
                    .setFontColor(gold)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(0)
                    .setMarginBottom(6);
            document.add(nameLine);

            Paragraph completed = new Paragraph("has successfully completed the course")
                    .setFontSize(14)
                    .setFontColor(mutedText)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(8);
            document.add(completed);

            Paragraph courseTitlePara = new Paragraph(cert.getCourse().getTitle())
                    .setFontSize(26)
                    .setBold()
                    .setFontColor(navyBlue)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(16);
            document.add(courseTitlePara);

            // Two column info: issued date left, instructor right
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy");
            String issuedDate = cert.getIssuedAt().format(fmt);
            String instructorName = "";
            if (cert.getCourse().getInstructor() != null) {
                instructorName = cert.getCourse().getInstructor().getFirstName()
                        + " " + cert.getCourse().getInstructor().getLastName();
            }

            // Side by side using a Table
            Table infoTable = new Table(new float[]{1, 1})
                    .setWidth(UnitValue.createPercentValue(60))
                    .setHorizontalAlignment(HorizontalAlignment.CENTER)
                    .setMarginBottom(0);

            Cell dateCell = new Cell()
                    .add(new Paragraph("DATE ISSUED").setFontSize(9).setBold()
                            .setFontColor(mutedText).setCharacterSpacing(2))
                    .add(new Paragraph(issuedDate).setFontSize(14).setBold().setFontColor(darkText))
                    .setBorder(Border.NO_BORDER)
                    .setTextAlignment(TextAlignment.CENTER);

            Cell instructorCell = new Cell()
                    .add(new Paragraph("INSTRUCTOR").setFontSize(9).setBold()
                            .setFontColor(mutedText).setCharacterSpacing(2))
                    .add(new Paragraph(instructorName).setFontSize(14).setBold().setFontColor(darkText))
                    .setBorder(Border.NO_BORDER)
                    .setTextAlignment(TextAlignment.CENTER);

            infoTable.addCell(dateCell);
            infoTable.addCell(instructorCell);
            document.add(infoTable);

            // Footer on navy background - verification code
            Paragraph verif = new Paragraph("VERIFICATION CODE:  " + cert.getVerificationCode().toUpperCase())
                    .setFontSize(8)
                    .setFontColor(lightGold)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setCharacterSpacing(1)
                    .setMarginTop(8);
            document.add(verif);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate certificate PDF", e);
        }
    }


    @Override
    public CertificateDto verifyCertificate(String verificationCode) {
        Certificate cert = certificateRepository.findByVerificationCode(verificationCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certificate not found"));
        return CertificateDto.from(cert);
    }
}

