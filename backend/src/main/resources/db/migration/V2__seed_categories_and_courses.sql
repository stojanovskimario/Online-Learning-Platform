INSERT INTO categories (name, description)
VALUES
    ('Programming', 'Courses focused on software development, coding fundamentals, and engineering practices.'),
    ('Design', 'Courses covering UI, UX, graphic design, and product design foundations.'),
    ('Business', 'Courses for entrepreneurship, management, marketing, and communication skills.')
ON CONFLICT (name) DO NOTHING;

INSERT INTO courses (instructor_id, title, description, thumbnail_url, category_id, price, is_premium, status, created_at, updated_at)
VALUES
    (
        1,
        'Java Fundamentals',
        'An introductory course covering Java syntax, OOP basics, and problem solving.',
        'https://example.com/images/java-fundamentals.jpg',
        (SELECT id FROM categories WHERE name = 'Programming'),
        0,
        FALSE,
        'PUBLISHED',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        2,
        'UI Design Essentials',
        'A practical introduction to layout, typography, spacing, and interface design.',
        'https://example.com/images/ui-design-essentials.jpg',
        (SELECT id FROM categories WHERE name = 'Design'),
        29.99,
        TRUE,
        'DRAFT',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        3,
        'Startup Basics',
        'Learn the core principles of validating ideas, building MVPs, and finding early users.',
        'https://example.com/images/startup-basics.jpg',
        (SELECT id FROM categories WHERE name = 'Business'),
        19.99,
        FALSE,
        'PUBLISHED',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT DO NOTHING;
