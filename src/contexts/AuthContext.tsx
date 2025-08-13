import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // Get the current redirectTo parameter to preserve it after OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirectTo');
    const redirectUrl = redirectPath 
      ? `${window.location.origin}/auth?redirectTo=${encodeURIComponent(redirectPath)}` 
      : `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    
    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in with password:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    // Preserve redirectTo after email verification
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirectTo');
    const redirectUrl = redirectPath
      ? `${window.location.origin}/auth?redirectTo=${encodeURIComponent(redirectPath)}`
      : `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      // Handle various session-related errors gracefully
      const sessionErrors = [
        'session_not_found',
        'Session not found',
        'invalid_session',
        'Invalid session',
        'session expired',
        'expired'
      ];
      
      const isSessionError = sessionErrors.some(errorText => 
        error.message?.toLowerCase().includes(errorText.toLowerCase()) ||
        error.code?.toLowerCase().includes(errorText.toLowerCase())
      );
      
      if (isSessionError) {
        console.log('Session already invalid, user is effectively signed out');
        return;
      }
      
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signInWithGoogle,
      signInWithPassword,
      signUpWithEmail,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};