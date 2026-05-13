package com.learnix.backend.service.application.impl;

import com.learnix.backend.model.domain.AnswerOption;
import com.learnix.backend.model.domain.Question;
import com.learnix.backend.model.domain.Quiz;
import com.learnix.backend.model.dto.DisplayQuestionDto;
import com.learnix.backend.model.dto.DisplayQuizDto;
import com.learnix.backend.model.exceptions.QuizNotFoundException;
import com.learnix.backend.repository.AnswerOptionRepository;
import com.learnix.backend.repository.QuestionRepository;
import com.learnix.backend.repository.QuizRepository;
import com.learnix.backend.service.application.QuizService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;

    public QuizServiceImpl(
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            AnswerOptionRepository answerOptionRepository
    ) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.answerOptionRepository = answerOptionRepository;
    }

    @Override
    public DisplayQuizDto getQuizByLesson(Long lessonId) {
        Quiz quiz = quizRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new QuizNotFoundException("A quiz for lesson %d does not exist.".formatted(lessonId)));
        return toDisplayQuizDto(quiz);
    }

    @Override
    public DisplayQuizDto getQuizById(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new QuizNotFoundException("A quiz with id %d does not exist.".formatted(quizId)));
        return toDisplayQuizDto(quiz);
    }

    private DisplayQuizDto toDisplayQuizDto(Quiz quiz) {
        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quiz.getId());
        List<DisplayQuestionDto> questionDtos = DisplayQuestionDto.from(questions, questionId ->
                answerOptionRepository.findByQuestionIdOrderByOrderIndexAsc(questionId)
        );

        return new DisplayQuizDto(
                quiz.getId(),
                quiz.getLesson() != null ? quiz.getLesson().getId() : null,
                quiz.getTitle(),
                quiz.getPassScore(),
                quiz.getTimeLimitSeconds(),
                questionDtos
        );
    }
}

