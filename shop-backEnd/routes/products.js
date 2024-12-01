const express = require('express');
const router = express.Router();
const db = require('../models/db');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: "Get all products"
 *     responses:
 *       200:
 *         description: "List of products"
 */
router.get('/', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: "Create a new product"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: "Product created"
 */
router.post('/', (req, res) => {
    const { name, description, price, stock, category_id } = req.body;
    const sql = 'INSERT INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, description, price, stock, category_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product created successfully.', productId: result.insertId });
    });
});

module.exports = router;
