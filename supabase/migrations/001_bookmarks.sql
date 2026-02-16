-- Bookmark manager: table + RLS + Realtime
-- Run this in Supabase Dashboard → SQL Editor (or via Supabase CLI)

-- Table: one row per bookmark, tied to auth.users
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  title text not null,
  created_at timestamptz not null default now()
);

-- Index for fast lookups by user
create index if not exists bookmarks_user_id_idx on public.bookmarks(user_id);

-- Enable Row Level Security (RLS) so users only see their own data
alter table public.bookmarks enable row level security;

-- Policy: users can only SELECT their own bookmarks
create policy "Users can read own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

-- Policy: users can only INSERT their own bookmarks (user_id must match)
create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

-- Policy: users can only DELETE their own bookmarks
create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Required so Realtime sends full row in DELETE/UPDATE payloads (other tabs get id to remove)
alter table public.bookmarks replica identity full;

-- Enable Realtime so other tabs/clients get live updates
alter publication supabase_realtime add table public.bookmarks;
