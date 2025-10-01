// Deno Edge Function: confirm-user
// Confirms a Supabase auth user by email using the Admin API
// SECURITY NOTE: This endpoint confirms users without email verification.
// Ensure you understand the implications before enabling publicly.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing required env vars SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { email } = await req.json();
    if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // 1) Find user by email via GoTrue Admin REST API
    const findRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}` , {
      method: 'GET',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (!findRes.ok) {
      const text = await findRes.text();
      return new Response(JSON.stringify({ error: 'Failed to lookup user', details: text }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const list = await findRes.json();
    const user = Array.isArray(list?.users) ? list.users.find((u: any) => (u?.email || '').toLowerCase() === email.toLowerCase()) : null;

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // 2) Confirm user via PATCH
    const confirmRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_confirm: true })
    });

    if (!confirmRes.ok) {
      const text = await confirmRes.text();
      return new Response(JSON.stringify({ error: 'Failed to confirm user', details: text }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', details: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
