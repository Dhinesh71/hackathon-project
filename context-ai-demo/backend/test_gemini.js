const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API_KEY in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct "list models" on the instance in the simple docs fast path, but checking connectivity.
        // Actually, we can assume if this fails immediately it's auth or 404.

        console.log("Testing gemini-1.5-flash...");
        const result = await model.generateContent("Hello");
        console.log("Success! Response:", result.response.text());
    } catch (error) {
        console.error("Error with gemini-1.5-flash:", error.message);

        // Try fallback
        try {
            console.log("Testing gemini-pro...");
            const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result2 = await model2.generateContent("Hello");
            console.log("Success with gemini-pro! Response:", result2.response.text());
        } catch (error2) {
            console.error("Error with gemini-pro:", error2.message);
        }
    }
}

listModels();
