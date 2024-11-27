CREATE TABLE user_services (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE user_services
ADD CONSTRAINT fk_user_id
FOREIGN KEY (user_id) REFERENCES users (id)
ON DELETE CASCADE;

ALTER TABLE user_services
ADD CONSTRAINT fk_service_id
FOREIGN KEY (service_id) REFERENCES services (id)
ON DELETE CASCADE;