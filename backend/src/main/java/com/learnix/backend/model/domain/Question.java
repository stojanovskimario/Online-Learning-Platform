package com.learnix.backend.model.domain;

import com.learnix.backend.model.enums.QuestionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
        name = "questions",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_question_quiz_order", columnNames = {"quiz_id", "order_index"})
        }
)
public class Question extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;


    @Column(nullable = false)
    private String prompt;


    private String explanation;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(name = "allows_multiple", nullable = false)
    private boolean allowsMultiple = false;
}
