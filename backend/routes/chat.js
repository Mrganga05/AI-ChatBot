// routes/chat.js - Chat routes with Groq API integration
const express = require('express');
const Groq = require('groq-sdk');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// All routes require authentication
router.use(authenticateToken);

// Send message and get AI response
router.post('/message', async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { conversationId, message } = req.body;

        if (!message || !message.trim()) {
            throw new AppError('Message is required', 400);
        }

        let finalConversationId = conversationId;

        // If no conversation ID, create a new conversation
        if (!conversationId) {
            // 1. Create conversation with a temporary title
            const conversationResult = await query(
                'INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING id',
                [userId, message.substring(0, 50) + (message.length > 50 ? '...' : '')]
            );
            finalConversationId = conversationResult.rows[0].id;
        } else {
            // 2. Verify conversation belongs to user
            const conversationCheck = await query(
                'SELECT id FROM conversations WHERE id = $1 AND user_id = $2',
                [conversationId, userId]
            );

            if (conversationCheck.rows.length === 0) {
                throw new AppError('Conversation not found', 404);
            }
        }

        // 3. Save user message
        await query(
            'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)',
            [finalConversationId, 'user', message]
        );

        // 4. Get conversation history (last 10 messages for context)
        const historyResult = await query(
            'SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC LIMIT 10',
            [finalConversationId]
        );

        // 5. Format messages for Groq API
        const messages = historyResult.rows.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        console.log('Calling Groq API...');

        // 6. Call Groq API with the NEW, currently supported model 🚀
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: 'llama-3.1-8b-instant', // 👈 UPDATED TO THE CURRENT MODEL
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false
        });

        const assistantMessage = chatCompletion.choices[0].message.content;

        console.log('Groq response received:', assistantMessage.substring(0, 100) + '...');

        // 7. Save assistant response
        await query(
            'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)',
            [finalConversationId, 'assistant', assistantMessage]
        );

        // 8. Update conversation timestamp and title if first message
        if (!conversationId) { 
            const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
            await query(
                'UPDATE conversations SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [title, finalConversationId]
            );
        } else {
            await query(
                'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
                [finalConversationId]
            );
        }

        res.json({
            conversationId: finalConversationId,
            message: assistantMessage
        });
    } catch (error) {
        console.error('Groq API Error:', error);
        // The Groq SDK returns a specific error object, use instanceof to check for API errors
        if (error instanceof Groq.APIError && error.status === 401) {
            next(new AppError('Invalid Groq API key', 401));
        } else if (error instanceof Groq.APIError && error.status === 429) {
            next(new AppError('Rate limit exceeded. Please try again later.', 429));
        } else {
            next(error);
        }
    }
});

// Stream message response (optional - for real-time streaming)
router.post('/stream', async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { conversationId, message } = req.body;

        if (!message || !message.trim()) {
            throw new AppError('Message is required', 400);
        }

        let finalConversationId = conversationId;

        if (!conversationId) {
            const conversationResult = await query(
                'INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING id',
                [userId, message.substring(0, 50)]
            );
            finalConversationId = conversationResult.rows[0].id;
        }

        // Save user message
        await query(
            'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)',
            [finalConversationId, 'user', message]
        );

        // Get conversation history
        const historyResult = await query(
            'SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC LIMIT 10',
            [finalConversationId]
        );

        const messages = historyResult.rows.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // Set up SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        let fullResponse = '';

        // Send conversation ID first
        res.write(`data: ${JSON.stringify({ conversationId: finalConversationId })}\n\n`);

        // Stream from Groq API
        const stream = await groq.chat.completions.create({
            messages: messages,
            model: 'llama-3.1-8b-instant', // 👈 UPDATED TO THE CURRENT MODEL
            temperature: 0.7,
            max_tokens: 1024,
            stream: true
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                fullResponse += content;
                res.write(`data: ${JSON.stringify({ type: 'content', text: content })}\n\n`);
            }
        }

        // Save assistant response
        await query(
            'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)',
            [finalConversationId, 'assistant', fullResponse]
        );

        // Update conversation
        if (!conversationId) { 
            const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
            await query(
                'UPDATE conversations SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [title, finalConversationId]
            );
        } else {
            await query(
                'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
                [finalConversationId]
            );
        }

        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        res.end();
    } catch (error) {
        console.error('Stream error:', error);
        next(error);
    }
});

module.exports = router;