package com.learnix.backend.model.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(
        name = "sections",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_section_course_order", columnNames = {"course_id", "order_index"})
        }
)
public class Section extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private String title;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @OneToMany(mappedBy = "section", fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    private Set<Lesson> lessons;
}
