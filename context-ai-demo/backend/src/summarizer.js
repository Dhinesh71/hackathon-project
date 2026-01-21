const groq = require('./groqClient');

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

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: "Conversation to summarize:\n" + conversationText
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1024,
        });

        const summary = chatCompletion.choices[0]?.message?.content || "";

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
