import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { isValidRole } from '@/lib/roles';

type Props = {
  role: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export default function RequireRole({ role, children, fallback = null }: Props) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    async function check() {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!mounted) return;
      if (!user) {
        setAllowed(false);
        return;
      }
      const userRole = (user.user_metadata as any)?.role;
      setAllowed(userRole === role && isValidRole(userRole));
    }
    check();
    return () => { mounted = false; };
  }, [role]);

  if (allowed === null) return <div>Loading...</div>;
  if (!allowed) return (fallback ?? <div>Access denied — role {role} required.</div>);
  return <>{children}</>;
}