import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export default function Verify() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await verifyOtp(email, otp);
            if (error) throw error;
            navigate('/');
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
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md p-1 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl blur opacity-20"></div>

                <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-[0_0_15px_rgba(0,255,157,0.2)]">
                            <ShieldCheck className="w-8 h-8 text-green-400" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-wider text-white">
                            VERIFY <span className="text-green-400">IDENTITY</span>
                        </h2>
                        <p className="text-gray-400 text-sm mt-2 text-center">Enter the security code sent to<br /><span className="text-white font-mono">{email}</span></p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Security Code</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    autoFocus
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-center tracking-[0.5em] text-xl font-mono placeholder-gray-700 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
                                    placeholder="000000"
                                    maxLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/50 text-green-400 font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{loading ? 'VERIFYING...' : 'CONFIRM IDENTITY'}</span>
                            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={() => navigate('/login')} className="text-xs text-gray-500 hover:text-white transition-colors">
                            Wrong email? Try again
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
