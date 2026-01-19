const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function main() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log("Testing gemini-2.5-flash...");
    try {
        const result = await model.generateContent("Say 'Hello! I am working correctly.' if you can read this.");
        const response = await result.response;
        console.log("✅ SUCCESS!");
        console.log("Response:", response.text());
    } catch (e) {
        console.error("❌ FAILED");
        console.error("Error:", e.message);
    }
}

main();
