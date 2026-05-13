ALTER TABLE users ADD COLUMN ai_messages_today INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);

