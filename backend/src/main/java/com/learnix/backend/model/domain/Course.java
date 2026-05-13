package com.learnix.backend.model.domain;

import com.learnix.backend.model.enums.CourseStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "courses")
public class Course extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "instructor_id", nullable = false)
    private User instructor;

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
    @Column(nullable = false)
    private CourseStatus status = CourseStatus.DRAFT;

    public Course(User instructor, String title, String description, String thumbnailUrl,
                  Category category, double price, boolean isPremium, CourseStatus status) {
        this.instructor = instructor;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.category = category;
        this.price = price;
        this.isPremium = isPremium;
        this.status = status == null ? CourseStatus.DRAFT : status;
    }

    @PrePersist
    @PreUpdate
    private void ensureDefaultStatus() {
        if (status == null) {
            status = CourseStatus.DRAFT;
        }
    }
}
