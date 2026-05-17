package com.learnix.backend.service.application.impl;

import com.learnix.backend.model.domain.Course;
import com.learnix.backend.model.domain.Lesson;
import com.learnix.backend.model.domain.Section;
import com.learnix.backend.model.dto.CreateLessonDto;
import com.learnix.backend.model.dto.DisplayLessonDto;
import com.learnix.backend.model.dto.UpdateLessonDto;
import com.learnix.backend.model.exceptions.CourseNotFoundException;
import com.learnix.backend.model.exceptions.LessonNotFoundException;
import com.learnix.backend.model.exceptions.LessonOrderConflictException;
import com.learnix.backend.repository.CourseRepository;
import com.learnix.backend.repository.LessonRepository;
import com.learnix.backend.repository.SectionRepository;
import com.learnix.backend.service.application.LessonService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;

    public LessonServiceImpl(
            LessonRepository lessonRepository,
            CourseRepository courseRepository,
            SectionRepository sectionRepository
    ) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisplayLessonDto> getLessonsByCourse(Long courseId) {
        courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        return DisplayLessonDto.from(
                lessonRepository.findBySection_Course_IdOrderBySection_OrderIndexAscOrderIndexAsc(courseId)
        );
    }

    @Override
    public DisplayLessonDto createLesson(Long courseId, CreateLessonDto createLessonDto) {
        courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        if (lessonRepository.existsByCourseIdAndOrderIndex(courseId, createLessonDto.orderIndex())) {
            throw new RuntimeException("A lesson with order index %d already exists in course %d.".formatted(
                    createLessonDto.orderIndex(),
                    courseId
            ));
        }

        Section section = sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Course %d does not have any sections.".formatted(courseId)));

        Lesson lesson = createLessonDto.toLesson(section);
        return DisplayLessonDto.from(lessonRepository.save(lesson));
    }

    @Override
    public DisplayLessonDto updateLesson(Long lessonId, UpdateLessonDto updateLessonDto) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new LessonNotFoundException(lessonId));

        Course course = lesson.getSection().getCourse();
        if (!lesson.getOrderIndex().equals(updateLessonDto.orderIndex())
                && lessonRepository.existsBySection_Course_IdAndOrderIndexAndIdNot(
                course.getId(), updateLessonDto.orderIndex(), lessonId)) {
            throw new LessonOrderConflictException(course.getId(), updateLessonDto.orderIndex());
        }

        lesson.setTitle(updateLessonDto.title());
        lesson.setMarkdownContent(updateLessonDto.content());
        lesson.setOrderIndex(updateLessonDto.orderIndex());
        return DisplayLessonDto.from(lessonRepository.save(lesson));
    }

    @Override
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new LessonNotFoundException(lessonId));
        lessonRepository.delete(lesson);
    }
}





