import React from 'react';

const Sidebar = ({ sessions, activeSessionId, onSelectSession, onNewChat }) => {
    return (
        <div style={{
            width: '260px',
            height: '100%',
            backgroundColor: 'rgba(10, 10, 15, 0.95)',
            borderRight: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
        }}>
            {/* Header Aligned to 80px */}
            <div style={{
                height: '80px',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                flexShrink: 0
            }}>
                <button
                    onClick={onNewChat}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        color: 'var(--text-main)',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor = 'var(--primary-neon)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                    }}
                >
                    <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
                    New Chat
                </button>
            </div>

            {/* Scrollable List Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '20px'
            }}>
                <div style={{
                    fontSize: '12px',
                    color: 'var(--text-dim)',
                    marginBottom: '10px',
                    paddingLeft: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    Recent History
                </div>
                {sessions.map(session => (
                    <div
                        key={session.id}
                        onClick={() => onSelectSession(session.id)}
                        style={{
                            padding: '10px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: session.id === activeSessionId ? 'var(--primary-neon)' : 'var(--text-main)',
                            backgroundColor: session.id === activeSessionId ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                            border: session.id === activeSessionId ? '1px solid rgba(0, 243, 255, 0.2)' : '1px solid transparent',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                        }}
                        onMouseEnter={(e) => {
                            if (session.id !== activeSessionId) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (session.id !== activeSessionId) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        <div style={{ fontWeight: session.id === activeSessionId ? '600' : '400', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {session.title || `Chat ${session.id.slice(0, 8)}...`}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                            {new Date(session.updated_at).toLocaleString(undefined, {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </div>
                    </div>
                ))}
                {sessions.length === 0 && (
                    <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px', fontStyle: 'italic' }}>
                        No history yet...
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
