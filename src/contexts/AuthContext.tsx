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
          try {
            const isRecoveryHash = (window.location.hash || '').includes('type=recovery');
            const params = new URLSearchParams(window.location.search);
            const alreadyOnReset = params.get('mode') === 'reset-password' && window.location.pathname === '/auth';

            // If user came from a password recovery email OR we detect recovery hash, route them to reset screen
            if ((event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && isRecoveryHash) || isRecoveryHash) && !alreadyOnReset) {
                window.location.replace(`/auth?mode=reset-password${window.location.hash || ''}`);
              return;
            }
          } catch {}

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

      // If we arrived with a recovery hash on the home page, send to reset screen
      try {
        const isRecoveryHash = (window.location.hash || '').includes('type=recovery');
        const params = new URLSearchParams(window.location.search);
        const alreadyOnReset = params.get('mode') === 'reset-password' && window.location.pathname === '/auth';
        if (isRecoveryHash && !alreadyOnReset) {
          window.location.replace(`/auth?mode=reset-password${window.location.hash || ''}`);
        }
      } catch {}
      
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

  // Welcome email function
  const sendWelcomeEmail = async (userEmail: string, userName: string) => {
    try {
      const response = await fetch('https://lovable-email-backend.vercel.app/send-welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'lov@ble-2025-secret-KEY'
        },
        body: JSON.stringify({
          to: userEmail,
          userName: userName || 'there'
        })
      });
      
      const result = await response.json();
      console.log('Welcome email sent:', result);
    } catch (error) {
      console.error('Welcome email failed:', error);
      // Don't block the signup process
    }
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
        
        // Provide user-friendly messages for common errors
        if (message.toLowerCase().includes('email') && (message.toLowerCase().includes('already') || message.toLowerCase().includes('exists') || message.toLowerCase().includes('registered'))) {
          message = 'This email is already registered. Please try logging in instead.';
        } else if (message.toLowerCase().includes('duplicate key')) {
          message = 'This email is already registered. Please try logging in instead.';
        }
        
        // Also log for auditing; ignore failures
        try { await AuditService.logAuthEvent('User Signup Failed', email, false, message); } catch {}
        
        const errorObj = new Error(message) as any;
        errorObj.code = errorCode;
        throw errorObj;
      }

      if (!data?.success) {
        let msg = data?.error || 'Failed to create user';
        const code = data?.code || '';
        console.log('Signup failed with message:', msg);
        
        // Provide user-friendly messages for common errors
        if (msg.toLowerCase().includes('email') && (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists') || msg.toLowerCase().includes('registered'))) {
          msg = 'This email is already registered. Please try logging in instead.';
        } else if (msg.toLowerCase().includes('duplicate key')) {
          msg = 'This email is already registered. Please try logging in instead.';
        }
        
        try { await AuditService.logAuthEvent('User Signup Failed', email, false, msg); } catch {}
        
        const errorObj = new Error(msg) as any;
        errorObj.code = code;
        throw errorObj;
      }

      // Send welcome email after successful signup
      try {
        await sendWelcomeEmail(email, fullName || email.split('@')[0]);
        console.log('Welcome email sent successfully');
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't block signup if email fails
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
    // During development or lazy loading, context might not be available immediately
    console.warn('useAuth called outside AuthProvider context');
    return {
      user: null,
      session: null,
      profile: null,
      loading: true,
      signInWithGoogle: async () => {},
      signInWithPassword: async () => {},
      signUpWithPassword: async () => {},
      signOut: async () => {},
      refreshProfile: async () => {}
    };
  }
  return context;
};