package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.CourseProgressDto;
import com.learnix.backend.model.dto.LessonProgressDto;

public interface ProgressService {
    LessonProgressDto completeLesson(Long userId, Long lessonId);

    CourseProgressDto getCourseProgress(Long userId, Long courseId);
}

