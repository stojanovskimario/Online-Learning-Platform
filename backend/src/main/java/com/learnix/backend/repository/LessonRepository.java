package com.learnix.backend.repository;

import com.learnix.backend.model.domain.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findBySectionIdOrderByOrderIndexAsc(Long sectionId);

    List<Lesson> findBySection_Course_IdOrderBySection_OrderIndexAscOrderIndexAsc(Long courseId);

    boolean existsBySection_Course_IdAndOrderIndexAndIdNot(Long courseId, Integer orderIndex, Long lessonId);

    @Query("""
            select case when count(l) > 0 then true else false end
            from Lesson l
            join l.section s
            join s.course c
            where c.id = :courseId and l.orderIndex = :orderIndex
            """)
    boolean existsByCourseIdAndOrderIndex(@Param("courseId") Long courseId, @Param("orderIndex") Integer orderIndex);
}
