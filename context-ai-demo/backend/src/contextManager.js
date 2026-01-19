const { getSession, saveToSTM, saveToLTM, clearSTM, updateMessageCount } = require('./memoryStore');
const { summarizeBatch } = require('./summarizer');
const model = require('./geminiClient');

// Recall triggers
const RECALL_KEYWORDS = ["earlier", "before", "last time", "you said", "remember", "what did we discuss"];

const shouldTriggerRecall = (message) => {
    const lower = message.toLowerCase();
    return RECALL_KEYWORDS.some(keyword => lower.includes(keyword));
};

const handleMessage = async (sessionId, userMessage) => {
    try {
        // 1. Load session from Supabase
        const session = await getSession(sessionId);

        // 2. Save user message to STM in Supabase
        await saveToSTM(sessionId, 'user', userMessage);

        // Add to local session for current request
        session.stm.push({ role: "user", content: userMessage });
        session.messageCount++;
        await updateMessageCount(sessionId, session.messageCount);

        const isRecallNeeded = shouldTriggerRecall(userMessage);
        let ltmContext = [];

        // 3. Determine Context for Prompt
        if (isRecallNeeded) {
            ltmContext = session.ltm;
            console.log(`[Context] Recall triggered for session ${sessionId}`);
        }

        // 4. Build Prompt
        const finalPromptContent = `You are an intelligent AI assistant with memory management capabilities.

${ltmContext.length > 0 ? `PREVIOUS CONVERSATION SUMMARY:\n${ltmContext.map(b => `• ${b}`).join('\n')}\n\n` : ''}${session.stm.length > 0 ? `RECENT MESSAGES:\n${session.stm.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}\n\n` : ''}CURRENT QUESTION:
${userMessage}

INSTRUCTIONS:
- If the question relates to our conversation history, use the context above
- For general knowledge questions, provide helpful, accurate information
- Be concise, friendly, and direct`;

        // 5. Call Gemini for Answer
        let aiResponseText = "";
        try {
            const result = await model.generateContent(finalPromptContent);
            const response = await result.response;
            // Fix: logic to avoid candidates error if safety blocks it
            if (response.candidates && response.candidates.length > 0 && response.candidates[0].finishReason !== "STOP") {
                console.warn("Gemini finish reason:", response.candidates[0].finishReason);
            }
            aiResponseText = response.text();
        } catch (e) {
            console.error("Gemini Error", e);
            aiResponseText = "Sorry, I encountered an error processing your request.";
        }

        // 6. Save AI response to STM in Supabase
        await saveToSTM(sessionId, 'ai', aiResponseText);

        // Add to local session for current request
        session.stm.push({ role: "ai", content: aiResponseText });
        session.messageCount++;
        await updateMessageCount(sessionId, session.messageCount);

        // 7. Check Summarization Trigger (every 10 messages = 5 user + 5 AI)
        if (session.stm.length >= 10) {
            console.log(`[Context] Summarization triggered for session ${sessionId} (${session.stm.length} messages)`);
            const newBullets = await summarizeBatch(session.stm);
            if (newBullets.length > 0) {
                // Save to Supabase LTM
                await saveToLTM(sessionId, newBullets);

                // Update local session
                session.ltm = [...session.ltm, ...newBullets];

                // Clear STM in Supabase and locally
                await clearSTM(sessionId);
                session.stm = [];

                console.log(`[Context] ${newBullets.length} memories saved to LTM`);
            }
        }

        return {
            response: aiResponseText,
            debug: {
                stmCount: session.stm.length,
                ltm: session.ltm,
                stmContent: session.stm
            }
        };
    } catch (error) {
        console.error('handleMessage error:', error);
        throw error;
    }
};

module.exports = { handleMessage };
