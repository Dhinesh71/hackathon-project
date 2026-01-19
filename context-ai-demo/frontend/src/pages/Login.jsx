import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowRight, Activity } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { signInWithOtp } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await signInWithOtp(email);
            if (error) throw error;
            // Simple toast/alert replacement
            const toast = document.createElement('div');
            toast.className = "fixed top-5 right-5 bg-cyan-500 text-black px-6 py-3 rounded-lg font-bold shadow-[0_0_20px_rgba(0,243,255,0.4)] z-50 animate-bounce";
            toast.innerText = 'Magic Link Sent to Email!';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);

            navigate(`/verify?email=${encodeURIComponent(email)}`);
        } catch (error) {
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md p-1 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20"></div>

                <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                            <Activity className="w-8 h-8 text-cyan-400" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-wider text-white">
                            CONTEXT <span className="text-cyan-400">AI</span>
                        </h2>
                        <p className="text-gray-400 text-sm mt-2">Secure Neural Interface Access</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Coordinates</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                    placeholder="operative@context.ai"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{loading ? 'INITIATING...' : 'SEND ACCESS CODE'}</span>
                            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-600">
                            Protected by <span className="text-cyan-400/60">Supabase Auth</span> & <span className="text-purple-400/60">Gemini Core</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
