import { createBrowserClient } from "@supabase/ssr";

function createNoOpClient() {
  const noOp = () => Promise.resolve({ data: null, error: null });
  const noOpUser = () => Promise.resolve({ data: { user: null }, error: null });
  return {
    auth: {
      getUser: noOpUser,
      getSession: noOpUser,
      signInWithOAuth: () => Promise.resolve({ data: null, error: { message: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local" } }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
      insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
    channel: () => ({ on: () => ({ subscribe: () => () => {} }) }),
    removeChannel: () => {},
  };
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (typeof window !== "undefined") {
      console.warn("Supabase URL/Key missing. Add them to .env.local — see SETUP.md");
    }
    return createNoOpClient();
  }
  return createBrowserClient(url, key);
}
