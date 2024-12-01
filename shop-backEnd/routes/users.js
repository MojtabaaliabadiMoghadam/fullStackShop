const express = require('express');
const router = express.Router();
const db = require('../models/db');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: "Get all users"
 *     responses:
 *       200:
 *         description: "List of users"
 */
router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: "Create a new user"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: "User created"
 */
router.post('/', (req, res) => {
    const { name, email, password, phone, role } = req.body;
    const sql = 'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, password, phone, role], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User created successfully.', userId: result.insertId });
    });
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: "Delete a user"
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         description: "User ID to delete"
 *     responses:
 *       200:
 *         description: "User deleted"
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User deleted successfully.' });
    });
});

module.exports = router;
