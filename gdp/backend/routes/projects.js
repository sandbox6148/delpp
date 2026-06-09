const express = require('express');
const router = express.Router();
const getDB = require('../config/db');

// Get all projects
router.get('/', async (req, res) => {
    try {
        const db = await getDB();
        const projects = await db.all('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error retrieving projects' });
    }
});

// Get single project
router.get('/:id', async (req, res) => {
    try {
        const db = await getDB();
        const project = await db.get('SELECT * FROM projects WHERE id = ?', req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error retrieving project' });
    }
});

// Create project
router.post('/', async (req, res) => {
    try {
        const { name, description, start_date, end_date, owner_id } = req.body;
        const db = await getDB();
        const result = await db.run(
            'INSERT INTO projects (name, description, start_date, end_date, owner_id) VALUES (?, ?, ?, ?, ?)',
            [name, description, start_date, end_date, owner_id]
        );
        res.status(201).json({ id: result.lastID, message: 'Project created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error creating project' });
    }
});

// Update project
router.put('/:id', async (req, res) => {
    try {
        const { name, description, start_date, end_date } = req.body;
        const db = await getDB();
        const result = await db.run(
            'UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?',
            [name, description, start_date, end_date, req.params.id]
        );
        if (result.changes === 0) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error updating project' });
    }
});

// Delete project
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDB();
        const result = await db.run('DELETE FROM projects WHERE id = ?', req.params.id);
        if (result.changes === 0) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error deleting project' });
    }
});

module.exports = router;
