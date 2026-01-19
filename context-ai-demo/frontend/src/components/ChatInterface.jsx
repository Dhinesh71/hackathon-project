import { useState, useEffect, useRef } from 'react';

const ChatInterface = ({ messages, onSendMessage, loading }) => {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !loading) {
            onSendMessage(input);
            setInput("");
        }
    };

    return (
        <div className="main-chat-area">
            <header style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--glass-border)' }}>
                <h1 className="text-neon" style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '2px' }}>
                    CONTEXT AI <span className="text-gradient">SYSTEM</span>
                </h1>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '20vh' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>✨</div>
                        <p>Initialize memory sequence...</p>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>System is standing by.</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{
                            fontSize: '0.7rem',
                            marginBottom: '4px',
                            color: 'var(--text-dim)',
                            textAlign: msg.role === 'user' ? 'right' : 'left',
                            padding: '0 5px'
                        }}>
                            {msg.role === 'user' ? 'YOU' : 'AI CORE'}
                        </div>
                        <div className={msg.role === 'user' ? 'msg-user glass-panel' : 'msg-ai glass-panel'} style={{ padding: '12px 18px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div style={{ alignSelf: 'flex-start', color: 'var(--primary-neon)', fontStyle: 'italic', paddingLeft: '10px' }}>
                        Processing datastream...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(5px)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', maxWidth: '800px', margin: '0 auto' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter command or query..."
                        className="glass-panel"
                        style={{
                            flex: 1,
                            padding: '14px 20px',
                            color: '#fff',
                            border: '1px solid var(--glass-border)',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-neon"
                    >
                        SEND
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
