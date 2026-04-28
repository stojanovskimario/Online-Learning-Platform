INSERT INTO users (id, username, first_name, last_name, role, subscription_tier, ai_messages_today, stripe_customer_id, created_at, updated_at)
VALUES
    (1, 'instructor1', 'Ada', 'Lovelace', 'INSTRUCTOR', 'FREE', 0, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'instructor2', 'Alan', 'Turing', 'INSTRUCTOR', 'FREE', 0, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'instructor3', 'Grace', 'Hopper', 'INSTRUCTOR', 'FREE', 0, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

