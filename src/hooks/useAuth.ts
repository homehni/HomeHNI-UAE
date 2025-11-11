import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'buyer' | 'seller' | 'agent' | 'builder' | 'admin' | 'superadmin';

interface AuthState {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    userRole: null,
    loading: true,
  });
  const { toast } = useToast();

  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole | null> => {
    try {
      const { data, error } = await supabase.rpc('get_current_user_role');
      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      return data as UserRole;
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      return null;
    }
  }, []);

  // Do NOT perform Supabase calls inside the auth callback to avoid deadlocks
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Sync state immediately
      setAuthState((prev) => ({
        ...prev,
        user: session?.user ?? null,
        session: session ?? null,
        loading: true,
      }));

      // Defer role fetching to the next tick to avoid blocking the callback
      if (session?.user) {
        setTimeout(async () => {
          const role = await fetchUserRole(session.user.id);
          setAuthState({
            user: session.user,
            session,
            userRole: role,
            loading: false,
          });
        }, 0);
      } else {
        // No session
        setAuthState({ user: null, session: null, userRole: null, loading: false });
      }
    });

    // Initialize from existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState((prev) => ({ ...prev, user: session?.user ?? null, session: session ?? null, loading: true }));
      if (session?.user) {
        // Fetch role outside of callback
        fetchUserRole(session.user.id).then((role) => {
          setAuthState({ user: session.user, session, userRole: role, loading: false });
        });
      } else {
        setAuthState({ user: null, session: null, userRole: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserRole]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Welcome Back!",
        description: "You have successfully signed in.",
      });
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Sign In Error",
        description: message,
        variant: "destructive",
      });
      return { error: { message } };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: fullName ? { full_name: fullName } : undefined,
        }
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Sign Up Error",
        description: message,
        variant: "destructive",
      });
      return { error: { message } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign Out Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
        className: "bg-white border border-red-200 shadow-lg rounded-lg",
        style: {
          borderLeft: "12px solid hsl(var(--brand-red))",
        },
      });
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Sign Out Error",
        description: message,
        variant: "destructive",
      });
      return { error: { message } };
    }
  };

  const isAdmin = () => {
    return authState.userRole === 'admin' || authState.userRole === 'superadmin';
  };

  const isSuperAdmin = () => {
    return authState.userRole === 'superadmin';
  };

  return {
    user: authState.user,
    session: authState.session,
    userRole: authState.userRole,
    loading: authState.loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isSuperAdmin,
  };
};
