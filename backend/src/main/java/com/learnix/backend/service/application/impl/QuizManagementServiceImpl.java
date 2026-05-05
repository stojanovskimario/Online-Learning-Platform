package com.learnix.backend.service.application.impl;

import com.learnix.backend.model.domain.AnswerOption;
import com.learnix.backend.model.domain.Lesson;
import com.learnix.backend.model.domain.Question;
import com.learnix.backend.model.domain.Quiz;
import com.learnix.backend.model.dto.CreateAnswerOptionDto;
import com.learnix.backend.model.dto.CreateQuestionDto;
import com.learnix.backend.model.dto.CreateQuizDto;
import com.learnix.backend.model.dto.DisplayQuestionDto;
import com.learnix.backend.model.dto.DisplayQuizDto;
import com.learnix.backend.model.exceptions.LessonNotFoundException;
import com.learnix.backend.model.exceptions.QuestionHasAttemptsException;
import com.learnix.backend.model.exceptions.QuestionNotFoundException;
import com.learnix.backend.model.exceptions.QuestionOrderConflictException;
import com.learnix.backend.model.exceptions.QuizAlreadyExistsException;
import com.learnix.backend.model.exceptions.QuizNotFoundException;
import com.learnix.backend.model.exceptions.QuizSubmissionException;
import com.learnix.backend.repository.AnswerOptionRepository;
import com.learnix.backend.repository.AttemptAnswerRepository;
import com.learnix.backend.repository.LessonRepository;
import com.learnix.backend.repository.QuestionRepository;
import com.learnix.backend.repository.QuizAttemptRepository;
import com.learnix.backend.repository.QuizRepository;
import com.learnix.backend.service.application.QuizManagementService;
import com.learnix.backend.service.application.QuizService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizManagementServiceImpl implements QuizManagementService {

    private final QuizRepository quizRepository;
    private final LessonRepository lessonRepository;
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizService quizService;

    public QuizManagementServiceImpl(
            QuizRepository quizRepository,
            LessonRepository lessonRepository,
            QuestionRepository questionRepository,
            AnswerOptionRepository answerOptionRepository,
            AttemptAnswerRepository attemptAnswerRepository,
            QuizAttemptRepository quizAttemptRepository,
            QuizService quizService
    ) {
        this.quizRepository = quizRepository;
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
        this.answerOptionRepository = answerOptionRepository;
        this.attemptAnswerRepository = attemptAnswerRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.quizService = quizService;
    }

    @Override
    public DisplayQuizDto createQuiz(Long lessonId, CreateQuizDto createQuizDto) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new LessonNotFoundException(lessonId));

        if (quizRepository.findByLessonId(lessonId).isPresent()) {
            throw new QuizAlreadyExistsException(lessonId);
        }

        Quiz quiz = new Quiz();
        quiz.setLesson(lesson);
        quiz.setTitle(createQuizDto.title());
        quiz.setPassScore(createQuizDto.passScore() != null ? createQuizDto.passScore() : 70);
        quiz.setTimeLimitSeconds(createQuizDto.timeLimitSeconds());

        Quiz savedQuiz = quizRepository.save(quiz);
        return quizService.getQuizById(savedQuiz.getId());
    }

    @Override
    public DisplayQuizDto updateQuiz(Long quizId, CreateQuizDto createQuizDto) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new QuizNotFoundException("A quiz with id %d does not exist.".formatted(quizId)));

        quiz.setTitle(createQuizDto.title());
        if (createQuizDto.passScore() != null) {
            quiz.setPassScore(createQuizDto.passScore());
        }
        quiz.setTimeLimitSeconds(createQuizDto.timeLimitSeconds());

        quizRepository.save(quiz);
        return quizService.getQuizById(quizId);
    }

    @Override
    public void deleteQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new QuizNotFoundException("A quiz with id %d does not exist.".formatted(quizId)));

        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quizId);
        for (Question question : questions) {
            attemptAnswerRepository.findByQuestionId(question.getId()).forEach(attemptAnswerRepository::delete);
            answerOptionRepository.findByQuestionId(question.getId()).forEach(answerOptionRepository::delete);
            questionRepository.delete(question);
        }

        quizAttemptRepository.findByQuizId(quizId).forEach(quizAttempt -> {
            attemptAnswerRepository.findByQuizAttemptId(quizAttempt.getId()).forEach(attemptAnswerRepository::delete);
            quizAttemptRepository.delete(quizAttempt);
        });

        quizRepository.delete(quiz);
    }

    @Override
    public DisplayQuestionDto createQuestion(Long quizId, CreateQuestionDto createQuestionDto) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new QuizNotFoundException("A quiz with id %d does not exist.".formatted(quizId)));

        if (questionRepository.existsByQuizIdAndOrderIndex(quizId, createQuestionDto.orderIndex())) {
            throw new QuestionOrderConflictException(quizId, createQuestionDto.orderIndex());
        }

        validateAnswerOptions(createQuestionDto);

        Question question = new Question();
        question.setQuiz(quiz);
        question.setType(createQuestionDto.type());
        question.setPrompt(createQuestionDto.text());
        question.setExplanation(createQuestionDto.explanation());
        question.setOrderIndex(createQuestionDto.orderIndex());

        Question savedQuestion = questionRepository.save(question);
        List<AnswerOption> answerOptions = saveAnswerOptions(savedQuestion, createQuestionDto.answerOptions());
        return DisplayQuestionDto.from(savedQuestion, answerOptions);
    }

    @Override
    public DisplayQuestionDto updateQuestion(Long questionId, CreateQuestionDto createQuestionDto) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new QuestionNotFoundException(questionId));

        Long quizId = question.getQuiz().getId();
        if (!question.getOrderIndex().equals(createQuestionDto.orderIndex())
                && questionRepository.existsByQuizIdAndOrderIndexAndIdNot(quizId, createQuestionDto.orderIndex(), questionId)) {
            throw new QuestionOrderConflictException(quizId, createQuestionDto.orderIndex());
        }

        validateAnswerOptions(createQuestionDto);
        List<AnswerOption> existingAnswerOptions = answerOptionRepository.findByQuestionIdOrderByOrderIndexAsc(questionId);
        boolean answerOptionsChanged = answerOptionsChanged(existingAnswerOptions, createQuestionDto.answerOptions());
        if (answerOptionsChanged && attemptAnswerRepository.existsByQuestionId(questionId)) {
            throw new QuestionHasAttemptsException(questionId);
        }

        question.setType(createQuestionDto.type());
        question.setPrompt(createQuestionDto.text());
        question.setExplanation(createQuestionDto.explanation());
        question.setOrderIndex(createQuestionDto.orderIndex());
        questionRepository.save(question);

        if (answerOptionsChanged) {
            answerOptionRepository.deleteAll(existingAnswerOptions);
            answerOptionRepository.flush();
            existingAnswerOptions = saveAnswerOptions(question, createQuestionDto.answerOptions());
        }

        return DisplayQuestionDto.from(question, existingAnswerOptions.isEmpty()
                ? answerOptionRepository.findByQuestionIdOrderByOrderIndexAsc(questionId)
                : existingAnswerOptions);
    }

    @Override
    public void deleteQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new QuestionNotFoundException(questionId));

        attemptAnswerRepository.findByQuestionId(questionId).forEach(attemptAnswerRepository::delete);
        answerOptionRepository.findByQuestionId(questionId).forEach(answerOptionRepository::delete);
        questionRepository.delete(question);
    }

    private void validateAnswerOptions(CreateQuestionDto createQuestionDto) {
        List<CreateAnswerOptionDto> answerOptions = createQuestionDto.answerOptions();
        if (answerOptions == null || answerOptions.size() < 2) {
            throw new QuizSubmissionException("At least two answer options are required.");
        }

        long correctAnswers = answerOptions.stream().filter(CreateAnswerOptionDto::correct).count();
        if (correctAnswers != 1) {
            throw new QuizSubmissionException("Each question must have exactly one correct answer.");
        }

        Set<Integer> orderIndexes = answerOptions.stream()
                .map(CreateAnswerOptionDto::orderIndex)
                .collect(Collectors.toSet());
        if (orderIndexes.size() != answerOptions.size()) {
            throw new QuizSubmissionException("Answer option order indexes must be unique.");
        }

        if (createQuestionDto.type() == com.learnix.backend.model.enums.QuestionType.TRUE_FALSE && answerOptions.size() != 2) {
            throw new QuizSubmissionException("True/false questions must have exactly two answer options.");
        }
    }

    private List<AnswerOption> saveAnswerOptions(Question question, List<CreateAnswerOptionDto> answerOptionsDto) {
        List<AnswerOption> answerOptions = answerOptionsDto.stream()
                .sorted(Comparator.comparing(CreateAnswerOptionDto::orderIndex))
                .map(dto -> {
                    AnswerOption answerOption = new AnswerOption();
                    answerOption.setQuestion(question);
                    answerOption.setText(dto.text());
                    answerOption.setOrderIndex(dto.orderIndex());
                    answerOption.setCorrect(dto.correct());
                    return answerOption;
                })
                .toList();
        return answerOptionRepository.saveAll(answerOptions);
    }

    private boolean answerOptionsChanged(List<AnswerOption> existingAnswerOptions, List<CreateAnswerOptionDto> requestedAnswerOptions) {
        if (existingAnswerOptions.size() != requestedAnswerOptions.size()) {
            return true;
        }

        List<AnswerOption> sortedExisting = existingAnswerOptions.stream()
                .sorted(Comparator.comparing(AnswerOption::getOrderIndex))
                .toList();
        List<CreateAnswerOptionDto> sortedRequested = requestedAnswerOptions.stream()
                .sorted(Comparator.comparing(CreateAnswerOptionDto::orderIndex))
                .toList();

        for (int i = 0; i < sortedExisting.size(); i++) {
            AnswerOption existing = sortedExisting.get(i);
            CreateAnswerOptionDto requested = sortedRequested.get(i);
            if (!existing.getText().equals(requested.text())
                    || !existing.getOrderIndex().equals(requested.orderIndex())
                    || existing.isCorrect() != requested.correct()) {
                return true;
            }
        }
        return false;
    }
}

