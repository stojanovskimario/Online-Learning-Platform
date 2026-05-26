INSERT INTO users (username, email, password_hash, first_name, last_name, role, subscription_tier, ai_messages_today, stripe_customer_id, created_at, updated_at)
VALUES
    ('admin', 'admin@gmail.com', '$2a$12$SCkmg0yuBpnSzOI5nPhTJOlksbinhKO0HQ3PDEu1eok6iZYNsbVYe', 'Admin', 'User', 'ADMIN', 'FREE', 0, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

DO $$
DECLARE
    sequence_name text;
    max_id bigint;
BEGIN
    sequence_name := pg_get_serial_sequence('users', 'id');
    SELECT COALESCE(MAX(id), 0) INTO max_id FROM users;

    IF max_id = 0 THEN
        EXECUTE format('SELECT setval(%L, 1, false)', sequence_name);
    ELSE
        EXECUTE format('SELECT setval(%L, %s, true)', sequence_name, max_id);
    END IF;
END $$;


