# Challenges Faced & Solutions — Smart Bookmark App

This document summarizes the main challenges encountered while building the Smart Bookmark App and how they were resolved. It can be used for the submission README or shared with the interviewer.

---

## 1. App crashing when Supabase env vars were missing

**Challenge:** On first run (before adding `.env.local`), the app threw: *"Your project's URL and API key are required to create a Supabase client!"* — from both the middleware and the browser client. The app wouldn’t load at all.

**Solution:**  
- In **middleware**: If `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing, we skip creating the Supabase client and return the response as-is so the request continues.  
- In **browser client** (`src/lib/supabase/client.js`): If env vars are missing, we return a small no-op client (auth and `from()` methods that do nothing or return empty data) instead of calling `createBrowserClient()`.  
- In **server client** (`src/lib/supabase/server.js`): Same idea — return a no-op client when env is missing.  
- Result: The app loads and shows the landing page; a console message reminds to add `.env.local`. Once the user adds the real URL and anon key, Supabase works normally.

---

## 2. Google sign-in: "Unsupported provider: provider is not enabled"

**Challenge:** After clicking "Sign in with Google", the API returned: *"Unsupported provider: provider is not enabled"*.

**Solution:**  
Google was not enabled in Supabase. We enabled it under **Authentication → Providers → Google** (turn it ON and paste **Client ID** and **Client Secret** from Google Cloud Console). The redirect URI in Google Cloud was set to `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`. After saving in Supabase, Google sign-in worked.

---

## 3. Google OAuth: "Only make your app available to external users"

**Challenge:** On the OAuth consent screen, the message said that (as a non–Google Workspace user) the app can only be available to external users.

**Solution:**  
This is expected. We chose **External** as the user type, completed the consent screen (app name, support email, developer contact), and under **Test users** added the Google accounts that need to sign in (e.g. our own and the interviewer’s). The app was left in **Testing** mode; no verification or "Publish" was required for the assignment. Only the added test users can sign in, which was enough for evaluation.

---

## 4. Real-time: second tab not updating without refresh

**Challenge:** The requirement was that if a user has two tabs open and adds a bookmark in one, it should appear in the other without a manual refresh. Initially, the second tab did not update.

**Solution:**  
We used two mechanisms:

- **Supabase Realtime (instant):**  
  - Ensured the `bookmarks` table is in the **supabase_realtime** publication (Supabase Dashboard → Database → Publications).  
  - Before subscribing to `postgres_changes`, we call `supabase.realtime.setAuth(session.access_token)` so the Realtime connection is authenticated and RLS can filter events.  
  - We subscribe to `postgres_changes` on the `bookmarks` table and, in the callback, update local state for INSERT/DELETE (filtering by `user_id` for INSERTs).  

- **Polling (fallback):**  
  Every 3 seconds (when the tab is visible), we refetch the bookmark list from Supabase and replace the list. So even if Realtime is not configured or fails, the second tab still updates within a few seconds without the user refreshing.

Details are in **REALTIME_STRATEGY.md**.

---

## 5. Duplicate React key warning

**Challenge:** React showed: *"Encountered two children with the same key"* (a bookmark UUID). The same bookmark appeared twice in the list.

**Solution:**  
The same row could be added twice: once from the **insert response** in `handleAdd` and once from the **Realtime INSERT** event. We introduced a `dedupeById(list)` helper that keeps only one occurrence per `id` (first one wins). We use it whenever we merge a new bookmark into the list (in both the add handler and the Realtime INSERT callback), so the list always has unique ids and the key warning is gone.

---

## 6. npm install: ERESOLVE dependency conflict

**Challenge:** `npm install` failed with an ERESOLVE error: Next.js 15.0.3 expected React 18 (or a specific React 19 RC), but the project had React 19.x, so peer dependencies didn’t match.

**Solution:**  
We pinned `react` and `react-dom` in `package.json` to `^18.2.0` so they match Next.js 15.0.3’s peer dependency. After that, `npm install` completed without `--legacy-peer-deps`.

---

## 7. Build error: "Can't resolve '@/lib/supabase/middleware'"

**Challenge:** The app failed to compile with *"Module not found: Can't resolve '@/lib/supabase/middleware'"*. The file existed under `src/lib/supabase/middleware.js`.

**Solution:**  
The `@/*` path alias in `jsconfig.json` was set to `["./*"]`, so it resolved from the **project root** instead of `src`. We changed the path to `["./src/*"]` so that `@/lib/supabase/middleware` correctly points to `src/lib/supabase/middleware.js`. The build then succeeded.

---

## 8. Database: "Success. No rows returned" after running migration

**Challenge:** After running the SQL migration in Supabase (create table, RLS policies, replica identity, publication), the result said "Success. No rows returned" and it wasn’t clear if the setup had worked.

**Solution:**  
This is normal. Statements like `CREATE TABLE`, `CREATE POLICY`, and `ALTER PUBLICATION` do not return rows; they just succeed. The table, RLS, and Realtime publication were created correctly. We documented this in **SETUP.md** so future runs don’t cause confusion.

---

## Summary table

| # | Challenge | Solution in short |
|---|-----------|-------------------|
| 1 | App crash when Supabase env missing | No-op Supabase client when URL/key missing (middleware + client + server). |
| 2 | Google provider not enabled | Enable Google in Supabase Auth → Providers and add Client ID/Secret. |
| 3 | OAuth "external users only" | Use External + Test users; keep app in Testing. |
| 4 | Second tab not updating in real time | Realtime (setAuth + publication) + 3s polling fallback. |
| 5 | Duplicate React key | `dedupeById()` when merging new bookmarks into the list. |
| 6 | npm ERESOLVE (React/Next) | Pin React to ^18.2.0. |
| 7 | Path alias @/ not resolving | Set `@/*` to `./src/*` in jsconfig.json. |
| 8 | "No rows returned" after migration | Expected for DDL; table and Realtime are set up correctly. |

---

*This file can be submitted as the "description of problems encountered and how they were solved" as required by the assignment.*
