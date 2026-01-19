const https = require('https');
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log("Status:", res.statusCode);
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("Available Models:");
                json.models.forEach(m => console.log("- " + m.name));
            } else {
                console.log("Error Response:", JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.log("Raw output:", data);
        }
    });
}).on('error', (e) => {
    console.error(e);
});
