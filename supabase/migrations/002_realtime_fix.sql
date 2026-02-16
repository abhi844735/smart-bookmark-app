-- Run this in Supabase SQL Editor if real-time updates don't work across tabs.
-- (Safe to run even if already applied.)

-- 1. So DELETE/UPDATE events include full row in payload (other tabs can sync)
alter table public.bookmarks replica identity full;

-- 2. Ensure table is in Realtime publication (no-op if already added)
alter publication supabase_realtime add table public.bookmarks;
