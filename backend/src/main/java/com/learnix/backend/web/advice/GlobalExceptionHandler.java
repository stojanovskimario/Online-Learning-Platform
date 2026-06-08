package com.learnix.backend.web.advice;

import com.learnix.backend.model.dto.error.ApiErrorResponse;
import com.learnix.backend.model.exceptions.CourseNotFoundException;
import com.learnix.backend.model.exceptions.LessonNotFoundException;
import com.learnix.backend.model.exceptions.LessonOrderConflictException;
import com.learnix.backend.model.exceptions.QuestionHasAttemptsException;
import com.learnix.backend.model.exceptions.QuestionNotFoundException;
import com.learnix.backend.model.exceptions.QuestionOrderConflictException;
import com.learnix.backend.model.exceptions.SectionNotFoundException;
import com.learnix.backend.model.exceptions.SectionOrderConflictException;
import com.learnix.backend.model.exceptions.QuizAlreadyExistsException;
import com.learnix.backend.model.exceptions.QuizAttemptLimitExceededException;
import com.learnix.backend.model.exceptions.QuizNotFoundException;
import com.learnix.backend.model.exceptions.QuizSubmissionException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiErrorResponse(HttpStatus.UNAUTHORIZED.value(), ex.getMessage(), null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(FieldError::getDefaultMessage)
                .orElse("Validation failed.");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiErrorResponse(HttpStatus.BAD_REQUEST.value(), message, null));
    }

    @ExceptionHandler({CourseNotFoundException.class, LessonNotFoundException.class, SectionNotFoundException.class, QuizNotFoundException.class, QuestionNotFoundException.class})
    public ResponseEntity<ApiErrorResponse> handleNotFound(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage(), null));
    }

    @ExceptionHandler({LessonOrderConflictException.class, SectionOrderConflictException.class, QuizAlreadyExistsException.class, QuestionOrderConflictException.class, QuestionHasAttemptsException.class})
    public ResponseEntity<ApiErrorResponse> handleLessonConflict(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiErrorResponse(HttpStatus.CONFLICT.value(), ex.getMessage(), null));
    }

    @ExceptionHandler({QuizSubmissionException.class})
    public ResponseEntity<ApiErrorResponse> handleQuizSubmission(QuizSubmissionException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), null));
    }

    @ExceptionHandler(QuizAttemptLimitExceededException.class)
    public ResponseEntity<ApiErrorResponse> handleQuizAttemptLimit(QuizAttemptLimitExceededException ex) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(new ApiErrorResponse(HttpStatus.TOO_MANY_REQUESTS.value(), ex.getMessage(), null));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse> handleRuntime(RuntimeException ex) {
        if ("You need a Premium subscription to enroll in this course.".equals(ex.getMessage())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiErrorResponse(HttpStatus.FORBIDDEN.value(), ex.getMessage(), null));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage(), null));
    }
}

