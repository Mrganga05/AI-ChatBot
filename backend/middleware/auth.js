// middleware/auth.js - JWT authentication middleware
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || '6b1ca631aa0bac489639a7a78c3b0cf2e909ea29260ca8ecb4b4e4e54b71872aae2db00c6cd4c52b19204316b31235e077cd0b36fa6ace62b9c1f914734024d2';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            error: 'Access denied. No token provided.' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add user info to request object
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expired. Please login again.' 
            });
        }
        return res.status(403).json({ 
            error: 'Invalid token.' 
        });
    }
};

// Generate JWT token
const generateToken = (userId, email, username) => {
    return jwt.sign(
        { 
            userId, 
            email,
            username 
        },
        JWT_SECRET,
        { expiresIn: '7d' } // Token expires in 7 days
    );
};

// Generate refresh token (longer expiry)
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        JWT_SECRET,
        { expiresIn: '30d' }
    );
};

module.exports = {
    authenticateToken,
    generateToken,
    generateRefreshToken
};