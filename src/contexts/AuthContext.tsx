import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserProfile, type UserProfile } from '@/services/profileService';
import { AuditService } from '@/services/auditService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithPassword: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile when user changes
  const loadUserProfile = async (user: User | null) => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Defer any Supabase calls/logging to avoid deadlocks
        setTimeout(() => {
          // If user came from a password recovery email, route them to reset screen
          if (event === 'PASSWORD_RECOVERY') {
            try {
              const params = new URLSearchParams(window.location.search);
              if (params.get('mode') !== 'reset-password' || window.location.pathname !== '/auth') {
                window.location.replace('/auth?mode=reset-password');
              }
            } catch {}
          }

          if (event === 'SIGNED_IN') {
            AuditService.logAuthEvent('User Login Success', session?.user?.email ?? undefined, true);
          }
          if (event === 'SIGNED_OUT') {
            AuditService.logAuthEvent('User Logout', undefined, true);
          }
        }, 0);
        
        // Load profile after setting user (deferred)
        if (session?.user) {
          setTimeout(() => {
            loadUserProfile(session.user);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Load profile for initial session
      if (session?.user) {
        setTimeout(() => {
          loadUserProfile(session.user);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // Get the current redirectTo parameter to preserve it after OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirectTo');
    // Redirect directly to the intended page after Google auth, not back to auth page
    const redirectUrl = redirectPath 
      ? `${window.location.origin}${redirectPath}` 
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
      try {
        await AuditService.logAuthEvent('User Login Failed', email, false, error.message);
      } catch (e) {
        console.warn('Failed to log login failure');
      }
      throw error;
    }
    // Success will be logged by onAuthStateChange (SIGNED_IN)
  };

  const signUpWithPassword = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          name: fullName || email.split('@')[0],
          email,
          password,
          role: 'buyer',
          status: 'active'
        }
      });

      if (error) {
        let message = 'Sign up failed';
        let errorCode = '';
        console.log('Supabase function error:', error);
        try {
          const resp = (error as any)?.context?.response;
          if (resp) {
            const json = await resp.json();
            message = json?.error || message;
            errorCode = json?.code || '';
          }
        } catch {}
        // Also log for auditing; ignore failures
        try { await AuditService.logAuthEvent('User Signup Failed', email, false, message); } catch {}
        
        const errorObj = new Error(message) as any;
        errorObj.code = errorCode;
        throw errorObj;
      }

      if (!data?.success) {
        const msg = data?.error || 'Failed to create user';
        const code = data?.code || '';
        console.log('Signup failed with message:', msg);
        try { await AuditService.logAuthEvent('User Signup Failed', email, false, msg); } catch {}
        
        const errorObj = new Error(msg) as any;
        errorObj.code = code;
        throw errorObj;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign up failed';
      throw new Error(msg);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user);
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
      profile,
      loading,
      signInWithGoogle,
      signInWithPassword,
      signUpWithPassword,
      signOut,
      refreshProfile
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