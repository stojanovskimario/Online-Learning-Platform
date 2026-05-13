INSERT INTO sections (course_id, title, order_index, created_at, updated_at) VALUES
(1, 'Getting Started with Java', 1, NOW(), NOW()),
(1, 'Object-Oriented Programming', 2, NOW(), NOW()),
(1, 'Collections & Generics', 3, NOW(), NOW()),
(3, 'Idea Validation', 1, NOW(), NOW()),
(3, 'Building Your MVP', 2, NOW(), NOW());

INSERT INTO lessons (section_id, title, markdown_content, video_url, order_index, created_at, updated_at)
SELECT id, 'What is Java?', '# What is Java?

Java is a high-level, object-oriented programming language.

## Key Features
- Platform independent
- Object-oriented
- Strongly typed
- Garbage collected', NULL, 1, NOW(), NOW()
FROM sections WHERE course_id = 1 AND title = 'Getting Started with Java';

INSERT INTO lessons (section_id, title, markdown_content, video_url, order_index, created_at, updated_at)
SELECT id, 'Setting Up Your Environment', '# Setting Up Your Environment

Download JDK 21 from adoptium.net and verify with java -version', NULL, 2, NOW(), NOW()
FROM sections WHERE course_id = 1 AND title = 'Getting Started with Java';

INSERT INTO lessons (section_id, title, markdown_content, video_url, order_index, created_at, updated_at)
SELECT id, 'Variables and Data Types', '# Variables and Data Types

## Primitive Types
int age = 25;
double price = 19.99;
boolean isActive = true;', NULL, 3, NOW(), NOW()
FROM sections WHERE course_id = 1 AND title = 'Getting Started with Java';

INSERT INTO lessons (section_id, title, markdown_content, video_url, order_index, created_at, updated_at)
SELECT id, 'Classes and Objects', '# Classes and Objects

A class is a blueprint for creating objects.', NULL, 1, NOW(), NOW()
FROM sections WHERE course_id = 1 AND title = 'Object-Oriented Programming';

INSERT INTO lessons (section_id, title, markdown_content, video_url, order_index, created_at, updated_at)
SELECT id, 'Inheritance and Polymorphism', '# Inheritance and Polymorphism

Inheritance allows a class to reuse code from another class.', NULL, 2, NOW(), NOW()
FROM sections WHERE course_id = 1 AND title = 'Object-Oriented Programming';

INSERT INTO lessons (section_id, title, markdown_content, video_url, order_index, created_at, updated_at)
SELECT id, 'Interfaces and Abstract Classes', '# Interfaces and Abstract Classes

Interfaces define contracts that classes must implement.', NULL, 3, NOW(), NOW()
FROM sections WHERE course_id = 1 AND title = 'Object-Oriented Programming';

INSERT INTO lessons (section_id, title, markdown_content, video_url, order_index, created_at, updated_at)
SELECT id, 'ArrayList and LinkedList', '# ArrayList and LinkedList

Lists store ordered collections of elements.', NULL, 1, NOW(), NOW()
FROM sections WHERE course_id = 1 AND title = 'Collections & Generics';

INSERT INTO lessons (section_id, title, markdown_content, video_url, order_index, created_at, updated_at)
SELECT id, 'HashMap and HashSet', '# HashMap and HashSet

Maps store key-value pairs for fast lookup.', NULL, 2, NOW(), NOW()
FROM sections WHERE course_id = 1 AND title = 'Collections & Generics';

INSERT INTO lessons (section_id, title, markdown_content, video_url, order_index, created_at, updated_at)
SELECT id, 'What is Idea Validation?', '# What is Idea Validation?

Testing whether your business idea has real demand.', NULL, 1, NOW(), NOW()
FROM sections WHERE course_id = 3 AND title = 'Idea Validation';

INSERT INTO lessons (section_id, title, markdown_content, video_url, order_index, created_at, updated_at)
SELECT id, 'Customer Discovery Interviews', '# Customer Discovery Interviews

Talk to potential customers before building anything.', NULL, 2, NOW(), NOW()
FROM sections WHERE course_id = 3 AND title = 'Idea Validation';

INSERT INTO lessons (section_id, title, markdown_content, video_url, order_index, created_at, updated_at)
SELECT id, 'Defining Your MVP', '# Defining Your MVP

Build the minimum needed to test your hypothesis.', NULL, 1, NOW(), NOW()
FROM sections WHERE course_id = 3 AND title = 'Building Your MVP';

INSERT INTO lessons (section_id, title, markdown_content, video_url, order_index, created_at, updated_at)
SELECT id, 'Finding Your First Users', '# Finding Your First Users

Early adopters are key to product validation.', NULL, 2, NOW(), NOW()
FROM sections WHERE course_id = 3 AND title = 'Building Your MVP';
