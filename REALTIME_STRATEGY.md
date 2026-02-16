# How "real-time" updates work (and why the second tab updates)

## What we want

- You open **Tab 1** and **Tab 2** (same user, same app).
- In **Tab 1** you add a bookmark.
- **Tab 2** should show that bookmark **without you clicking refresh**.

---

## How we do it (two ways)

### 1. Polling (always on — this is why it works)

Every **3 seconds**, each tab asks Supabase: “Give me the latest list of my bookmarks.” The app then replaces the list on screen with that result.

So:
- You add a bookmark in Tab 1.
- Within at most **3 seconds**, Tab 2’s next poll runs and gets the new list.
- Tab 2 updates automatically. No refresh button needed.

This works even if Supabase Realtime is not set up. **So the second tab will update without refresh as long as you wait a few seconds.**

---

### 2. Supabase Realtime (instant, optional)

We also subscribe to Supabase **Realtime** for the `bookmarks` table. When Realtime is enabled correctly, the server pushes new rows to the browser as soon as they are inserted. Then the second tab can update **instantly** instead of waiting for the next 3-second poll.

For Realtime to work you must **turn on the table in the Realtime publication**:

1. Open your project in the **Supabase Dashboard**.
2. Go to **Database** → **Publications**  
   (direct link: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF/database/publications`).
3. Open the **supabase_realtime** publication.
4. **Toggle ON** the **bookmarks** table (so it is included in the publication).

After that, new bookmarks should appear in the other tab almost instantly. If not, the 3-second polling still keeps the second tab in sync.

---

## Summary

| Method      | When it updates the second tab | Needs extra setup? |
|------------|--------------------------------|---------------------|
| **Polling**   | Within a few seconds           | No                  |
| **Realtime** | Instantly                      | Yes (Publications)  |

So: **the second tab will update without refresh** because of polling. Realtime is an optional improvement for instant updates once you enable the `bookmarks` table in the Realtime publication.
