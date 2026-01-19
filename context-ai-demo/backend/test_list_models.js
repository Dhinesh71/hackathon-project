const https = require('https');
require("dotenv").config();

const key = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // console.log("Status:", res.statusCode);
        const fs = require('fs');
        fs.writeFileSync('models_list.json', JSON.stringify({ status: res.statusCode, body: data }, null, 2));
    });
}).on('error', err => {
    console.error("Error:", err.message);
});
