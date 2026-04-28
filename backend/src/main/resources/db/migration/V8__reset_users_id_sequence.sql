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

