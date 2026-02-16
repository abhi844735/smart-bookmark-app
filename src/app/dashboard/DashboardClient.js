"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DashboardClient({ initialBookmarks, user }) {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState("connecting");

  // Keep list unique by id (avoids duplicate key when same row comes from insert + Realtime)
  const dedupeById = (list) => {
    const seen = new Set();
    return list.filter((b) => {
      if (seen.has(b.id)) return false;
      seen.add(b.id);
      return true;
    });
  };

  const refetchBookmarks = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("bookmarks")
      .select("id, url, title, created_at")
      .order("created_at", { ascending: false });
    if (data) setBookmarks(data);
  };

  // 1) Realtime: instant push from Supabase when bookmarks change (table must be in supabase_realtime publication)
  const channelRef = useRef(null);
  useEffect(() => {
    const supabase = createClient();
    const myUserId = user.id;
    let cancelled = false;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session?.access_token) {
        supabase.realtime.setAuth(session.access_token);
      }

      const channel = supabase
        .channel(`bookmarks-realtime-${myUserId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              if (payload.new?.user_id !== myUserId) return;
              const row = { id: payload.new.id, url: payload.new.url, title: payload.new.title, created_at: payload.new.created_at };
              setBookmarks((prev) => dedupeById([row, ...prev]));
            }
            if (payload.eventType === "DELETE") {
              const id = payload.old?.id;
              if (id) setBookmarks((prev) => prev.filter((b) => b.id !== id));
            }
          }
        );
      if (cancelled) return;
      channelRef.current = channel;
      channel.subscribe((status) => {
        setRealtimeStatus(status);
      });
    })();

    return () => {
      cancelled = true;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user.id]);

  // 2) Polling: every 3s refetch list so the other tab updates without refresh (works even if Realtime is off)
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        refetchBookmarks();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const titleToUse = title.trim() || (() => {
      try { return new URL(url).hostname || "Untitled"; } catch { return "Untitled"; }
    })();
    const { data: inserted, error } = await supabase
      .from("bookmarks")
      .insert({
        user_id: user.id,
        url: url.trim(),
        title: titleToUse,
      })
      .select("id, url, title, created_at")
      .single();
    if (!error && inserted) {
      setBookmarks((prev) => dedupeById([inserted, ...prev]));
    }
    setUrl("");
    setTitle("");
    setLoading(false);
  }

  async function handleDelete(id) {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    const supabase = createClient();
    await supabase.from("bookmarks").delete().eq("id", id);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <header className="flex items-center justify-between max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-primary-400">My Bookmarks</h1>
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              realtimeStatus === "SUBSCRIBED"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-amber-500/20 text-amber-400"
            }`}
            title={realtimeStatus === "SUBSCRIBED" ? "Live updates on" : "Connecting…"}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${realtimeStatus === "SUBSCRIBED" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            {realtimeStatus === "SUBSCRIBED" ? "Live" : "…"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400 truncate max-w-[180px]">{user.email}</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm text-slate-400 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium"
          >
            Add
          </button>
        </form>

        <ul className="space-y-2">
          {bookmarks.map((b) => (
            <li
              key={b.id}
              className="flex items-center justify-between gap-4 p-4 rounded-lg bg-slate-800 border border-slate-700"
            >
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 truncate text-primary-400 hover:underline"
              >
                {b.title || b.url}
              </a>
              <span className="text-xs text-slate-500 truncate max-w-[120px]">{b.url}</span>
              <button
                type="button"
                onClick={() => handleDelete(b.id)}
                className="text-red-400 hover:text-red-300 text-sm shrink-0"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        {bookmarks.length === 0 && (
          <p className="text-slate-500 text-center py-8">No bookmarks yet. Add one above.</p>
        )}
      </div>
    </main>
  );
}
