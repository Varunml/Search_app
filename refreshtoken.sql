CREATE TABLE refresh_tokens (user_id INT NOT NULL, CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES  users(user_id),
created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL, token_id SERIAL PRIMARY KEY, token VARCHAR(200), expires_at TIMESTAMPTZ, 
revoked BOOLEAN DEFAULT FALSE)