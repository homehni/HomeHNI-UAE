import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePasswordChange = () => {
  const [isChanging, setIsChanging] = useState(false);
  const { toast } = useToast();

  const changePassword = async (newPassword: string) => {
    setIsChanging(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsChanging(false);
    }
  };

  return {
    changePassword,
    isChanging,
  };
};