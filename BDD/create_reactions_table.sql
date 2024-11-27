CREATE TABLE reactions (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parameters JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE reactions
ADD CONSTRAINT fk_service_id
FOREIGN KEY (service_id) REFERENCES services (id)
ON DELETE CASCADE;