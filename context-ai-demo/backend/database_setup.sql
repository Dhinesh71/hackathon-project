-- ==========================================
-- CONTEXT AI SYSTEM - DATABASE SCHEMA
-- Revised for: No-Auth / Demo User Mode
-- ==========================================

-- 1. Sessions Table
-- Stores the high-level session info
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL, -- Keep UUID for compatibility, though we use a demo ID
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Short-Term Memory (STM)
-- Stores the raw messages of the current active window
CREATE TABLE IF NOT EXISTS public.stm_messages (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'ai')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Long-Term Memory (LTM)
-- Stores the summarized facts
CREATE TABLE IF NOT EXISTS public.ltm_memories (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    memory_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_stm_session_id ON public.stm_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ltm_session_id ON public.ltm_memories(session_id);
CREATE INDEX IF NOT EXISTS idx_stm_created_at ON public.stm_messages(created_at);

-- Updated_at trigger functionality
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at 
    BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- SECURITY (RLS)
-- ==========================================
-- Since we are in Demo Mode and using the Service Role Key in the backend, 
-- we can either disable RLS or allow all access.
-- Bypassing RLS is the simplest for a hackathon demo.

ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stm_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ltm_memories DISABLE ROW LEVEL SECURITY;

-- Note: If you want to use RLS, ensure you use the Service Role Key in your .env
