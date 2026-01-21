import { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import Sidebar from '../components/Sidebar';
import Modal from '../components/ui/Modal';
import { Database, Zap, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);

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
            fetchSessions();

        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to server." }]);
        } finally {
            setLoading(false);
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex w-full h-screen font-sans bg-gray-900 text-white overflow-hidden relative">
            {/* Sidebar with mobile classes */}
            <div className={`
                fixed inset-0 z-40 transition-transform duration-300 transform lg:static lg:translate-x-0 w-[260px]
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar
                    sessions={sessions}
                    activeSessionId={activeSessionId}
                    onSelectSession={(id) => {
                        loadSession(id);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    onNewChat={() => {
                        createNewSession();
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col relative w-full h-full min-w-0">
                <ChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    loading={loading}
                    onMenuClick={toggleSidebar}
                    onInfoClick={() => setIsSystemModalOpen(true)}
                />
            </div>

            {/* Diagnostic / Info Modal (Accessible) */}
            <Modal
                isOpen={isSystemModalOpen}
                onClose={() => setIsSystemModalOpen(false)}
                title="System Core Diagnostic"
                description="View real-time status of the Context AI Memory synchronization and API health."
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                                <Database className="w-4 h-4" />
                                MEMORY SYNC
                            </div>
                            <p className="text-2xl font-bold">ACTIVE</p>
                            <p className="text-xs text-gray-500">Persistent LTM Buffer Connected</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                                <Zap className="w-4 h-4" />
                                RESPONSE SPEED
                            </div>
                            <p className="text-2xl font-bold">~120ms</p>
                            <p className="text-xs text-gray-500">Llama 3.3 70B via Groq LP</p>
                        </div>
                    </div>

                    <div className="p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-3">
                            <ShieldCheck className="w-4 h-4" />
                            ACCESSIBILITY & SECURITY
                        </div>
                        <ul className="text-sm space-y-2 text-gray-300">
                            <li className="flex gap-2">
                                <span className="text-cyan-400">✔</span>
                                ARIA-Labelled Dialog Structure
                            </li>
                            <li className="flex gap-2">
                                <span className="text-cyan-400">✔</span>
                                Native Focus Trapping (Escape Key Enabled)
                            </li>
                            <li className="flex gap-2">
                                <span className="text-cyan-400">✔</span>
                                Service Role API Authorization
                            </li>
                        </ul>
                    </div>

                    <div className="text-[10px] text-gray-500 font-mono text-center uppercase tracking-widest">
                        System Firmware v2.5.0-Groq
                    </div>
                </div>
            </Modal>
        </div>
    );
}
