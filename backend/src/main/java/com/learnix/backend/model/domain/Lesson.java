package com.learnix.backend.model.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(
        name = "lessons",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_lesson_section_order", columnNames = {"section_id", "order_index"})
        }
)
public class Lesson extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @Column(nullable = false)
    private String title;


    @Column(name = "markdown_content", nullable = false)
    private String markdownContent;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
}
