package com.learnix.backend.model.domain;

import com.learnix.backend.model.enums.CourseStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "courses")
public class Course extends BaseAuditableEntity {

    @Column(nullable = false)
    private Long instructorId;

    @Column(nullable = false)
    private String title;

    private String description;

    private String thumbnailUrl;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private double price;

    private boolean isPremium;

    @Enumerated(EnumType.STRING)
    private CourseStatus status;

    public Course(Long instructorId, String title, String description, String thumbnailUrl,
                  Category category, double price, boolean isPremium, CourseStatus status) {
        this.instructorId = instructorId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.category = category;
        this.price = price;
        this.isPremium = isPremium;
        this.status = status;
    }
}
