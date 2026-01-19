const supabase = require('./supabaseClient');

// Get or create a session for a specific user
const getSession = async (sessionId, userId) => {
  try {
    // Check if session exists and belongs to user
    const { data: existingSession, error: fetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching session:', fetchError);
      throw fetchError;
    }

    if (existingSession) {
      // Load STM messages
      const { data: stmMessages, error: stmError } = await supabase
        .from('stm_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId) // Security check
        .order('created_at', { ascending: true });

      if (stmError) throw stmError;

      // Load LTM memories
      const { data: ltmMemories, error: ltmError } = await supabase
        .from('ltm_memories')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId) // Security check
        .order('created_at', { ascending: true });

      if (ltmError) throw ltmError;

      return {
        id: existingSession.id,
        messageCount: existingSession.message_count,
        stm: stmMessages.map(m => ({ role: m.role, content: m.content })),
        ltm: ltmMemories.map(m => m.memory_text)
      };
    }

    // Create new session if it doesn't exist
    const { data: newSession, error: createError } = await supabase
      .from('sessions')
      .insert([{ id: sessionId, user_id: userId, message_count: 0 }])
      .select()
      .single();

    if (createError) {
      console.error('Error creating session:', createError);
      throw createError;
    }

    return {
      id: newSession.id,
      messageCount: 0,
      stm: [],
      ltm: []
    };
  } catch (error) {
    console.error('getSession error:', error);
    throw error;
  }
};

// Save a message to STM
const saveToSTM = async (sessionId, userId, role, content) => {
  try {
    const { error } = await supabase
      .from('stm_messages')
      .insert([{ session_id: sessionId, user_id: userId, role, content }]);

    if (error) {
      console.error('Error saving to STM:', error);
      throw error;
    }
  } catch (error) {
    console.error('saveToSTM error:', error);
    throw error;
  }
};

// Save memories to LTM
const saveToLTM = async (sessionId, userId, memories) => {
  try {
    const memoriesToInsert = memories.map(memory => ({
      session_id: sessionId,
      user_id: userId,
      memory_text: memory
    }));

    const { error } = await supabase
      .from('ltm_memories')
      .insert(memoriesToInsert);

    if (error) {
      console.error('Error saving to LTM:', error);
      throw error;
    }
  } catch (error) {
    console.error('saveToLTM error:', error);
    throw error;
  }
};

// Clear STM after summarization
const clearSTM = async (sessionId, userId) => {
  try {
    const { error } = await supabase
      .from('stm_messages')
      .delete()
      .eq('session_id', sessionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing STM:', error);
      throw error;
    }
  } catch (error) {
    console.error('clearSTM error:', error);
    throw error;
  }
};

// Update session message count
const updateMessageCount = async (sessionId, userId, count) => {
  try {
    const { error } = await supabase
      .from('sessions')
      .update({ message_count: count })
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating message count:', error);
      throw error;
    }
  } catch (error) {
    console.error('updateMessageCount error:', error);
    throw error;
  }
};

// Get all sessions for sidebar
const getAllSessions = async (userId) => {
  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`
        *,
        stm_messages (content, created_at),
        ltm_memories (memory_text, created_at)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }

    // Generate titles and clean up result
    return sessions.map(session => {
      let title = "New Chat";

      // Sorting to find the "first" content
      const stm = session.stm_messages?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) || [];
      const ltm = session.ltm_memories?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) || [];

      if (stm.length > 0) {
        title = stm[0].content;
      } else if (ltm.length > 0) {
        title = ltm[0].memory_text;
      }

      // Truncate
      if (title.length > 30) title = title.substring(0, 30) + "...";

      return {
        id: session.id,
        created_at: session.created_at,
        updated_at: session.updated_at,
        message_count: session.message_count,
        title: title
      };
    });
  } catch (error) {
    console.error('getAllSessions error:', error);
    throw error;
  }
};

// Get all LTM memories AND recent STM from other sessions (User Scoped)
const getGlobalContext = async (userId) => {
  try {
    // 1. Fetch all LTM for this user
    const { data: ltm, error: ltmError } = await supabase
      .from('ltm_memories')
      .select('session_id, memory_text')
      .eq('user_id', userId);

    if (ltmError) throw ltmError;

    // 2. Fetch recent STM (last 50 messages from other sessions for this user)
    const { data: stm, error: stmError } = await supabase
      .from('stm_messages')
      .select('session_id, role, content, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (stmError) throw stmError;

    return { ltm, stm };
  } catch (error) {
    console.error('getGlobalContext error:', error);
    throw error;
  }
};

module.exports = {
  getSession,
  saveToSTM,
  saveToLTM,
  clearSTM,
  updateMessageCount,
  getAllSessions,
  getGlobalContext
};
