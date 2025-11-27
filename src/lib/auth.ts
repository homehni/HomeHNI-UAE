import { supabase } from './supabaseClient';

export type SignInResult = {
  error?: any;
  data?: any;
};

export async function sendLoginOtp(email: string): Promise<SignInResult> {
  if (!email) return { error: 'email-required' };
  try {
    const result = await supabase.auth.signInWithOtp({ email });
    return { data: result };
  } catch (error) {
    return { error };
  }
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

export async function signOut() {
  await supabase.auth.signOut();
}