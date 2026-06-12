package com.learnix.backend.service.application.impl;

import com.learnix.backend.model.domain.AnswerOption;
import com.learnix.backend.model.domain.AttemptAnswer;
import com.learnix.backend.model.domain.Question;
import com.learnix.backend.model.domain.Quiz;
import com.learnix.backend.model.domain.QuizAttempt;
import com.learnix.backend.model.domain.User;
import com.learnix.backend.model.dto.QuizAttemptResultDto;
import com.learnix.backend.model.dto.QuizAttemptSubmissionDto;
import com.learnix.backend.model.exceptions.QuizAttemptLimitExceededException;
import com.learnix.backend.model.exceptions.QuizNotFoundException;
import com.learnix.backend.model.exceptions.QuizSubmissionException;
import com.learnix.backend.repository.AnswerOptionRepository;
import com.learnix.backend.repository.AttemptAnswerRepository;
import com.learnix.backend.repository.QuestionRepository;
import com.learnix.backend.repository.QuizAttemptRepository;
import com.learnix.backend.repository.QuizRepository;
import com.learnix.backend.repository.UserRepository;
import com.learnix.backend.service.application.QuizAttemptService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizAttemptServiceImpl implements QuizAttemptService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;
    private final UserRepository userRepository;

    public QuizAttemptServiceImpl(
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            AnswerOptionRepository answerOptionRepository,
            QuizAttemptRepository quizAttemptRepository,
            AttemptAnswerRepository attemptAnswerRepository,
            UserRepository userRepository
    ) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.answerOptionRepository = answerOptionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.attemptAnswerRepository = attemptAnswerRepository;
        this.userRepository = userRepository;
    }

    @Override
    public QuizAttemptResultDto submitAttempt(Long userId, Long quizId, QuizAttemptSubmissionDto submissionDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new QuizSubmissionException("User %d does not exist.".formatted(userId)));
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new QuizNotFoundException("A quiz with id %d does not exist.".formatted(quizId)));

        enforceAttemptLimit(userId, quizId);

        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quizId);
        if (questions.isEmpty()) {
            throw new QuizSubmissionException("Quiz %d has no questions.".formatted(quizId));
        }

        Map<Long, List<Long>> answers = submissionDto.answers();
        Set<Long> questionIds = questions.stream().map(Question::getId).collect(Collectors.toSet());
        if (answers == null || !answers.keySet().equals(questionIds)) {
            throw new QuizSubmissionException("You must answer every question exactly once.");
        }

        List<AttemptAnswer> attemptAnswers = new ArrayList<>();
        int correctAnswers = 0;
        for (Question question : questions) {
            List<Long> selectedIds = answers.get(question.getId());
            if (selectedIds == null || selectedIds.isEmpty()) {
                throw new QuizSubmissionException("You must answer every question exactly once.");
            }

            List<AnswerOption> allOptions = answerOptionRepository.findByQuestionId(question.getId());
            Set<Long> allOptionIds = allOptions.stream().map(AnswerOption::getId).collect(Collectors.toSet());

            for (Long selectedId : selectedIds) {
                if (!allOptionIds.contains(selectedId)) {
                    throw new QuizSubmissionException(
                            "Answer option %d does not belong to question %d.".formatted(selectedId, question.getId()));
                }
            }

            if (!question.isAllowsMultiple() && selectedIds.size() > 1) {
                throw new QuizSubmissionException(
                        "Question %d does not allow multiple selections.".formatted(question.getId()));
            }

            Set<Long> correctIds = allOptions.stream()
                    .filter(AnswerOption::isCorrect)
                    .map(AnswerOption::getId)
                    .collect(Collectors.toSet());
            boolean questionCorrect = new HashSet<>(selectedIds).equals(correctIds);
            if (questionCorrect) {
                correctAnswers++;
            }

            for (Long selectedId : selectedIds) {
                AnswerOption option = allOptions.stream()
                        .filter(o -> o.getId().equals(selectedId))
                        .findFirst()
                        .orElseThrow(() -> new QuizSubmissionException(
                                "Answer option %d not found.".formatted(selectedId)));
                AttemptAnswer attemptAnswer = new AttemptAnswer();
                attemptAnswer.setQuestion(question);
                attemptAnswer.setAnswerOption(option);
                attemptAnswer.setCorrect(questionCorrect);
                attemptAnswers.add(attemptAnswer);
            }
        }

        int totalQuestions = questions.size();
        int score = (int) Math.round(correctAnswers * 100.0 / totalQuestions);
        int passScore = quiz.getPassScore() != null ? quiz.getPassScore() : 70;

        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.setUser(user);
        quizAttempt.setQuiz(quiz);
        quizAttempt.setScore(score);
        quizAttempt.setPassed(score >= passScore);
        quizAttempt.setAttemptedAt(LocalDateTime.now());

        QuizAttempt savedAttempt = quizAttemptRepository.save(quizAttempt);
        attemptAnswers.forEach(attemptAnswer -> attemptAnswer.setQuizAttempt(savedAttempt));
        attemptAnswerRepository.saveAll(attemptAnswers);

        return new QuizAttemptResultDto(
                savedAttempt.getId(),
                quizId,
                score,
                correctAnswers,
                totalQuestions,
                savedAttempt.isPassed(),
                savedAttempt.getAttemptedAt()
        );
    }

    @Override
    public java.util.List<com.learnix.backend.model.dto.QuizAttemptSummaryDto> getRecentAttempts(Long userId, int limit) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, limit);
        java.util.List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdOrderByAttemptedAtDesc(userId, pageable);
        java.util.List<com.learnix.backend.model.dto.QuizAttemptSummaryDto> dtos = new java.util.ArrayList<>();
        java.time.format.DateTimeFormatter fmt = java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        for (QuizAttempt a : attempts) {
            String quizTitle = a.getQuiz() != null ? a.getQuiz().getTitle() : null;
            String courseTitle = null;
            if (a.getQuiz() != null && a.getQuiz().getLesson() != null && a.getQuiz().getLesson().getSection() != null
                    && a.getQuiz().getLesson().getSection().getCourse() != null) {
                courseTitle = a.getQuiz().getLesson().getSection().getCourse().getTitle();
            }
            dtos.add(new com.learnix.backend.model.dto.QuizAttemptSummaryDto(
                    a.getId(),
                    quizTitle,
                    courseTitle,
                    a.getScore() != null ? a.getScore() : 0,
                    a.isPassed(),
                    a.getAttemptedAt() != null ? a.getAttemptedAt().format(fmt) : null
            ));
        }
        return dtos;
    }

    private void enforceAttemptLimit(Long userId, Long quizId) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime startOfTomorrow = today.plusDays(1).atStartOfDay();

        long attemptsToday = quizAttemptRepository.countByUserIdAndQuizIdAndAttemptedAtGreaterThanEqualAndAttemptedAtLessThan(
                userId,
                quizId,
                startOfDay,
                startOfTomorrow
        );
        if (attemptsToday >= 3) {
            throw new QuizAttemptLimitExceededException(quizId, userId);
        }
    }
}


