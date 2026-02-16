# How to Get Supabase URL and Key

The app needs two environment variables from Supabase. Here’s where to get them.

## 1. Create a Supabase project (if you don’t have one)

1. Go to **[https://supabase.com](https://supabase.com)** and sign in (or create an account).
2. Click **New project**.
3. Pick an organization, name the project (e.g. `smart-bookmark`), set a database password, choose a region, then click **Create project**.
4. Wait until the project is ready (green status).

## 2. Get the URL and anon key

1. In the Supabase dashboard, open your project.
2. In the left sidebar, go to **Project Settings** (gear icon at the bottom).
3. Click **API** in the left menu under “Project Settings”.
4. On the API page you’ll see:
   - **Project URL** – e.g. `https://abcdefghijk.supabase.co`  
     → This is your **`NEXT_PUBLIC_SUPABASE_URL`**.
   - **Project API keys**:
     - **anon public** – a long string like `eyJhbGciOiJIUzI1NiIsInR5cCI6...`  
       → This is your **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**.

## 3. Put them in your app

1. In the project root, copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Open **`.env.local`** and replace the placeholders with your real values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...your-anon-key
   ```
3. Save the file and **restart the dev server** (`npm run dev`).

Direct link to the API settings page (replace with your project ref if needed):  
**https://supabase.com/dashboard/project/_/settings/api**

---

## 4. Enable Google sign-in (required for this app)

The error **"Unsupported provider: provider is not enabled"** means Google is not enabled in Supabase. Do the following.

### A. Create Google OAuth credentials

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)** and sign in.
2. Create a project (or select one): **Select a project** → **New Project** → name it (e.g. `smart-bookmark`) → **Create**.
3. Open **APIs & Services** → **Credentials**.
4. Click **+ Create Credentials** → **OAuth client ID**.
5. If asked, set **Application type** to **Web application** and configure the OAuth consent screen:
   - **User type**: External (or Internal for testing only with your org).
   - Fill in App name, User support email, Developer contact. Save.
6. Back to **Create OAuth client ID**:
   - **Application type**: Web application.
   - **Name**: e.g. `Smart Bookmark App`.
   - **Authorized redirect URIs** → **+ Add URI** and add exactly:
     ```text
     https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
     ```
     Replace `YOUR-PROJECT-REF` with your Supabase project ref (from your Project URL, e.g. `https://abcdefghijk.supabase.co` → ref is `abcdefghijk`).
   - Optional for local dev: add `http://localhost:3000/auth/callback` if you use a different flow; for Supabase Google provider you only need the Supabase callback above.
7. Click **Create**. Copy the **Client ID** and **Client Secret**.

### B. Enable Google in Supabase

1. In **Supabase Dashboard**, open your project.
2. Left sidebar: **Authentication** → **Providers**.
3. Find **Google** and click it.
4. Turn **Enable Sign in with Google** **ON**.
5. Paste **Client ID** and **Client Secret** from Google Cloud Console.
6. Click **Save**.

After this, “Sign in with Google” in the app should work. If it still says provider not enabled, wait a minute and try again, and double-check that Google is enabled and saved in **Authentication** → **Providers**.

## 5. Create the `bookmarks` table

In Supabase, go to **SQL Editor**, create a new query, paste the contents of **`supabase/migrations/001_bookmarks.sql`**, and run it.

You should see **"Success. No rows returned"** — that is normal. CREATE TABLE and policy statements don’t return rows; the table and RLS are still created.

**If bookmarks don't update in real time across tabs:** Run the fix in Supabase **SQL Editor**: open **`supabase/migrations/002_realtime_fix.sql`**, paste its contents, and run it. That sets `REPLICA IDENTITY FULL` on `bookmarks` (so other tabs get delete events) and adds the table to the Realtime publication. Then refresh both tabs and try adding a bookmark in one again.

---

## 6. You’re done — run the app

1. **Start the app** (if not already): `npm run dev`
2. Open **http://localhost:3000**
3. Click **Sign in with Google** and complete sign-in
4. On the dashboard, add a bookmark (URL + optional title) and delete one to confirm everything works
5. For **real-time**: open the app in two browser tabs; add a bookmark in one — it should appear in the other without refreshing
