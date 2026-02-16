import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function createNoOpServerClient() {
  const noOp = () => Promise.resolve({ data: null, error: null });
  const noOpUser = () => Promise.resolve({ data: { user: null }, error: null });
  return {
    auth: {
      getUser: noOpUser,
      exchangeCodeForSession: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
    },
    from: () => ({
      select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
    }),
  };
}

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return createNoOpServerClient();
  }

  const cookieStore = await cookies();

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore in Server Components
          }
        },
      },
    }
  );
}
