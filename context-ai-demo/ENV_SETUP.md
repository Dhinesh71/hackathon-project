# Environment Variables Configuration

## Frontend (.env)

Located at: `frontend/.env`

```bash
# Backend API URL
VITE_API_URL=http://localhost:3000
```

**Note:** In Vite, environment variables must be prefixed with `VITE_` to be exposed to the client.

### For Production Deployment:
When deploying to production (e.g., Vercel), update the `VITE_API_URL` to your deployed backend URL:

```bash
VITE_API_URL=https://your-backend-api.vercel.app
```

---

## Backend (.env)

Located at: `backend/.env`

```bash
# Gemini API Key (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port
PORT=3000

# Supabase Configuration (Required for database)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### How to Get These Values:

1. **GEMINI_API_KEY**: 
   - Go to [Google AI Studio](https://aistudio.google.com/apikey)
   - Create or copy your API key

2. **SUPABASE_URL & SUPABASE_ANON_KEY**:
   - Follow the setup guide in `SUPABASE_SETUP.md`
   - Or go to your Supabase project → Settings → API

---

## Important Notes:

- ⚠️ **Never commit `.env` files to Git!** (They're already in `.gitignore`)
- ✅ Use `.env.example` files as templates for teammates
- 🔄 After changing `.env` files, **restart the dev servers**:
  ```bash
  # Frontend
  npm run dev

  # Backend
  npm start
  ```

---

## Verifying Environment Variables:

### Frontend (Vite):
```javascript
console.log(import.meta.env.VITE_API_URL); // Should print the API URL
```

### Backend (Node.js):
```javascript
console.log(process.env.GEMINI_API_KEY); // Should print your API key
```
