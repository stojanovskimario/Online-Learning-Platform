UPDATE courses
SET thumbnail_url = '/images/java.png',
    updated_at = NOW()
WHERE title = 'Java Fundamentals';

UPDATE courses
SET thumbnail_url = '/images/startup.png',
    updated_at = NOW()
WHERE title = 'Startup Basics';

UPDATE courses
SET thumbnail_url = '/images/oop.png',
    updated_at = NOW()
WHERE title = 'UI Design Essentials';

