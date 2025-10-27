// routes/conversations.js
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all conversations for a user
router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const result = await query('SELECT * FROM conversations WHERE user_id = $1', [userId]);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

// Create a new conversation
router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { title } = req.body;
        const result = await query(
            'INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING *',
            [userId, title || 'New Conversation']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
