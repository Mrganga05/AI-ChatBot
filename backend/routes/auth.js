// routes/auth.js
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { generateToken } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const bcrypt = require('bcrypt');

// Register user
router.post('/register', async (req, res, next) => {
    try {
        let { email, username, password } = req.body;
        if (!email || !username || !password) throw new AppError('All fields are required', 400);

        email = email.trim().toLowerCase();
        username = username.trim();

        // Check if email already exists
        const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) throw new AppError('Email already registered', 409);

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await query(
            'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username',
            [email, username, hashedPassword]
        );

        const user = result.rows[0];
        const token = generateToken(user.id, user.email, user.username);

        res.status(201).json({ user, token });
    } catch (err) {
        next(err);
    }
});

// Login user
router.post('/login', async (req, res, next) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) throw new AppError('Email and password are required', 400);

        email = email.trim().toLowerCase();

        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) throw new AppError('Invalid credentials', 401);

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) throw new AppError('Invalid credentials', 401);

        const token = generateToken(user.id, user.email, user.username);

        res.json({ user: { id: user.id, email: user.email, username: user.username }, token });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
