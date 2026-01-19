import React from 'react';

const DebugPanel = ({ stmCount, ltm, sessionId }) => {
    return (
        <div className="debug-sidebar glass-panel" style={{
            height: '100%',
            borderLeft: '1px solid var(--glass-border)',
            borderRight: 'none',
            borderTop: 'none',
            borderBottom: 'none',
            borderRadius: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            flexShrink: 0,
            background: 'rgba(10, 10, 15, 0.95)',
            backdropFilter: 'none'
        }}>
            {/* Header Aligned */}
            <div style={{
                height: '80px',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                flexShrink: 0,
                justifyContent: 'space-between'
            }}>
                <h2 className="text-neon" style={{
                    margin: 0,
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span>🧠</span> MEMORY OS
                </h2>
                {sessionId && (
                    <div style={{
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        color: 'var(--text-dim)',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        maxWidth: '80px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }} title={sessionId}>
                        {sessionId.split('-').pop()}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '25px',
                padding: '20px',
                overflowY: 'auto'
            }}>
                <div>
                    <h3 style={{ color: 'var(--secondary-neon)', marginBottom: '8px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Short-Term Buffer</h3>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>{stmCount}</div>
                        <div style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/ 5 slots</div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '10px' }}>Summarization threshold</div>

                    {/* Visual progress bar */}
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0,0,0,0.3)', marginTop: '5px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${Math.min((stmCount / 5) * 100, 100)}%`,
                            height: '100%',
                            background: 'linear-gradient(to right, var(--secondary-neon), var(--primary-neon))',
                            borderRadius: '4px',
                            transition: 'width 0.3s ease',
                            boxShadow: '0 0 10px var(--secondary-neon)'
                        }} />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', minHeight: '150px' }}>
                    <h3 style={{ color: 'var(--accent-neon)', marginBottom: '15px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Long-Term Database</h3>

                    {ltm.length === 0 ? (
                        <div style={{
                            fontStyle: 'italic',
                            color: 'var(--text-dim)',
                            padding: '15px',
                            border: '1px dashed var(--glass-border)',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontSize: '0.85rem'
                        }}>
                            No persisted data in matrix...
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {ltm.map((mem, idx) => (
                                <div key={idx} style={{
                                    padding: '10px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderLeft: '2px solid var(--accent-neon)',
                                    borderRadius: '0 6px 6px 0',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-main)',
                                    lineHeight: '1.4'
                                }}>
                                    {mem}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 'auto', fontSize: '0.7rem', color: 'var(--text-dim)', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px', color: 'var(--text-main)' }}>ARCHITECTURE STATS:</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span>Protocol:</span>
                        <span style={{ color: 'var(--primary-neon)' }}>Sliding Window</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span>Batch Size:</span>
                        <span style={{ color: 'var(--primary-neon)' }}>5 interactions</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Recall:</span>
                        <span style={{ color: 'var(--accent-neon)' }}>Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebugPanel;
