package com.learnix.backend.service.application.impl;

import com.learnix.backend.model.domain.Course;
import com.learnix.backend.model.domain.Lesson;
import com.learnix.backend.model.domain.LessonProgress;
import com.learnix.backend.model.domain.Section;
import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.CourseProgressDto;
import com.learnix.backend.model.dto.LessonProgressDto;
import com.learnix.backend.repository.CourseRepository;
import com.learnix.backend.repository.LessonProgressRepository;
import com.learnix.backend.repository.LessonRepository;
import com.learnix.backend.repository.SectionRepository;
import com.learnix.backend.repository.UserRepository;
import com.learnix.backend.service.application.ProgressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProgressServiceImpl implements ProgressService {

    private final LessonProgressRepository lessonProgressRepository;
    private final LessonRepository lessonRepository;
    private final SectionRepository sectionRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public ProgressServiceImpl(
            LessonProgressRepository lessonProgressRepository,
            LessonRepository lessonRepository,
            SectionRepository sectionRepository,
            CourseRepository courseRepository,
            UserRepository userRepository
    ) {
        this.lessonProgressRepository = lessonProgressRepository;
        this.lessonRepository = lessonRepository;
        this.sectionRepository = sectionRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public LessonProgressDto completeLesson(Long userId, Long lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found: " + lessonId));

        LessonProgress lessonProgress = lessonProgressRepository.findByUserIdAndLessonId(userId, lessonId)
                .map(existing -> {
                    if (!existing.isCompleted()) {
                        existing.setCompleted(true);
                        if (existing.getCompletedAt() == null) {
                            existing.setCompletedAt(LocalDateTime.now());
                        }
                    }
                    return existing;
                })
                .orElseGet(() -> {
                    LessonProgress created = new LessonProgress();
                    created.setUser(user);
                    created.setLesson(lesson);
                    created.setCompleted(true);
                    created.setCompletedAt(LocalDateTime.now());
                    return created;
                });

        return LessonProgressDto.from(lessonProgressRepository.save(lessonProgress));
    }

    @Override
    @Transactional(readOnly = true)
    public LessonProgressDto getLessonProgress(Long userId, Long lessonId) {
        lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found: " + lessonId));

        return lessonProgressRepository.findByUserIdAndLessonId(userId, lessonId)
                .map(LessonProgressDto::from)
                .orElse(new LessonProgressDto(lessonId, userId, false, null));
    }

    @Override
    @Transactional(readOnly = true)
    public CourseProgressDto getCourseProgress(Long userId, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        List<Section> sections = sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        Set<Long> lessonIds = new HashSet<>();
        for (Section section : sections) {
            List<Lesson> lessons = lessonRepository.findBySectionIdOrderByOrderIndexAsc(section.getId());
            for (Lesson lesson : lessons) {
                lessonIds.add(lesson.getId());
            }
        }

        long totalLessons = lessonIds.size();
        long completedLessons = 0;
        for (Long lessonId : lessonIds) {
            if (lessonProgressRepository.findByUserIdAndLessonId(userId, lessonId)
                    .map(LessonProgress::isCompleted)
                    .orElse(false)) {
                completedLessons++;
            }
        }

        double percentage = totalLessons == 0 ? 0.0 : (completedLessons * 100.0) / totalLessons;
        return new CourseProgressDto(course.getId(), completedLessons, totalLessons, percentage);
    }
}

