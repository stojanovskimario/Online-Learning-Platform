package com.learnix.backend.repository;

import com.learnix.backend.model.domain.Section;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByCourseIdOrderByOrderIndexAsc(Long courseId);

    boolean existsByCourseIdAndOrderIndex(Long courseId, Integer orderIndex);

    boolean existsByCourseIdAndOrderIndexAndIdNot(Long courseId, Integer orderIndex, Long sectionId);
}
