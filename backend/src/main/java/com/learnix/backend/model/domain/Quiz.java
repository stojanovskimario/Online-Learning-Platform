package com.learnix.backend.model.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
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
        name = "quizzes",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_quiz_lesson", columnNames = {"lesson_id"})
        }
)
public class Quiz extends BaseAuditableEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false)
    private String title;

    @Column(name = "pass_score", nullable = false)
    private Integer passScore = 70;

    @Column(name = "time_limit_seconds")
    private Integer timeLimitSeconds;
}
