# Smart Bookmark App

A simple bookmark manager with Google sign-in, private per-user bookmarks, and real-time sync across tabs. Built for the Abstrabit Technologies Fullstack/GenAI micro-challenge.

## Features

- **Google OAuth only** — sign up / log in with Google (no email/password)
- **Add bookmarks** — URL + optional title
- **Private data** — each user sees only their own bookmarks (RLS)
- **Real-time updates** — list updates without refresh (Supabase Realtime + polling fallback)
- **Delete bookmarks** — remove your own bookmarks
- **Deployed on Vercel** — live URL for evaluators

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 18, Tailwind CSS
- **Backend / Auth / DB / Realtime:** Supabase (Auth, Database, Realtime)
- **Deploy:** Vercel

## Local Setup

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd smart-bookmark-app
   npm install
   ```

2. **Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - In **Project Settings → API** copy **Project URL** and **anon public** key
   - Create `.env.local` with:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
     ```
   - Run the SQL in `supabase/migrations/001_bookmarks.sql` (and `002_realtime_fix.sql` if you want Realtime) in **SQL Editor**
   - In **Authentication → Providers** enable **Google** and add OAuth Client ID/Secret from Google Cloud Console
   - In **Database → Publications** ensure **bookmarks** is in **supabase_realtime** (for instant cross-tab updates)

3. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000). See **SETUP.md** for more detail.

## Deployment (Vercel)

See **[DEPLOY.md](./DEPLOY.md)** for step-by-step: push to GitHub, connect to Vercel, add env vars, and configure Supabase redirect URLs for production.

## Problems Encountered & Solutions

1. **Supabase "URL and Key are required" on load**  
   Env vars were missing. We added guards in the Supabase client and middleware so the app doesn’t crash; it shows the landing page and a console hint. After adding `.env.local`, auth and DB work.

2. **"Unsupported provider: provider is not enabled"**  
   Google wasn’t enabled in Supabase. Fixed by enabling **Google** under **Authentication → Providers** and adding Client ID/Secret from Google Cloud Console. For external users, we used **External** user type and added **Test users** so evaluators can sign in.

3. **Real-time not updating the second tab**  
   We use two mechanisms: (1) **Supabase Realtime** (instant) — required adding `bookmarks` to the **supabase_realtime** publication and calling `realtime.setAuth(session.access_token)` before subscribing so RLS works. (2) **Polling** every 3 seconds so the other tab updates even if Realtime isn’t configured. See **REALTIME_STRATEGY.md**.

4. **Duplicate React key warning**  
   The same bookmark could be added twice (insert response + Realtime event). We added a `dedupeById()` helper and use it whenever we merge new rows into the list so keys stay unique.

5. **npm ERESOLVE (React 19 vs Next 15)**  
   Next 15.0.3 expected React 18. We pinned `react` and `react-dom` to `^18.2.0` in `package.json` to resolve the conflict.

## License

Private — Abstrabit Technologies assignment.
