CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(32),
    subscription_tier VARCHAR(32),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE sections (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_sections_course
        FOREIGN KEY (course_id) REFERENCES courses (id),
    CONSTRAINT uk_section_course_order
        UNIQUE (course_id, order_index)
);

CREATE TABLE lessons (
    id BIGSERIAL PRIMARY KEY,
    section_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    markdown_content TEXT NOT NULL,
    video_url VARCHAR(255),
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_lessons_section
        FOREIGN KEY (section_id) REFERENCES sections (id),
    CONSTRAINT uk_lesson_section_order
        UNIQUE (section_id, order_index)
);

CREATE TABLE enrollments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    status VARCHAR(32) NOT NULL,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_enrollments_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_enrollments_course
        FOREIGN KEY (course_id) REFERENCES courses (id),
    CONSTRAINT uk_enrollment_user_course
        UNIQUE (user_id, course_id)
);

CREATE TABLE quizzes (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    pass_score INTEGER NOT NULL,
    time_limit_seconds INTEGER,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_quizzes_lesson
        FOREIGN KEY (lesson_id) REFERENCES lessons (id),
    CONSTRAINT uk_quiz_lesson
        UNIQUE (lesson_id)
);

CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    type VARCHAR(32) NOT NULL,
    prompt TEXT NOT NULL,
    explanation TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_questions_quiz
        FOREIGN KEY (quiz_id) REFERENCES quizzes (id),
    CONSTRAINT uk_question_quiz_order
        UNIQUE (quiz_id, order_index)
);

CREATE TABLE answer_options (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    text VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_answer_options_question
        FOREIGN KEY (question_id) REFERENCES questions (id),
    CONSTRAINT uk_answer_option_question_order
        UNIQUE (question_id, order_index)
);

CREATE TABLE lesson_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    completed BOOLEAN NOT NULL,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_lesson_progress_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_lesson_progress_lesson
        FOREIGN KEY (lesson_id) REFERENCES lessons (id),
    CONSTRAINT uk_lesson_progress_user_lesson
        UNIQUE (user_id, lesson_id)
);

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_password_reset_tokens_user
        FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tier VARCHAR(32) NOT NULL,
    billing_cycle VARCHAR(32) NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    status VARCHAR(32) NOT NULL,
    next_billing_date TIMESTAMP,
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_subscriptions_user
        FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_id BIGINT,
    stripe_checkout_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_payments_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_payments_course
        FOREIGN KEY (course_id) REFERENCES courses (id)
);

CREATE TABLE certificates (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    verification_code VARCHAR(255) NOT NULL UNIQUE,
    issued_at TIMESTAMP NOT NULL,
    file_path VARCHAR(255),
    CONSTRAINT fk_certificates_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_certificates_course
        FOREIGN KEY (course_id) REFERENCES courses (id),
    CONSTRAINT uk_certificate_user_course
        UNIQUE (user_id, course_id)
);

CREATE TABLE quiz_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    quiz_id BIGINT NOT NULL,
    score INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    attempted_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_quiz_attempts_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_quiz_attempts_quiz
        FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
);

CREATE TABLE attempt_answers (
    id BIGSERIAL PRIMARY KEY,
    quiz_attempt_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    answer_option_id BIGINT,
    is_correct BOOLEAN NOT NULL,
    CONSTRAINT fk_attempt_answers_quiz_attempt
        FOREIGN KEY (quiz_attempt_id) REFERENCES quiz_attempts (id),
    CONSTRAINT fk_attempt_answers_question
        FOREIGN KEY (question_id) REFERENCES questions (id),
    CONSTRAINT fk_attempt_answers_answer_option
        FOREIGN KEY (answer_option_id) REFERENCES answer_options (id)
);

CREATE TABLE ai_chat_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    role VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_ai_chat_messages_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_ai_chat_messages_lesson
        FOREIGN KEY (lesson_id) REFERENCES lessons (id)
);

CREATE INDEX idx_sections_course_id ON sections (course_id);
CREATE INDEX idx_lessons_section_id ON lessons (section_id);
CREATE INDEX idx_enrollments_user_id ON enrollments (user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments (course_id);
CREATE INDEX idx_quizzes_lesson_id ON quizzes (lesson_id);
CREATE INDEX idx_questions_quiz_id ON questions (quiz_id);
CREATE INDEX idx_answer_options_question_id ON answer_options (question_id);
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress (user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress (lesson_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens (user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX idx_payments_user_id ON payments (user_id);
CREATE INDEX idx_payments_course_id ON payments (course_id);
CREATE INDEX idx_certificates_user_id ON certificates (user_id);
CREATE INDEX idx_certificates_course_id ON certificates (course_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts (user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts (quiz_id);
CREATE INDEX idx_attempt_answers_quiz_attempt_id ON attempt_answers (quiz_attempt_id);
CREATE INDEX idx_ai_chat_messages_user_id ON ai_chat_messages (user_id);
CREATE INDEX idx_ai_chat_messages_lesson_id ON ai_chat_messages (lesson_id);
