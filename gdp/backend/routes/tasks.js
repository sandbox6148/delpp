const express = require('express');
const router = express.Router();
const getDB = require('../config/db');

// Get all tasks for a specific project
router.get('/project/:projectId', async (req, res) => {
    try {
        const db = await getDB();
        const tasks = await db.all('SELECT * FROM tasks WHERE project_id = ? ORDER BY start_date ASC', req.params.projectId);

        // Also fetch dependencies for these tasks
        const taskIds = tasks.map(t => t.id);
        let dependencies = [];
        if (taskIds.length > 0) {
            const placeholders = taskIds.map(() => '?').join(',');
            dependencies = await db.all(
                `SELECT * FROM task_dependencies WHERE predecessor_task_id IN (${placeholders}) OR successor_task_id IN (${placeholders})`,
                [...taskIds, ...taskIds]
            );
        }

        res.json({ tasks, dependencies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error retrieving tasks' });
    }
});

// Create task
router.post('/', async (req, res) => {
    try {
        const { project_id, name, description, start_date, end_date, status, assignee_id } = req.body;
        const db = await getDB();
        const result = await db.run(
            'INSERT INTO tasks (project_id, name, description, start_date, end_date, status, assignee_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [project_id, name, description, start_date, end_date, status || 'todo', assignee_id]
        );

        const newTask = await db.get('SELECT * FROM tasks WHERE id = ?', result.lastID);
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error creating task' });
    }
});

// Update task
router.put('/:id', async (req, res) => {
    try {
        const { name, description, start_date, end_date, status, assignee_id } = req.body;
        const db = await getDB();
        const result = await db.run(
            'UPDATE tasks SET name = ?, description = ?, start_date = ?, end_date = ?, status = ?, assignee_id = ? WHERE id = ?',
            [name, description, start_date, end_date, status, assignee_id, req.params.id]
        );
        if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });

        const updatedTask = await db.get('SELECT * FROM tasks WHERE id = ?', req.params.id);
        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error updating task' });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDB();
        const result = await db.run('DELETE FROM tasks WHERE id = ?', req.params.id);
        if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully', id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error deleting task' });
    }
});

// --- DEPENDENCIES ---

// Create dependency
router.post('/dependencies', async (req, res) => {
    try {
        const { predecessor_task_id, successor_task_id, type } = req.body;
        const db = await getDB();
        const result = await db.run(
            'INSERT INTO task_dependencies (predecessor_task_id, successor_task_id, type) VALUES (?, ?, ?)',
            [predecessor_task_id, successor_task_id, type || 'FS']
        );
        res.status(201).json({ id: result.lastID, predecessor_task_id, successor_task_id, type: type || 'FS' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error creating dependency (might already exist)' });
    }
});

// Delete dependency
router.delete('/dependencies/:id', async (req, res) => {
    try {
        const db = await getDB();
        const result = await db.run('DELETE FROM task_dependencies WHERE id = ?', req.params.id);
        if (result.changes === 0) return res.status(404).json({ error: 'Dependency not found' });
        res.json({ message: 'Dependency deleted successfully', id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error deleting dependency' });
    }
});

module.exports = router;
