"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserSupabase(); // ✔ instância global real

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(
        (res: {
          data: { session: import("@supabase/supabase-js").Session | null };
        }) => {
          setUser(res.data.session?.user ?? null);
          setLoading(false);
        }
      );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (
        _event: string,
        session: import("@supabase/supabase-js").Session | null
      ) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}
