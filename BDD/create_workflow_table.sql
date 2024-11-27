CREATE TABLE workflows (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    action_id INT NOT NULL,
    reaction_id INT NOT NULL,
    parameters JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ;

ALTER TABLE workflows
ADD CONSTRAINT fk_user_id
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE workflows
ADD CONSTRAINT fk_action_id
FOREIGN KEY (action_id) REFERENCES actions(id)
ON DELETE CASCADE;

ALTER TABLE workflows
ADD CONSTRAINT fk_reaction_id
FOREIGN KEY (reaction_id) REFERENCES reactions(id)
ON DELETE CASCADE;