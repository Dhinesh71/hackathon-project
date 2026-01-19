const model = require('./geminiClient');

const SYSTEM_PROMPT = `Summarize the following conversation.
Extract ONLY:
- important facts
- decisions
- user preferences

Ignore greetings, small talk, and repetition.
Return bullet points only.`;

const summarizeBatch = async (messages) => {
    try {
        const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');

        const prompt = SYSTEM_PROMPT + "\n\nConversation to summarize:\n" + conversationText;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        // Parse into array of strings (bullet points)
        const bullets = summary.split('\n')
            .map(line => line.replace(/^[-*•]\s*/, '').trim())
            .filter(line => line.length > 0 && !line.toLowerCase().startsWith('here is') && !line.toLowerCase().startsWith('sure') && !line.toLowerCase().startsWith('summary'));

        return bullets;
    } catch (error) {
        console.error("Summarization failed:", error);
        return [];
    }
};

module.exports = { summarizeBatch };
