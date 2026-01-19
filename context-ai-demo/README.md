# 🧠 Context AI System

> A Scalable Context Management System for Long-Running AI Interactions

**Live Demo:** [Coming Soon]  
**Author:** Dhinesh  
**Project Type:** Hackathon Submission  
**GitHub:** [hackathon-project](https://github.com/Dhinesh71/hackathon-project)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start Guide](#quick-start-guide)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

The **Context AI System** is an intelligent conversational AI with sophisticated memory management capabilities. Unlike traditional chatbots, this system intelligently manages conversation data through a three-layer memory architecture, deciding what to keep, summarize, discard, and send to the AI model.

### The Problem It Solves

Traditional AI chatbots face challenges with long conversations:
- **Context window limitations** - Limited by token counts
- **Memory loss** - Forgetting earlier parts of conversations
- **Performance degradation** - Slower responses with longer context
- **Cost inefficiency** - Processing redundant information

### Our Solution

A smart memory management system that:
- ✅ Stores recent messages in **Short-Term Memory** (STM)
- ✅ Summarizes conversations into **Long-Term Memory** (LTM)
- ✅ Retrieves relevant context only when needed
- ✅ Persists all data in **Supabase** for reliability

---

## ✨ Features

### Core Functionality

- **🗣️ Natural Conversations** - Chat with an AI that remembers context
- **🧠 Smart Memory Management** - Automatic summarization every 10 messages
- **💾 Persistent Storage** - All conversations saved to Supabase database
- **🔍 Intelligent Recall** - Keyword-triggered long-term memory retrieval
- **🎨 Premium UI** - Cyberpunk-themed glassmorphism interface
- **📊 Live Debugging** - Real-time memory state visualization

### Memory System

| Memory Type | Capacity | Purpose | Persistence |
|-------------|----------|---------|-------------|
| **Short-Term (STM)** | 10 messages | Recent context | Database |
| **Long-Term (LTM)** | Unlimited | Summarized facts | Database |
| **Recall Trigger** | Keyword-based | Contextual retrieval | On-demand |

---

## 🏗️ Architecture

### System Overview

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend  │ ───> │   Backend    │ ───> │   Gemini AI  │
│   (React)   │ <─── │  (Express)   │ <─── │   2.5 Flash  │
└─────────────┘      └──────────────┘      └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Supabase   │
                     │   Database   │
                     └──────────────┘
```

### Memory Flow

```
User Message → Save to STM (DB) → Build AI Prompt → Get AI Response 
→ Save AI Reply to STM (DB) → Check if STM >= 10 messages
→ YES: Summarize → Save to LTM → Clear STM
→ NO: Return Response
```

### Database Schema

```sql
sessions
├── id (TEXT, PRIMARY KEY)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── message_count (INTEGER)

stm_messages
├── id (BIGSERIAL, PRIMARY KEY)
├── session_id (TEXT, FK → sessions.id)
├── role (TEXT: 'user' | 'ai')
├── content (TEXT)
└── created_at (TIMESTAMP)

ltm_memories
├── id (BIGSERIAL, PRIMARY KEY)
├── session_id (TEXT, FK → sessions.id)
├── memory_text (TEXT)
└── created_at (TIMESTAMP)
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **Vanilla CSS** - Custom styling (glassmorphism)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Gemini AI** - 2.5 Flash model for chat & summarization
- **Supabase** - PostgreSQL database (sessions, STM, LTM)

### DevOps
- **Git** - Version control
- **GitHub** - Code repository
- **Vercel** - Deployment platform (coming soon)

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js 18+ installed ([Download](https://nodejs.org/))
- npm package manager
- Gemini API Key ([Get one](https://aistudio.google.com/apikey))
- Supabase Account ([Sign up](https://supabase.com))

### Installation (5 minutes)

**1. Clone & Install Dependencies**

```bash
# Clone the repository
git clone https://github.com/Dhinesh71/hackathon-project.git
cd context-ai-demo

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

**2. Get API Keys**

- **Gemini:** Go to [Google AI Studio](https://aistudio.google.com/apikey) → Create API Key
- **Supabase:** Create project at [Supabase](https://supabase.com) → Settings → API → Copy URL & anon key

**3. Configure Environment Variables**

Create `backend/.env`:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:3000
```

**4. Set Up Database**

1. Open Supabase dashboard → SQL Editor
2. Copy contents from `backend/supabase_schema.sql`
3. Paste and click "Run"

**5. Start Servers**

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

**6. Open Browser**

Navigate to `http://localhost:5173`

---

## ⚙️ Environment Setup

### Backend Environment Variables

Located at: `backend/.env`

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key | `AIzaSy...` |
| `PORT` | No | Server port (default: 3000) | `3000` |
| `SUPABASE_URL` | Yes | Supabase project URL | `https://xyz.supabase.co` |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous key | `eyJ...` |

### Frontend Environment Variables

Located at: `frontend/.env`

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API URL | `http://localhost:3000` |

**Note:** In Vite, environment variables must be prefixed with `VITE_`.

### Security Best Practices

- ✅ Never commit `.env` files to Git (already in `.gitignore`)
- ✅ Use different keys for development and production
- ✅ Rotate API keys regularly
- ✅ Don't share keys in screenshots or chat

---

## 🗄️ Database Setup

### Supabase Configuration

**Step 1: Create Project**

1. Go to [Supabase](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Choose name, password, region
5. Wait ~2 minutes for project creation

**Step 2: Get Credentials**

1. Go to Settings → API
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

**Step 3: Create Tables**

1. Open SQL Editor in Supabase dashboard
2. Click "New query"
3. Paste the following SQL:

```sql
-- Sessions Table
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    message_count INTEGER DEFAULT 0
);

-- Short-Term Memory (STM) - Recent Messages
CREATE TABLE stm_messages (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'ai')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Long-Term Memory (LTM) - Summarized Facts
CREATE TABLE ltm_memories (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    memory_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for better performance
CREATE INDEX idx_stm_session_id ON stm_messages(session_id);
CREATE INDEX idx_ltm_session_id ON ltm_memories(session_id);
CREATE INDEX idx_stm_created_at ON stm_messages(created_at);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to sessions table
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Click "Run" (should see "Success. No rows returned")

**Step 4: Update .env**

Add your credentials to `backend/.env`:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...your_key_here
```

**Step 5: Test Connection**

```bash
cd backend
node test_supabase.js
```

You should see: ✅ "Successfully connected to Supabase!"

---

## 💡 How It Works

### 1. Send Messages

Type your questions or statements in the chat interface. Each message is saved to the database.

### 2. Short-Term Memory (STM)

The most recent 10 messages (5 exchanges) are kept in STM for immediate context.

### 3. Automatic Summarization

When STM reaches 10 messages:
- The conversation is sent to Gemini AI for summarization
- Key facts, decisions, and preferences are extracted
- Summaries are saved to Long-Term Memory (LTM)
- STM is cleared for new messages

### 4. Intelligent Recall

When you use keywords like "remember", "earlier", "what did we discuss", the system automatically includes LTM summaries in the AI's context.

**Recall Keywords:**
- "earlier"
- "before"
- "last time"
- "you said"
- "remember"
- "what did we discuss"

### 5. Persistent Sessions

All data is stored in Supabase, so:
- ✅ Conversations survive server restarts
- ✅ Access the same session from different devices
- ✅ Historical data for analytics

---

## 📡 API Reference

### Base URL

```
Development: http://localhost:3000
Production: https://your-backend.vercel.app
```

### Endpoints

#### Health Check

**GET /** - Check if backend is running

**Response:**
```
Context AI Backend Online
```

---

#### Send Message

**POST /chat** - Send message and receive AI response

**Request:**
```json
{
  "message": "What is artificial intelligence?",
  "sessionId": "demo-abc123"
}
```

**Response:**
```json
{
  "response": "Artificial intelligence (AI) is...",
  "debug": {
    "stmCount": 2,
    "ltm": [
      "User is interested in AI concepts"
    ],
    "stmContent": [
      { "role": "user", "content": "What is AI?" },
      { "role": "ai", "content": "AI is..." }
    ]
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Missing required fields
- `500 Internal Server Error` - Server/AI error

**Example (JavaScript):**
```javascript
const response = await fetch('http://localhost:3000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello!',
    sessionId: 'session-123'
  })
});

const data = await response.json();
console.log(data.response); // AI's reply
```

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!","sessionId":"test-123"}'
```

---

## 📂 Project Structure

```
context-ai-demo/
├── backend/
│   ├── src/
│   │   ├── contextManager.js    # Core memory logic
│   │   ├── geminiClient.js      # AI model client
│   │   ├── memoryStore.js       # Supabase operations
│   │   ├── summarizer.js        # Conversation summarization
│   │   └── supabaseClient.js    # Database connection
│   ├── server.js                # Express server
│   ├── supabase_schema.sql      # Database schema
│   ├── package.json             # Dependencies
│   └── .env                     # Environment variables (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx    # Main chat UI
│   │   │   └── DebugPanel.jsx       # Memory visualization
│   │   ├── App.jsx              # Root component
│   │   ├── App.css              # Design system
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # Entry point
│   ├── package.json             # Dependencies
│   └── .env                     # Environment variables (not committed)
│
├── .gitignore                   # Git exclusions
├── README.md                    # This file
└── SUPABASE_SETUP.md            # Database setup guide
```

---

## 🌐 Deployment

The easiest way to deploy this project is using **Vercel**. Since it's a monorepo (frontend + backend), you should deploy them as **two separate projects**.

### 1. Deploy the Backend (Node.js)

1.  **Login to Vercel** and click **"Add New"** → **"Project"**.
2.  **Import your GitHub repository**.
3.  In the configuration:
    *   **Project Name**: `context-ai-backend`
    *   **Root Directory**: Select **`backend`**.
    *   **Framework Preset**: Select **Other**.
    *   **Build & Development Settings**: Keep defaults (Vercel will see `npm start`).
4.  **Environment Variables**: Add the following:
    *   `GEMINI_API_KEY`: Your Google Gemini key.
    *   `SUPABASE_URL`: Your Supabase URL.
    *   `SUPABASE_ANON_KEY`: Your Supabase key.
5.  Click **Deploy**.
6.  **Copy the assigned URL** (e.g., `https://context-ai-backend.vercel.app`).

### 2. Deploy the Frontend (React/Vite)

1.  **Add New Project** again in Vercel.
2.  **Import the same GitHub repository**.
3.  In the configuration:
    *   **Project Name**: `context-ai-frontend`
    *   **Root Directory**: Select **`frontend`**.
    *   **Framework Preset**: **Vite**.
4.  **Environment Variables**: Add the following:
    *   `VITE_API_URL`: Paste the **Backend URL** you copied in the previous step.
5.  Click **Deploy**.

### 3. Final Step: Handshake (CORS)

If you encounter CORS errors (red text in browser console), update `backend/server.js` to specifically allow your frontend domain, or keep it as `app.use(cors())` for wide access.

---

## 🐛 Troubleshooting

### "Cannot connect to backend"

**Symptoms:** Frontend can't reach API

**Solutions:**
1. Verify backend is running: `cd backend && npm start`
2. Check `VITE_API_URL` in `frontend/.env`
3. Look for CORS errors in browser console
4. Confirm port 3000 is not blocked by firewall

---

### "403 Forbidden" from Gemini

**Symptoms:** AI responses fail with 403 error

**Cause:** API key is invalid, expired, or revoked (possibly leaked)

**Solutions:**
1. Get new API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Delete old key if it exists
3. Update `GEMINI_API_KEY` in `backend/.env`
4. Restart backend server

---

### "Missing Supabase credentials"

**Symptoms:** Backend won't start, credential error

**Solutions:**
1. Verify `backend/.env` has both `SUPABASE_URL` and `SUPABASE_ANON_KEY`
2. Check for typos in the keys
3. Ensure keys are not wrapped in quotes
4. Restart backend after updating

---

### "relation does not exist" Database Error

**Symptoms:** Database queries fail with "relation not found"

**Cause:** Database tables haven't been created

**Solutions:**
1. Go to Supabase dashboard → SQL Editor
2. Run the entire `backend/supabase_schema.sql` file
3. Verify tables exist in Table Editor
4. Check `sessions`, `stm_messages`, `ltm_memories` tables are present

---

### Port 3000 Already in Use

**Symptoms:** "EADDRINUSE" error when starting backend

**Solutions:**

**Windows:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <process_id> /F
```

**Alternative:** Change port in `backend/.env`:
```bash
PORT=3001
```

---

### Frontend Not Updating

**Symptoms:** Code changes don't appear in browser

**Solutions:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Restart Vite dev server
4. Check for console errors

---

### Summarization Not Triggering

**Symptoms:** LTM stays empty after 10+ messages

**Solutions:**
1. Check backend console for `[Context] Summarization triggered` log
2. Verify STM count in debug panel
3. Ensure at least 10 total messages (5 exchanges)
4. Check Gemini API is responding (not rate-limited)

---

## 🧪 Testing

### Test Sequence 1: Basic Chat

```
1. Send: "Hello!"
   Expected: AI responds normally
   STM Count: 2 (1 user + 1 AI)

2. Send: "What is AI?"
   Expected: AI explains AI
   STM Count: 4
```

### Test Sequence 2: Trigger Summarization

```
Send 5 messages:
1. "What is artificial intelligence?"
2. "Tell me about machine learning"
3. "What are neural networks?"
4. "Explain deep learning"
5. "What's the difference between AI and ML?"

Expected Results:
- After message 5 (10 total messages):
  - Backend console: "[Context] Summarization triggered"
  - LTM panel: Shows bullet points
  - STM Count: Resets to 0
```

### Test Sequence 3: Memory Recall

```
After summarization:
Send: "What did we discuss earlier about AI?"

Expected: AI references LTM summaries in response
```

---

## 🎨 UI Features

### Cyberpunk Aesthetic
- Dark theme with neon accents (cyan/purple/green)
- Glassmorphism effects with backdrop blur
- Smooth animations for messages and UI
- Gradient text for headers
- Neon glow on buttons

### Debug Panel
- Real-time STM count with progress bar
- LTM bullet list display
- Architecture statistics
- Visual memory state indicators

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For the powerful language model
- **Supabase** - For the excellent database platform
- **Vercel** - For seamless deployment
- **React Team** - For the amazing frontend library

---

## 📧 Contact

**Dhinesh**  
GitHub: [@Dhinesh71](https://github.com/Dhinesh71)  
Project Link: [https://github.com/Dhinesh71/hackathon-project](https://github.com/Dhinesh71/hackathon-project)

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ for the Hackathon

</div>
