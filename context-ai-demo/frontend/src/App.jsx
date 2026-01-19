import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import DebugPanel from './components/DebugPanel';
import './App.css'; // We'll clear the default CSS

// Simple ID generator for this session
const SESSION_ID = "demo-" + Math.random().toString(36).substr(2, 9);

function App() {
  const [messages, setMessages] = useState([]);
  const [stmCount, setStmCount] = useState(0);
  const [ltm, setLtm] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (text) => {
    setLoading(true);
    // Add user message to UI immediately
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: SESSION_ID })
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

    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        loading={loading}
      />
      <DebugPanel stmCount={stmCount} ltm={ltm} />
    </div>
  );
}

export default App;
