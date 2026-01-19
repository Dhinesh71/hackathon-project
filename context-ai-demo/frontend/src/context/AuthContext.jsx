import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithOtp = async (email) => {
        return supabase.auth.signInWithOtp({ email });
    };

    const verifyOtp = async (email, token) => {
        return supabase.auth.verifyOtp({ email, token, type: 'email' });
    };

    const signOut = async () => {
        return supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, signInWithOtp, verifyOtp, signOut, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
