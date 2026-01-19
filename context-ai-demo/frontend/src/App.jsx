import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import DebugPanel from './components/DebugPanel';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [stmCount, setStmCount] = useState(0);
  const [ltm, setLtm] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, "") : "http://localhost:3000";

  // 1. Fetch Sessions on Load
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${baseUrl}/sessions`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data);

        // Auto-select most recent if defaults
        if (data.length > 0 && !activeSessionId) {
          loadSession(data[0].id);
        } else if (data.length === 0 && !activeSessionId) {
          createNewSession();
        }
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  };

  const createNewSession = () => {
    const newId = "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
    setActiveSessionId(newId);
    setMessages([]);
    setStmCount(0);
    setLtm([]);
    // Don't add to sessions list yet until first message sent
  };

  const loadSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/sessions/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.stm || []);
        setLtm(data.ltm || []);
        setStmCount(data.stm ? data.stm.length : 0);
      }
    } catch (err) {
      console.error("Failed to load session:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
      setActiveSessionId(currentSessionId);
      // Add this new session to the list optimistically or just wait for refresh
    }

    setLoading(true);
    // Add user message to UI immediately
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: currentSessionId })
      });
      const data = await response.json();

      if (data.error) {
        alert("Error: " + data.error);
        setLoading(false);
        return;
      }

      const aiMsg = { role: 'ai', content: data.response };
      setMessages(prev => [...prev, aiMsg]);

      // Update debug info
      if (data.debug) {
        setStmCount(data.debug.stmCount);
        setLtm(data.debug.ltm);
      }

      // Refresh sessions list to show update/reorder
      fetchSessions();

    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={loadSession}
        onNewChat={createNewSession}
      />

      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        loading={loading}
      />

      {/* Debug Panel removed as per user request */}
      {/* <DebugPanel stmCount={stmCount} ltm={ltm} sessionId={activeSessionId} /> */}
    </div>
  );
}

export default App;
