import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Menu, Info } from 'lucide-react';

const ChatInterface = ({ messages, onSendMessage, loading, onMenuClick, onInfoClick }) => {
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
        <div className="flex-1 flex flex-col relative h-full min-w-0">
            <header className="h-[80px] flex items-center px-4 md:px-8 border-b border-white/10 shrink-0 bg-gray-900/50 backdrop-blur-md z-10">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 mr-2 text-gray-400 hover:text-white transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex-1 flex justify-center lg:justify-start">
                    <h1 className="text-xl md:text-2xl font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                        CONTEXT AI <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">SYSTEM</span>
                    </h1>
                </div>
                <button
                    onClick={onInfoClick}
                    className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                    title="System Info"
                >
                    <Info className="w-5 h-5" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-[20vh] animate-pulse">
                        <div className="text-4xl md:text-6xl mb-4 opacity-50">✨</div>
                        <p className="text-base md:text-lg font-medium">Initialize memory sequence...</p>
                        <p className="text-xs md:text-sm opacity-70">System is standing by.</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                        <div className="text-[10px] mb-1.5 text-gray-500 px-1 font-mono uppercase tracking-wider flex items-center gap-1">
                            {msg.role === 'user' ? (
                                <><span>YOU</span><User className="w-3 h-3" /></>
                            ) : (
                                <><Bot className="w-3 h-3" /><span>AI CORE</span></>
                            )}
                        </div>
                        <div className={`
                            px-4 md:px-5 py-2.5 md:py-3.5 text-sm md:text-base leading-relaxed rounded-2xl border backdrop-blur-md shadow-lg
                            ${msg.role === 'user'
                                ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-white rounded-br-none'
                                : 'bg-white/5 border-white/10 text-gray-200 rounded-bl-none'
                            }
                        `}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="self-start text-cyan-400/80 italic text-sm pl-2 flex items-center gap-2 animate-pulse">
                        <Bot className="w-4 h-4" />
                        Processing datastream...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 md:p-5 bg-black/20 backdrop-blur-md border-t border-white/5">
                <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter command or query..."
                        className="flex-1 bg-gray-800/50 border border-white/10 rounded-xl px-4 md:px-5 py-2.5 md:py-3.5 text-sm md:text-base text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 px-4 md:px-6 rounded-xl font-bold tracking-wider hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-cyan-400 transition-all duration-300 flex items-center gap-2"
                    >
                        <span className="hidden md:inline">SEND</span>
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
