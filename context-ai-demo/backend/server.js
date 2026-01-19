const express = require('express');
const cors = require('cors');
const { handleMessage } = require('./src/contextManager');
const { getSession, getAllSessions } = require('./src/memoryStore');
const authMiddleware = require('./src/middleware/authMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Public health check
app.get('/', (req, res) => res.send('Context AI Backend Online'));

// --- PROTECTED ROUTES ---
app.use(authMiddleware);

// Get User Profile/Info logic (Simple echo for now)
app.get('/me', (req, res) => {
    res.json({ user: req.user });
});

// Get all sessions for sidebar
app.get('/sessions', async (req, res) => {
    try {
        const userId = req.user.id;
        const sessions = await getAllSessions(userId);
        res.json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get specific session details (STM + LTM)
app.get('/sessions/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    const userId = req.user.id;
    try {
        const session = await getSession(sessionId, userId);
        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/chat', async (req, res) => {
    const { message, sessionId } = req.body;
    const userId = req.user.id;

    if (!message || !sessionId) {
        return res.status(400).json({ error: "Missing message or sessionId" });
    }

    try {
        const result = await handleMessage(sessionId, message, userId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
