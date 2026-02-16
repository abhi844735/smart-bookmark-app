import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, url, title, created_at")
    .order("created_at", { ascending: false });

  return (
    <DashboardClient initialBookmarks={bookmarks ?? []} user={user} />
  );
}
