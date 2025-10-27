// server.js - Main backend server
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

// Database
const { connectDB } = require('./config/database');

// Routes
const authRoutes = require('./routes/auth');
const conversationRoutes = require('./routes/conversations');
const chatRoutes = require('./routes/chat'); // Groq integrated route

// Error handling
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// 🚨 Middleware Setup
// =====================

// 🔐 Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(compression());

// 🚨 Body Parsing Middleware (ESSENTIAL for reading req.body)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// =====================
// 🚦 Rate Limiting
// =====================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply the limit to all API routes
app.use('/api/', apiLimiter); 

// =====================
// 🛣️ Route Mounting
// =====================
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
// 🚀 Mount the chat route with the new Groq model logic
app.use('/api/chat', chatRoutes); 

// =====================
// ❌ Error Handler (MUST be the last middleware before listen)
// =====================
app.use(errorHandler);

// =====================
// 🚀 Server Start
// =====================
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('FATAL: Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();