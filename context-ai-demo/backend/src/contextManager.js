const { getSession, saveToSTM, saveToLTM, clearSTM, updateMessageCount, getGlobalContext } = require('./memoryStore');
const { summarizeBatch } = require('./summarizer');
const groq = require('./groqClient');

// Recall triggers
const RECALL_KEYWORDS = ["earlier", "before", "last time", "you said", "remember", "what did we discuss"];

const shouldTriggerRecall = (message) => {
    const lower = message.toLowerCase();
    return RECALL_KEYWORDS.some(keyword => lower.includes(keyword));
};

const handleMessage = async (sessionId, userMessage, userId) => {
    try {
        // 1. Load session from Supabase
        const session = await getSession(sessionId, userId);

        // 2. Save user message to STM in Supabase
        await saveToSTM(sessionId, userId, 'user', userMessage);

        // Add to local session for current request
        session.stm.push({ role: "user", content: userMessage });
        session.messageCount++;
        await updateMessageCount(sessionId, userId, session.messageCount);

        const isRecallNeeded = shouldTriggerRecall(userMessage);

        // 3. Determine Context for Prompt
        // Fetch global context (LTM + recent STM from other sessions)
        const globalContext = await getGlobalContext(userId);

        // Filter LTM for other sessions
        const backgroundLTM = globalContext.ltm
            .filter(m => m.session_id !== sessionId)
            .map(m => m.memory_text);

        // Filter recent STM for other sessions
        const backgroundSTM = globalContext.stm
            .filter(m => m.session_id !== sessionId)
            .map(m => `[${new Date(m.created_at).toLocaleString()}] ${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`);

        // This session's LTM is already in session.ltm (array of strings)
        const currentSessionLTM = session.ltm;

        if (isRecallNeeded) {
            console.log(`[Context] Recall triggered for session ${sessionId}`);
        }

        // 4. Build Prompt
        const finalPromptContent = `You are an intelligent AI assistant with memory management capabilities.

BACKGROUND KNOWLEDGE (Summarized LTM from Past Sessions):
${backgroundLTM.length > 0 ? backgroundLTM.map(b => `• ${b}`).join('\n') : '(No prior summarized knowledge)'}

RECENT ACTIVITY (Raw Messages from Other Sessions):
${backgroundSTM.length > 0 ? backgroundSTM.slice(0, 15).join('\n') : '(No recent activity in other sessions)'}

CURRENT SESSION CONTEXT (Long-Term Memory):
${currentSessionLTM.length > 0 ? currentSessionLTM.map(b => `• ${b}`).join('\n') : '(No long-term memories for this session yet)'}

RECENT MESSAGES (Short-Term Memory):
${session.stm.length > 0 ? session.stm.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n') : '(No recent messages)'}

CURRENT QUESTION:
${userMessage}

INSTRUCTIONS:
- You have access to "BACKGROUND KNOWLEDGE" (summarized facts) and "RECENT ACTIVITY" (raw messages) from other sessions.
- Use these to understand the user's history, identity, and recent work, even if it wasn't in the current session.
- If the user asks "What was I doing?" or "What is my name?", check RECENT ACTIVITY and BACKGROUND KNOWLEDGE.
- Use "CURRENT SESSION CONTEXT" and "RECENT MESSAGES" to maintain continuity in the current conversation.
- Be concise, friendly, and direct.`;

        // 5. Call Groq for Answer
        let aiResponseText = "";
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an intelligent AI assistant with memory management capabilities."
                    },
                    {
                        role: "user",
                        content: finalPromptContent
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                max_tokens: 2048,
            });

            aiResponseText = chatCompletion.choices[0]?.message?.content || "No response generated.";
        } catch (e) {
            console.error("Groq Error:", e);
            if (e.message && e.message.includes("429")) {
                aiResponseText = "Used up AI quota. Please wait a minute and try again.";
            } else if (e.message && e.message.includes("403")) {
                aiResponseText = "API Key Error. Please check backend logs.";
            } else {
                aiResponseText = `Groq Error: ${e.message || "Unknown error"}`;
            }
        }

        // 6. Save AI response to STM in Supabase
        await saveToSTM(sessionId, userId, 'ai', aiResponseText);

        // Add to local session for current request
        session.stm.push({ role: "ai", content: aiResponseText });
        session.messageCount++;
        await updateMessageCount(sessionId, userId, session.messageCount);

        // 7. Check Summarization Trigger (every 10 messages = 5 user + 5 AI)
        if (session.stm.length >= 10) {
            console.log(`[Context] Summarization triggered for session ${sessionId} (${session.stm.length} messages)`);
            const newBullets = await summarizeBatch(session.stm);
            if (newBullets.length > 0) {
                // Save to Supabase LTM
                await saveToLTM(sessionId, userId, newBullets);

                // Update local session
                session.ltm = [...session.ltm, ...newBullets];

                // Clear STM in Supabase and locally
                await clearSTM(sessionId, userId);
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
