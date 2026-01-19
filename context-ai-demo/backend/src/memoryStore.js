// Simple in-memory storage
// Format:
// sessionId -> {
//   stm: [ { role, content } ],  // Short term memory (last 5 interactions)
//   ltm: [ "fact 1", "preference 2" ], // Long term memory (summarized)
//   messageCount: 0 // Total messages processed logic
// }

const sessions = new Map();

const getSession = (sessionId) => {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      stm: [],
      ltm: [],
      messageCount: 0
    });
  }
  return sessions.get(sessionId);
};

module.exports = { getSession };
