package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.CreateLessonDto;
import com.learnix.backend.model.dto.DisplayLessonDto;
import com.learnix.backend.model.dto.UpdateLessonDto;

import java.util.List;

public interface LessonService {
    List<DisplayLessonDto> getLessonsByCourse(Long courseId);

    DisplayLessonDto createLesson(Long courseId, CreateLessonDto createLessonDto);

    DisplayLessonDto updateLesson(Long lessonId, UpdateLessonDto updateLessonDto);

    void deleteLesson(Long lessonId);
}

