const Groq = require("groq-sdk");
require("dotenv").config();

// Initialize Groq client with API key
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

module.exports = groq;
