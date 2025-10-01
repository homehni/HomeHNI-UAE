import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserProfile, type UserProfile } from '@/services/profileService';
import { AuditService } from '@/services/auditService';
import { sendWelcomeEmail } from '@/services/emailService';

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

  // Load profile when user changes with retry logic for Google OAuth
  const loadUserProfile = async (user: User | null, retryCount = 0) => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const userProfile = await getCurrentUserProfile();
      if (userProfile) {
        setProfile(userProfile);
      } else if (retryCount < 3) {
        // Profile might not be created yet (especially for Google OAuth)
        // Retry after a short delay
        setTimeout(() => {
          loadUserProfile(user, retryCount + 1);
        }, 500 * (retryCount + 1)); // Exponential backoff: 500ms, 1s, 1.5s
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      if (retryCount < 3) {
        // Retry on error as well
        setTimeout(() => {
          loadUserProfile(user, retryCount + 1);
        }, 500 * (retryCount + 1));
      } else {
        setProfile(null);
      }
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
        console.log('Supabase function error:', error);
        let message = 'Sign up failed';
        let code: string | undefined;
        let status: number | undefined;

        try {
          const resp = (error as any)?.context?.response;
          if (resp) {
            status = resp.status;
            const json = await resp.json().catch(() => null);
            if (json) {
              message = json?.error || json?.message || message;
              code = json?.code || code;
            }
          }
        } catch {
          message = (error as any)?.message || message;
          code = (error as any)?.code || code;
        }

        const msgLc = (message || '').toLowerCase();
        const isEmailExists =
          code === 'email_exists' ||
          status === 409 ||
          status === 422 ||
          msgLc.includes('duplicate key') ||
          (msgLc.includes('email') && (msgLc.includes('already') || msgLc.includes('exists') || msgLc.includes('registered')));

        if (isEmailExists) {
          message = 'This email is already registered. Please log in or reset your password.';
          code = 'email_exists';
          status = status ?? 409;
        }

        try { await AuditService.logAuthEvent('User Signup Failed', email, false, message); } catch {}

        const errObj: any = new Error(message);
        if (code) errObj.code = code;
        if (status) errObj.status = status;
        throw errObj;
      }

      if (!data?.success) {
        let message = data?.error || 'Failed to create user';
        const code = (data as any)?.code as string | undefined;
        const status = (data as any)?.status as number | undefined;
        console.log('Signup failed with message:', message, 'code:', code, 'status:', status);
        
        const msgLc = (message || '').toLowerCase();
        const isEmailExists =
          code === 'email_exists' ||
          status === 409 ||
          status === 422 ||
          msgLc.includes('duplicate key') ||
          (msgLc.includes('email') && (msgLc.includes('already') || msgLc.includes('exists') || msgLc.includes('registered')));

        if (isEmailExists) {
          message = 'This email is already registered. Please log in or reset your password.';
        }
        
        try { await AuditService.logAuthEvent('User Signup Failed', email, false, message); } catch {}
        
        const errObj: any = new Error(message);
        if (isEmailExists) {
          errObj.code = 'email_exists';
          errObj.status = status ?? 409;
        } else {
          if (code) errObj.code = code;
          if (status) errObj.status = status;
        }
        throw errObj;
      }

      // Send welcome email after successful signup
      try {
        const emailResult = await sendWelcomeEmail(email, fullName || email.split('@')[0]);
        if (emailResult.success) {
          console.log('Welcome email sent successfully');
        } else {
          console.error('Welcome email failed:', emailResult.error);
        }
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't block signup if email fails
      }
    } catch (err: any) {
      const fallback = 'Sign up failed';
      const message = err?.message || fallback;
      const e: any = new Error(message);
      if (err?.code) e.code = err.code;
      if (err?.status) e.status = err.status;
      throw e;
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