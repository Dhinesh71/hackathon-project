import { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const { signOut, session } = useAuth();
    const navigate = useNavigate();

    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, "") : "http://localhost:3000";

    // Helper to get headers with Auth
    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
    });

    // 1. Fetch Sessions on Load
    useEffect(() => {
        if (session) {
            fetchSessions();
        }
    }, [session]);

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
        const newId = "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
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
            currentSessionId = "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
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

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
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
                {/* Logout Button (Absolute top-right for simplicity or part of header) */}
                <div className="absolute top-4 right-4 z-50">
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-xs text-white px-3 py-1 rounded shadow"
                    >
                        Logout
                    </button>
                </div>

                <ChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    loading={loading}
                />
            </div>
        </div>
    );
}
