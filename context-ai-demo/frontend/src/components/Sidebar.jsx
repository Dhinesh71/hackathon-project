import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';

const Sidebar = ({ sessions, activeSessionId, onSelectSession, onNewChat }) => {
    return (
        <div className="w-[260px] h-full bg-gray-900/95 border-r border-white/10 flex flex-col flex-shrink-0 backdrop-blur-sm">
            {/* Header Aligned to 80px */}
            <div className="h-[80px] border-b border-white/10 flex items-center px-5 flex-shrink-0">
                <button
                    onClick={onNewChat}
                    className="flex items-center justify-center gap-2 w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white/90 text-sm font-medium hover:bg-white/10 hover:border-cyan-400 transition-all duration-200 group"
                >
                    <Plus className="w-4 h-4 text-white/70 group-hover:text-cyan-400" />
                    New Chat
                </button>
            </div>

            {/* Scrollable List Area */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-1 p-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="text-xs text-gray-500 mb-2.5 pl-1 uppercase tracking-wider font-semibold">
                    Recent History
                </div>
                {sessions.map(session => (
                    <div
                        key={session.id}
                        onClick={() => onSelectSession(session.id)}
                        className={`
                            px-3 py-2.5 rounded-md cursor-pointer text-sm flex flex-col gap-1 transition-all duration-200
                            ${session.id === activeSessionId
                                ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-medium shadow-sm shadow-cyan-900/20'
                                : 'text-gray-300 border border-transparent hover:bg-white/5'
                            }
                        `}
                    >
                        <div className="truncate flex items-center gap-2">
                            <MessageSquare className={`w-3 h-3 ${session.id === activeSessionId ? 'text-cyan-400' : 'text-gray-500'}`} />
                            {session.title || `Chat ${session.id.slice(0, 8)}...`}
                        </div>
                        <div className="text-[10px] text-gray-500 ml-5">
                            {new Date(session.updated_at).toLocaleString(undefined, {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </div>
                    </div>
                ))}
                {sessions.length === 0 && (
                    <div className="py-5 text-center text-gray-500 text-xs italic">
                        No history yet...
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
