import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Memoize the admin check to prevent unnecessary re-renders
  const shouldCheckAdmin = useMemo(() => {
    return !authLoading && user;
  }, [authLoading, user]);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!shouldCheckAdmin) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user!.id,
          _role: 'admin'
        });

        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data || false);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
      } else {
        checkAdminRole();
      }
    }
  }, [shouldCheckAdmin, user, authLoading]);

  return { 
    isAdmin, 
    loading: loading || authLoading 
  };
};
