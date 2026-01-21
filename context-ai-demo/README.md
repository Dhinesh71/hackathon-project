# 🧠 Context AI System

> A Scalable Context Management System for Long-Running AI Interactions with persistent memory architecture.

**Author:** Dhinesh  
**Project Type:** Hackathon Submission  
**AI Model:** Groq (Llama 3.3 70B Versatile)  
**Database:** Supabase (PostgreSQL)  
**Status:** Demo-Ready (Auth Removed for Presentation)

---

## 🎯 Overview

The **Context AI System** is an advanced conversational platform designed to solve the "forgetting problem" in LLMs. It uses a three-layer memory architecture to maintain context across long conversations and even across separate chat sessions, without hitting context window limits.

### The Memory Architecture
- **Short-Term Memory (STM):** Stores the last 10 messages of the current session as raw datastreams.
- **Long-Term Memory (LTM):** When STM reaches capacity, the system automatically summarizes the dialogue into key facts and preferences, storing them permanently.
- **Global Context:** The AI has "cross-session awareness," meaning it can recall facts discussed in other chat threads using a unified user profile.

---

## ✨ Key Features

- 🧠 **Multi-Layer Memory:** STM for immediate context, LTM for persistent knowledge.
- 🔄 **Cross-Session Recall:** Real-time awareness of history across multiple chat sessions.
- ⚡ **Groq Powered:** Blazing fast responses using Llama 3.3 70B via Groq SDK.
- 🧙 **Auto-Summarization:** Background processing that condenses long chats into actionable memories.
- 🎨 **Premium UI:** Dark-mode, glassmorphic interface built with React and Tailwind-inspired custom CSS.
- 🛠️ **Demo Optimized:** Removed login barriers for instant testing while maintaining unique session IDs.

---

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Frontend      │──────│   Backend        │──────│     Groq API     │
│  (React 19)     │ HTTP │  (Express API)   │ SDK  │  (Llama 3.3 70B) │
└─────────────────┘      └──────────────────┘      └──────────────────┘
        │                         │
        │                         │
        └─────────┬───────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │    Supabase     │
         │  ┌───────────┐  │
         │  │ PostgreSQL│  │ (sessions, stm, ltm)
         │  └───────────┘  │
         └─────────────────┘
```

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 (Hooks, Context)
- Lucide React (Icons)
- Vite (Fast Build Tool)
- CSS3 (Glassmorphism, Modern Layouts)

**Backend:**
- Node.js & Express
- Groq SDK (High-performance LLM access)
- Supabase JS (Real-time Database interactions)
- Dotenv (Environment Management)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+
- Groq API Key ([Get one here](https://console.groq.com/keys))
- Supabase Project ([Sign up here](https://supabase.com))

### 2. Setup Database
1. Go to the **Supabase SQL Editor**.
2. Run the contents of `backend/database_setup.sql`. This will create the `sessions`, `stm_messages`, and `ltm_memories` tables.

### 3. Configure Environment
**Backend (`backend/.env`):**
```env
GROQ_API_KEY=your_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:3000
```

### 4. Install & Run
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure

```
context-ai-demo/
├── backend/
│   ├── src/
│   │   ├── contextManager.js   # Core Memory Logic
│   │   ├── groqClient.js       # Groq SDK Configuration
│   │   ├── memoryStore.js      # Supabase Operations
│   │   ├── summarizer.js       # Auto-summarization logic
│   │   └── supabaseClient.js   # DB Connection
│   ├── server.js               # Express API Entry
│   └── database_setup.sql      # SQL Schema
├── frontend/
│   ├── src/
│   │   ├── components/         # Chat & Sidebar UI
│   │   ├── pages/Dashboard.jsx # Main Application
│   │   └── App.jsx             # Root Routing
└── flowchart.md                # System Logic Flow
```

---

## 💡 How It Works
1. **Chat:** User sends a message.
2. **Context Load:** System fetches LTM summaries + recent STM across all sessions.
3. **Reasoning:** Groq generates a response using the compressed context.
4. **Compression:** Every 10 messages, the system triggers a background task to summarize the chat and move it to LTM, clearing the STM window to keep responses fast and relevant.
