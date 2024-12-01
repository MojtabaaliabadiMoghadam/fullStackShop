const express = require('express');
const router = express.Router();
const db = require('../models/db');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: "Get all categories"
 *     responses:
 *       200:
 *         description: "List of categories"
 */
router.get('/', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: "Create a new category"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Category created"
 */
router.post('/', (req, res) => {
    const { name } = req.body;
    const sql = 'INSERT INTO categories (name) VALUES (?)';
    db.query(sql, [name], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Category created successfully.', categoryId: result.insertId });
    });
});

module.exports = router;
