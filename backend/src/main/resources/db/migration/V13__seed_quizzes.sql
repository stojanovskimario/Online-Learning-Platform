-- ============================================================
-- Quizzes for Java Fundamentals (course_id = 1)
-- ============================================================

-- Quiz: What is Java?
INSERT INTO quizzes (lesson_id, title, pass_score, time_limit_seconds, created_at, updated_at)
SELECT l.id, 'What is Java? — Quiz', 70, NULL, NOW(), NOW()
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.course_id = 1 AND l.title = 'What is Java?'
ON CONFLICT DO NOTHING;

INSERT INTO questions (quiz_id, type, prompt, explanation, order_index, allows_multiple, created_at, updated_at)
SELECT q.id, 'MULTIPLE_CHOICE',
    'Which of the following best describes Java?',
    'Java is a compiled, platform-independent, object-oriented language that runs on the JVM.',
    1, FALSE, NOW(), NOW()
FROM quizzes q
JOIN lessons l ON q.lesson_id = l.id
WHERE l.title = 'What is Java?'
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'A compiled, platform-independent, object-oriented language', TRUE, 1, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Java?' AND q.order_index = 1
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'A scripting language that only runs on Windows', FALSE, 2, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Java?' AND q.order_index = 1
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'A database query language', FALSE, 3, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Java?' AND q.order_index = 1
ON CONFLICT DO NOTHING;

INSERT INTO questions (quiz_id, type, prompt, explanation, order_index, allows_multiple, created_at, updated_at)
SELECT q.id, 'TRUE_FALSE',
    'Java programs run directly on the operating system without any intermediate layer.',
    'False — Java compiles to bytecode that runs on the JVM, not directly on the OS.',
    2, FALSE, NOW(), NOW()
FROM quizzes q
JOIN lessons l ON q.lesson_id = l.id
WHERE l.title = 'What is Java?'
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'True', FALSE, 1, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Java?' AND q.order_index = 2
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'False', TRUE, 2, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Java?' AND q.order_index = 2
ON CONFLICT DO NOTHING;

INSERT INTO questions (quiz_id, type, prompt, explanation, order_index, allows_multiple, created_at, updated_at)
SELECT q.id, 'MULTIPLE_CHOICE',
    'Which of the following are key features of Java? (Select all that apply)',
    'Java is platform-independent, object-oriented, strongly typed, and garbage collected.',
    3, TRUE, NOW(), NOW()
FROM quizzes q
JOIN lessons l ON q.lesson_id = l.id
WHERE l.title = 'What is Java?'
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'Platform independent', TRUE, 1, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Java?' AND q.order_index = 3
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'Garbage collected', TRUE, 2, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Java?' AND q.order_index = 3
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'Dynamically typed', FALSE, 3, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Java?' AND q.order_index = 3
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'Strongly typed', TRUE, 4, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Java?' AND q.order_index = 3
ON CONFLICT DO NOTHING;

-- Quiz: Classes and Objects
INSERT INTO quizzes (lesson_id, title, pass_score, time_limit_seconds, created_at, updated_at)
SELECT l.id, 'Classes and Objects — Quiz', 70, NULL, NOW(), NOW()
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.course_id = 1 AND l.title = 'Classes and Objects'
ON CONFLICT DO NOTHING;

INSERT INTO questions (quiz_id, type, prompt, explanation, order_index, allows_multiple, created_at, updated_at)
SELECT q.id, 'MULTIPLE_CHOICE',
    'What is a class in Java?',
    'A class is a blueprint or template used to create objects.',
    1, FALSE, NOW(), NOW()
FROM quizzes q
JOIN lessons l ON q.lesson_id = l.id
WHERE l.title = 'Classes and Objects'
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'A blueprint for creating objects', TRUE, 1, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'Classes and Objects' AND q.order_index = 1
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'A running instance of a method', FALSE, 2, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'Classes and Objects' AND q.order_index = 1
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'A type of loop construct', FALSE, 3, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'Classes and Objects' AND q.order_index = 1
ON CONFLICT DO NOTHING;

INSERT INTO questions (quiz_id, type, prompt, explanation, order_index, allows_multiple, created_at, updated_at)
SELECT q.id, 'TRUE_FALSE',
    'In Java, you can create multiple objects from the same class.',
    'True — a class is a template and you can instantiate it as many times as needed.',
    2, FALSE, NOW(), NOW()
FROM quizzes q
JOIN lessons l ON q.lesson_id = l.id
WHERE l.title = 'Classes and Objects'
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'True', TRUE, 1, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'Classes and Objects' AND q.order_index = 2
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'False', FALSE, 2, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'Classes and Objects' AND q.order_index = 2
ON CONFLICT DO NOTHING;

-- ============================================================
-- Quiz: Idea Validation (Startup Basics)
-- ============================================================

INSERT INTO quizzes (lesson_id, title, pass_score, time_limit_seconds, created_at, updated_at)
SELECT l.id, 'Idea Validation — Quiz', 70, NULL, NOW(), NOW()
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.course_id = 3 AND l.title = 'What is Idea Validation?'
ON CONFLICT DO NOTHING;

INSERT INTO questions (quiz_id, type, prompt, explanation, order_index, allows_multiple, created_at, updated_at)
SELECT q.id, 'MULTIPLE_CHOICE',
    'What does idea validation try to determine?',
    'It checks whether a business idea has real demand before you build too much.',
    1, FALSE, NOW(), NOW()
FROM quizzes q
JOIN lessons l ON q.lesson_id = l.id
WHERE l.title = 'What is Idea Validation?'
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'Whether customers actually want the solution', TRUE, 1, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Idea Validation?' AND q.order_index = 1
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'Whether the logo looks modern', FALSE, 2, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Idea Validation?' AND q.order_index = 1
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'Whether the app has animations', FALSE, 3, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Idea Validation?' AND q.order_index = 1
ON CONFLICT DO NOTHING;

INSERT INTO questions (quiz_id, type, prompt, explanation, order_index, allows_multiple, created_at, updated_at)
SELECT q.id, 'MULTIPLE_CHOICE',
    'Which of the following are useful ways to validate an idea? (Select all that apply)',
    'Customer interviews and landing page tests are useful early validation techniques.',
    2, TRUE, NOW(), NOW()
FROM quizzes q
JOIN lessons l ON q.lesson_id = l.id
WHERE l.title = 'What is Idea Validation?'
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'Customer interviews', TRUE, 1, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Idea Validation?' AND q.order_index = 2
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'Landing page smoke tests', TRUE, 2, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Idea Validation?' AND q.order_index = 2
ON CONFLICT DO NOTHING;

INSERT INTO answer_options (question_id, text, is_correct, order_index, created_at, updated_at)
SELECT q.id, 'Shipping the full product immediately', FALSE, 3, NOW(), NOW()
FROM questions q
JOIN quizzes qz ON q.quiz_id = qz.id
JOIN lessons l ON qz.lesson_id = l.id
WHERE l.title = 'What is Idea Validation?' AND q.order_index = 2
ON CONFLICT DO NOTHING;

