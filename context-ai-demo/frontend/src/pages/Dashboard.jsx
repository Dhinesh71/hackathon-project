import { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, "") : "http://localhost:3000";

    // Helper to get headers
    const getHeaders = () => ({
        'Content-Type': 'application/json'
    });

    // 1. Fetch Sessions on Load
    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await fetch(`${baseUrl}/sessions`, {
                headers: getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setSessions(data);

                // Auto-select most recent if defaults
                if (data.length > 0 && !activeSessionId) {
                    loadSession(data[0].id);
                } else if (data.length === 0 && !activeSessionId) {
                    createNewSession();
                }
            } else {
                console.error("Failed to fetch sessions", response.statusText);
            }
        } catch (err) {
            console.error("Failed to fetch sessions:", err);
        }
    };

    const createNewSession = () => {
        const newId = crypto.randomUUID();
        setActiveSessionId(newId);
        setMessages([]);
        // Don't add to sessions list yet until first message sent
    };

    const loadSession = async (sessionId) => {
        setActiveSessionId(sessionId);
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/sessions/${sessionId}`, {
                headers: getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data.stm || []);
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
            currentSessionId = crypto.randomUUID();
            setActiveSessionId(currentSessionId);
        }

        setLoading(true);
        // Add user message to UI immediately
        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);

        try {
            const response = await fetch(`${baseUrl}/chat`, {
                method: 'POST',
                headers: getHeaders(),
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
        <div className="flex w-full h-screen font-sans bg-gray-900 text-white overflow-hidden">
            <Sidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelectSession={loadSession}
                onNewChat={createNewSession}
            />

            <div className="flex-1 flex flex-col relative w-full h-full">
                <ChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    loading={loading}
                />
            </div>
        </div>
    );
}
