const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require("dotenv").config();

async function main() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelsToTest = ["gemini-pro", "models/gemini-pro", "gemini-1.5-flash", "models/gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro"];

    let log = "Starting test...\n";

    for (const modelName of modelsToTest) {
        log += `Testing ${modelName}...\n`;
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            log += `SUCCESS: ${modelName}\n`;
        } catch (e) {
            log += `FAILED: ${modelName}\n`;
            log += `Error Name: ${e.name}\n`;
            log += `Error Message: ${e.message}\n`;
            if (e.response) log += `Status Text: ${e.response.statusText}\n`;
        }
    }
    fs.writeFileSync('error_log.txt', log);
}

main();
