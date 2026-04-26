CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(512)
);

CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    instructor_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(2048),
    category_id BIGINT NOT NULL,
    price DOUBLE PRECISION NOT NULL DEFAULT 0,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(32),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_courses_category
        FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE INDEX idx_courses_category_id ON courses (category_id);
CREATE INDEX idx_courses_instructor_id ON courses (instructor_id);
CREATE INDEX idx_courses_status ON courses (status);
