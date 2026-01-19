# 🚀 Quick Start Guide

**Get your Context AI System running in 5 minutes!**

---

## Prerequisites Checklist

Before you start, make sure you have:

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] npm or yarn package manager
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] 15 minutes of time

---

## Step 1: Clone & Install (2 minutes)

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

---

## Step 2: Get API Keys (5 minutes)

### Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **"Create API Key"**
3. Copy the key (starts with `AIzaSy...`)

### Supabase Credentials

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

---

## Step 3: Set Up Database (3 minutes)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy all contents from `backend/supabase_schema.sql`
4. Paste and click **"Run"**
5. You should see "Success. No rows returned" ✅

This creates 3 tables:
- `sessions` - Conversation sessions
- `stm_messages` - Recent messages
- `ltm_memories` - Summarized facts

---

## Step 4: Configure Environment (1 minute)

### Backend Configuration

Create/edit `backend/.env`:

```bash
GEMINI_API_KEY=AIzaSy_your_key_here
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ_your_key_here
```

### Frontend Configuration

Create/edit `frontend/.env`:

```bash
VITE_API_URL=http://localhost:3000
```

---

## Step 5: Start the Servers (1 minute)

### Terminal 1 - Backend

```bash
cd backend
npm start
```

You should see:
```
Server running on port 3000
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
➜  Local:   http://localhost:5173/
```

---

## Step 6: Test It Out!

1. Open **http://localhost:5173** in your browser

2. You should see a futuristic chat interface with:
   - **Left:** Chat area
   - **Right:** Memory debug panel

3. Try these test sequences:

### Test 1: Basic Chat
```
You: Hello!
AI: [Should respond normally]
```

### Test 2: Trigger Summarization
Send 5 messages and watch the debug panel:
```
1. "What is AI?"
2. "Tell me about machine learning"
3. "What are neural networks?"
4. "Explain deep learning"
5. "What's the difference between AI and ML?"
```

After the 10th total message (5 exchanges), you should see:
- STM count reset to 0
- Long-Term Database populated with bullet points
- Backend console: `[Context] Summarization triggered`

### Test 3: Memory Recall
```
You: "What did we discuss earlier about AI?"
AI: [Should reference the LTM summaries]
```

---

## ✅ Success Checklist

If everything works, you should have:

- [ ] Chat interface loads without errors
- [ ] Messages send and receive responses
- [ ] Debug panel shows STM count increasing
- [ ] After 10 messages, LTM gets populated
- [ ] Recall keywords trigger LTM retrieval
- [ ] No errors in browser console
- [ ] No errors in backend console
- [ ] Data visible in Supabase dashboard

---

## 🐛 Troubleshooting

### "Cannot connect to backend"

**Check:**
1. Backend server is running (Terminal 1)
2. `VITE_API_URL` in `frontend/.env` is correct
3. No CORS errors in browser console

**Fix:**
```bash
# Restart backend
cd backend
npm start
```

### "403 Forbidden" from Gemini

**Cause:** API key is invalid or revoked

**Fix:**
1. Get a new key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Update `GEMINI_API_KEY` in `backend/.env`
3. Restart backend

### "Missing Supabase credentials"

**Check:**
1. `backend/.env` has both `SUPABASE_URL` and `SUPABASE_ANON_KEY`
2. No typos in the keys
3. Keys are not wrapped in quotes

**Fix:**
```bash
# backend/.env should look like:
SUPABASE_URL=https://abcdefg.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
```

### Database tables don't exist

**Error:** "relation does not exist"

**Fix:**
1. Go to Supabase → SQL Editor
2. Run the entire `backend/supabase_schema.sql` file
3. Verify tables in Table Editor

### Port 3000 already in use

**Error:** "EADDRINUSE"

**Fix:**
```bash
# Option 1: Kill the process
# Windows
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Option 2: Change the port
# Edit backend/.env
PORT=3001
```

---

## 📚 Next Steps

### Learn More

- Read [`README.md`](./README.md) for full documentation
- See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for technical details
- Check [`API_REFERENCE.md`](./API_REFERENCE.md) for API docs

### Customize

- Modify the UI in `frontend/src/components/ChatInterface.jsx`
- Change colors in `frontend/src/App.css`
- Adjust memory threshold in `backend/src/contextManager.js` (line 60)
- Modify summarization prompt in `backend/src/summarizer.js`

### Deploy

When ready to deploy:
1. Follow the deployment guide in `README.md`
2. Update environment variables for production
3. Test thoroughly before going live

---

## 🎯 Key Files Reference

| File | Purpose | When to Edit |
|------|---------|--------------|
| `backend/.env` | API keys | Setup, key rotation |
| `frontend/.env` | Backend URL | Setup, deployment |
| `backend/src/contextManager.js` | Memory logic | Customize behavior |
| `frontend/src/components/ChatInterface.jsx` | Chat UI | Change design |
| `backend/supabase_schema.sql` | Database tables | Initial setup only |

---

## 💡 Tips

1. **Keep backend running** - Don't close Terminal 1
2. **Hot reload** - Frontend auto-refreshes on code changes
3. **Backend changes** - Restart `npm start` to see changes
4. **Check console logs** - Very helpful for debugging
5. **Use the debug panel** - See memory state in real-time
6. **Test with Supabase** - Verify data is being saved

---

## 🆘 Still Stuck?

1. **Check the full README:** [`README.md`](./README.md)
2. **Read troubleshooting:** See specific error messages
3. **Verify environment:** Compare your `.env` with `.env.example`
4. **Check backend logs:** Look for detailed error messages
5. **Verify Supabase:** Confirm tables exist and are accessible

---

**You're all set! Enjoy building with Context AI System! 🎉**

---

**Last Updated:** January 2026  
**Version:** 1.0  
**Author:** Dhinesh
