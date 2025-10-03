// Deno Edge Function: confirm-user
// Confirms a Supabase auth user by email using the Admin API
// SECURITY NOTE: This endpoint confirms users without email verification.
// Ensure you understand the implications before enabling publicly.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing required env vars SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

// Admin client (service key)
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

serve(async (req) => {
  try {
    // CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const body = await req.json().catch(() => ({}));
    let email: string | undefined = body?.email;

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    email = email.trim().toLowerCase();
    const isValidEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!isValidEmail) {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    // 1) Find user by email using Admin client (iterate pages to be reliable)
    let foundUser: any = null;
    let page = 1;
    const perPage = 200; // Max allowed by API
    for (let i = 0; i < 10; i++) { // up to 2000 users scanned
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (error) {
        console.error('listUsers error:', error);
        return new Response(JSON.stringify({ error: 'Failed to lookup user' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }
      const match = data.users.find((u: any) => (u?.email || '').toLowerCase() === email);
      if (match) {
        foundUser = match;
        break;
      }
      if (data.users.length < perPage) break; // no more pages
      page += 1;
    }

    if (!foundUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    // If already confirmed, return success
    if (foundUser.email_confirmed_at) {
      return new Response(JSON.stringify({ success: true, alreadyConfirmed: true }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    // 2) Confirm email
    const { data: updated, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(foundUser.id, { email_confirm: true });
    if (updateErr) {
      console.error('updateUserById error:', updateErr);
      return new Response(JSON.stringify({ error: 'Failed to confirm user' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    return new Response(JSON.stringify({ success: true, userId: updated?.user?.id || foundUser.id }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  } catch (e) {
    console.error('Unexpected error in confirm-user:', e);
    return new Response(JSON.stringify({ error: 'Unexpected error', details: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  }
});
