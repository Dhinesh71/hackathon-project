const supabase = require('./supabaseClient');

// Get or create a session
const getSession = async (sessionId) => {
  try {
    // Check if session exists
    const { data: existingSession, error: fetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Error fetching session:', fetchError);
      throw fetchError;
    }

    if (existingSession) {
      // Load STM messages
      const { data: stmMessages, error: stmError } = await supabase
        .from('stm_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (stmError) {
        console.error('Error fetching STM:', stmError);
        throw stmError;
      }

      // Load LTM memories
      const { data: ltmMemories, error: ltmError } = await supabase
        .from('ltm_memories')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (ltmError) {
        console.error('Error fetching LTM:', ltmError);
        throw ltmError;
      }

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
      .insert([{ id: sessionId, message_count: 0 }])
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
const saveToSTM = async (sessionId, role, content) => {
  try {
    const { error } = await supabase
      .from('stm_messages')
      .insert([{ session_id: sessionId, role, content }]);

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
const saveToLTM = async (sessionId, memories) => {
  try {
    const memoriesToInsert = memories.map(memory => ({
      session_id: sessionId,
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
const clearSTM = async (sessionId) => {
  try {
    const { error } = await supabase
      .from('stm_messages')
      .delete()
      .eq('session_id', sessionId);

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
const updateMessageCount = async (sessionId, count) => {
  try {
    const { error } = await supabase
      .from('sessions')
      .update({ message_count: count })
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating message count:', error);
      throw error;
    }
  } catch (error) {
    console.error('updateMessageCount error:', error);
    throw error;
  }
};

module.exports = {
  getSession,
  saveToSTM,
  saveToLTM,
  clearSTM,
  updateMessageCount
};
