const express = require('express');
const cors = require('cors');
const { handleMessage } = require('./src/contextManager');
const { getSession, getAllSessions } = require('./src/memoryStore');
require('dotenv').config();

// Demo user ID (no authentication required)
// Using a real user ID from the database to satisfy foreign key constraints
const DEMO_USER_ID = '1d991fab-a2e6-40b7-9d66-920a22f31cd4';

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

// Get all sessions for sidebar
app.get('/sessions', async (req, res) => {
    try {
        const userId = DEMO_USER_ID;
        const sessions = await getAllSessions(userId);
        res.json(sessions);
    } catch (error) {
        console.error("GET /sessions error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// Get specific session details (STM + LTM)
app.get('/sessions/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    const userId = DEMO_USER_ID;
    try {
        const session = await getSession(sessionId, userId);
        res.json(session);
    } catch (error) {
        console.error(`GET /sessions/${sessionId} error:`, error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

app.post('/chat', async (req, res) => {
    const { message, sessionId } = req.body;
    const userId = DEMO_USER_ID;

    if (!message || !sessionId) {
        return res.status(400).json({ error: "Missing message or sessionId" });
    }

    try {
        const result = await handleMessage(sessionId, message, userId);
        res.json(result);
    } catch (error) {
        console.error("POST /chat error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
