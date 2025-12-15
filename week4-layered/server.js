const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = new sqlite3.Database('./database/tasks.db', (err) => {
    if (err) console.error('❌ DB Error:', err.message);
    else console.log('✅ Database connected');
});

// --------------------
// API ROUTES
// --------------------

// GET all tasks
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, tasks: rows });
    });
});

// GET single task
app.get('/api/tasks/:id', (req, res) => {
    db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Task not found' });
        res.json({ success: true, task: row });
    });
});

// CREATE task
app.post('/api/tasks', (req, res) => {
    const { title, description, status, priority } = req.body;
    if (!title || title.trim() === '') return res.status(400).json({ error: 'Title required' });

    const sql = 'INSERT INTO tasks (title, description, status, priority) VALUES (?, ?, ?, ?)';
    db.run(sql, [title, description || null, status || 'TODO', priority || 'MEDIUM'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
            res.status(201).json({ success: true, task: row });
        });
    });
});

// UPDATE task
app.put('/api/tasks/:id', (req, res) => {
    const { title, description, status, priority } = req.body;
    const sql = `UPDATE tasks SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`;
    db.run(sql, [title, description, status, priority, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
        db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, row) => {
            res.json({ success: true, task: row });
        });
    });
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
        res.json({ success: true });
    });
});

// PATCH status
app.patch('/api/tasks/:id/status', (req, res) => {
    const { status } = req.body;
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const sql = 'UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(sql, [status, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
        db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, row) => {
            res.json({ success: true, task: row });
        });
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) console.error('❌ Error closing DB:', err.message);
        else console.log('✅ Database closed');
        process.exit(0);
    });
});
