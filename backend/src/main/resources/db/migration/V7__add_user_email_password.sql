ALTER TABLE users ADD COLUMN email VARCHAR(255);
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);

UPDATE users
SET email = 'instructor1@test.local',
    password_hash = '$2a$12$qcEEiHUAPBj6AQzFAmoYmeRYsoZ8gB4IDGsItMmSELBzDQxTEsrxG'
WHERE id = 1;

UPDATE users
SET email = 'instructor2@test.local',
    password_hash = '$2a$12$RQpQKMGwGU1J8FsR8/3DO.3cXWNi/frenvK0hW7430vABI/bxkrjq'
WHERE id = 2;

UPDATE users
SET email = 'instructor3@test.local',
    password_hash = '$2a$12$agrR0.mkrbAHlL6Y9o.W9OhoQEw9RASbLXD3giYPdWORK6wfipdzS'
WHERE id = 3;

ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT uk_users_email UNIQUE (email);

