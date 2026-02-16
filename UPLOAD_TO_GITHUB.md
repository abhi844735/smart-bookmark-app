# Upload to GitHub without Git (company laptop)

Use this if you can't run `git` on your machine but can log in to GitHub in the browser.

---

## Step 1: Prepare a folder to upload (no secrets, no node_modules)

1. **Copy** the entire `smart-bookmark-app` folder to a new folder, e.g. `smart-bookmark-app-upload`.

2. **Delete** these from the copy (so they are **not** uploaded):
   - `node_modules` (folder) — large; everyone runs `npm install` themselves
   - `.next` (folder) — build output
   - `.env.local` (file) — **contains secrets**; never put on GitHub

3. **Keep** everything else (e.g. `src`, `supabase`, `package.json`, `README.md`, `.gitignore`, etc.).

---

## Step 2: Create a new repo on GitHub

1. Log in at [github.com](https://github.com).
2. Click **+** (top right) → **New repository**.
3. **Repository name:** `smart-bookmark-app` (or any name you like).
4. Choose **Public**.
5. **Do not** check "Add a README" or .gitignore (you're uploading your own).
6. Click **Create repository**.

---

## Step 3: Upload your folder

1. On the new repo page, click **"uploading an existing file"** (or **Add file** → **Upload files**).

2. Open your **prepared folder** (`smart-bookmark-app-upload`). Select **all** files and folders inside it (e.g. `src`, `supabase`, `package.json`, `README.md`, `.env.local.example`, `.gitignore`, etc.). Do **not** include `node_modules`, `.next`, or `.env.local`.

3. **Drag and drop** them into the GitHub upload area (or use "choose your files" and select them).

4. In the box at the bottom, add a commit message, e.g. **"Initial upload - Smart Bookmark App"**.

5. Click **Commit changes**.

---

## Step 4: After upload

- Your code is now on GitHub. Share the repo URL with the interviewer.
- On Vercel, when you import the project, use this GitHub repo. Vercel will run `npm install` and `npm run build`; they don’t need your `node_modules` or `.next`.
- Add your Supabase env vars in Vercel (as in DEPLOY.md).

---

**Reminder:** Never upload `.env.local`. It has your Supabase keys. Use Vercel’s Environment Variables for the live site.
