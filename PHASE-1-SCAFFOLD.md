# Phase 1 — Platform foundation (Supabase scaffold)

Branch: feature/phase-1-auth-scaffold

This scaffold adds a minimal Supabase-based authentication flow and role-aware dashboard shells.

What is included
- .env.template — placeholders for required environment variables
- src/lib/supabaseClient.ts — Supabase client
- src/lib/auth.ts — auth helpers (send OTP / handle session)
- src/lib/roles.ts — role definitions and utilities
- src/components/RequireRole.tsx — role-based guard
- src/pages/Auth/Login.tsx — email OTP login page (frontend)
- src/pages/dashboard/[role]/index.tsx — simple role dashboard skeleton
- README update with run instructions

How to run locally
1. Create .env.local from .env.template and fill in values (do NOT commit).
2. Install dependencies: npm ci
3. Start dev server: npm run dev
4. Configure Supabase project auth (enable "Email" sign-in method).

Security notes
- Do not commit .env or any secret keys.
- Use Vercel/GitHub secrets for production environment variables.
- Rotate any keys that were previously committed.
