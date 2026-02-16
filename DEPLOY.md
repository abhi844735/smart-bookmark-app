# Deploy Smart Bookmark App to Vercel

Follow these steps to get a live URL for the interviewer.

---

## 1. Push code to GitHub

If you haven’t already:

```bash
cd smart-bookmark-app
git init
git add .
git commit -m "Smart Bookmark App - ready for deploy"
```

Create a **new repository** on GitHub (e.g. `smart-bookmark-app`), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmark-app.git
git branch -M main
git push -u origin main
```

Keep the repo **public** so the interviewer can access it.

---

## 2. Deploy on Vercel

1. Go to **[vercel.com](https://vercel.com)** and sign in (use GitHub if possible).
2. Click **Add New…** → **Project**.
3. **Import** the `smart-bookmark-app` repository.
4. Vercel will detect Next.js. Keep:
   - **Framework Preset:** Next.js  
   - **Root Directory:** `./` (or leave blank)  
   - **Build Command:** `npm run build`  
   - **Output Directory:** (default)
5. Before deploying, open **Environment Variables** and add:

   | Name                         | Value                    |
   |-----------------------------|---------------------------|
   | `NEXT_PUBLIC_SUPABASE_URL`  | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key   |

   (Same values as in your local `.env.local`.)

6. Click **Deploy**. Wait for the build to finish.
7. Copy your **live URL** (e.g. `https://smart-bookmark-app-xxx.vercel.app`).

---

## 3. Configure Supabase for production

So Google sign-in works on the live URL:

1. Open your project in the **Supabase Dashboard**.
2. Go to **Authentication** → **URL Configuration**.
3. Under **Redirect URLs**, add your Vercel URL and callback:
   - `https://YOUR_VERCEL_APP.vercel.app`
   - `https://YOUR_VERCEL_APP.vercel.app/auth/callback`
4. Optionally set **Site URL** to `https://YOUR_VERCEL_APP.vercel.app`.
5. Save.

No changes are needed in Google Cloud Console for the redirect: Supabase’s callback URL stays `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`. Only Supabase needs to know your app’s URLs.

---

## 4. Test the live app

1. Open your Vercel URL in a browser.
2. Click **Sign in with Google** and complete sign-in.
3. Add a bookmark and delete one.
4. Open the app in two tabs; add a bookmark in one and confirm it appears in the other (with or without a short delay).

---

## 5. Submit to the interviewer

- **Live URL:** `https://YOUR_VERCEL_APP.vercel.app`
- **GitHub repo:** `https://github.com/YOUR_USERNAME/smart-bookmark-app` (public)
- **README.md:** In the repo (includes problems & solutions)

Submit via the form they shared (e.g. the Google Form link from the assignment email).
