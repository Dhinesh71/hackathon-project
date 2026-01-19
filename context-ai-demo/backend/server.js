const express = require('express');
const cors = require('cors');
const { handleMessage } = require('./src/contextManager');
const { getSession, getAllSessions } = require('./src/memoryStore');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Get all sessions for sidebar
app.get('/sessions', async (req, res) => {
    try {
        const sessions = await getAllSessions();
        res.json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get specific session details (STM + LTM)
app.get('/sessions/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    try {
        const session = await getSession(sessionId);
        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/chat', async (req, res) => {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
        return res.status(400).json({ error: "Missing message or sessionId" });
    }

    try {
        const result = await handleMessage(sessionId, message);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Simple health check
app.get('/', (req, res) => res.send('Context AI Backend Online'));

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
