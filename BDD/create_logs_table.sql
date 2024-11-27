CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    message TEXT,
    executed_at TIMESTAMP
);

ALTER TABLE logs
ADD CONSTRAINT fk_workflow_id
FOREIGN KEY (workflow_id) REFERENCES workflows (id)
ON DELETE CASCADE;