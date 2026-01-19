# Supabase Integration Setup Guide

## 📋 Overview
This guide will help you connect your Context AI System to Supabase for persistent data storage.

## 🚀 Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `context-ai-system` (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select closest to you
   - **Pricing Plan**: Free tier is fine for development
5. Click **"Create new project"** and wait ~2 minutes for setup

---

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, click the **⚙️ Settings** icon (bottom left)
2. Go to **API** section
3. You'll see:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
4. **Copy both values** - you'll need them in step 4

---

### 3. Create Database Tables

1. In Supabase dashboard, click **🗂️ SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `backend/supabase_schema.sql` in this project
4. **Copy all the SQL code** from that file
5. **Paste it** into the Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see "Success. No rows returned" - this is correct!

**What this creates:**
- `sessions` table - stores conversation sessions
- `stm_messages` table - stores recent messages (Short-Term Memory)
- `ltm_memories` table - stores summarized facts (Long-Term Memory)

---

### 4. Configure Environment Variables

1. Open `backend/.env` file
2. Replace the placeholder values:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example:**
```bash
GEMINI_API_KEY=AIzaSyCQncYymJcjMmsbm-mmD-9tlDD71xbXqAg
PORT=3000

# Supabase Configuration
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY...
```

---

### 5. Install Dependencies & Restart

The Supabase package should already be installing. Once it completes:

```bash
# Navigate to backend directory (if not already there)
cd backend

# Restart the server
npm start
```

---

### 6. Verify the Connection

1. Open your browser to `http://localhost:5173`
2. Send a test message
3. Go back to **Supabase Dashboard** → **🗂️ Table Editor**
4. You should see:
   - A new row in `sessions`
   - New rows in `stm_messages` (one for user, one for AI)

---

## ✅ Testing the System

### Test Short-Term Memory
1. Send 3-4 messages
2. In Supabase → `stm_messages` table, you should see all messages

### Test Summarization & Long-Term Memory
1. Send 10 total messages (5 exchanges)
2. Check the backend console - you should see:
   ```
   [Context] Summarization triggered for session demo-xxxxx (10 messages)
   [Context] 3 memories saved to LTM
   ```
3. In Supabase → `ltm_memories` table, you should see summarized bullet points
4. In Supabase → `stm_messages` table should now be empty (cleared after summarization)

### Test Recall
1. Send a message like "What did we discuss earlier?"
2. The AI should reference the summaries from `ltm_memories`

---

## 🔍 Troubleshooting

### "Missing Supabase credentials" Error
- Make sure you've updated `.env` with real values
- Restart the backend server after updating `.env`

### "relation does not exist" Error
- You haven't run the SQL schema
- Go back to Step 3 and run `supabase_schema.sql`

### Connection Timeout
- Check your Supabase project is active (green indicator in dashboard)
- Verify `SUPABASE_URL` doesn't have trailing slash

---

## 📊 Database Schema Overview

```
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

## 🎯 What Changed

**Before (In-Memory):**
- ❌ Sessions lost on server restart
- ❌ No persistence
- ❌ No cross-device access

**After (Supabase):**
- ✅ Sessions persist forever
- ✅ Survives server restarts
- ✅ Can access same conversation from different devices
- ✅ Can build analytics/reporting
- ✅ Ready for production deployment

---

## 🚀 Next Steps

Once Supabase is connected:
1. Test the full flow (send messages, trigger summarization, test recall)
2. Monitor the database tables in Supabase dashboard
3. Ready to deploy to Vercel!

---

Need help? Check the backend console logs for detailed error messages.
