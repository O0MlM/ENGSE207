-- Drop table if exists
DROP TABLE IF EXISTS tasks;

-- Create tasks table
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'TODO',
    priority TEXT DEFAULT 'MEDIUM',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster status queries
CREATE INDEX idx_task_status ON tasks(status);

-- Sample data
INSERT INTO tasks (title, description, status, priority) VALUES
('Setup Development Environment', 'Install WSL, Node.js, SQLite, VS Code', 'DONE', 'HIGH'),
('Learn Monolithic Architecture', 'Understand all-in-one architecture pattern', 'IN_PROGRESS', 'HIGH'),
('Build Task Board App', 'Create CRUD operations for tasks', 'TODO', 'MEDIUM'),
('Write Documentation', 'Create README with setup instructions', 'TODO', 'LOW');
