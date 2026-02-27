import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface UseAuthResult {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<string | null>;
    signUp: (email: string, password: string) => Promise<string | null>;
    signOut: () => Promise<void>;
}

/**
 * Manages Supabase auth state. Automatically listens for session changes
 * and persists the session across app restarts via AsyncStorage.
 */
export function useAuth(): UseAuthResult {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session: s } }) => {
            setSession(s);
            setUser(s?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, s) => {
                setSession(s);
                setUser(s?.user ?? null);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (
        email: string,
        password: string
    ): Promise<string | null> => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return error?.message ?? null;
    };

    const signUp = async (
        email: string,
        password: string
    ): Promise<string | null> => {
        const { error } = await supabase.auth.signUp({ email, password });
        return error?.message ?? null;
    };

    const signOut = async (): Promise<void> => {
        await supabase.auth.signOut();
    };

    return { user, session, loading, signIn, signUp, signOut };
}
