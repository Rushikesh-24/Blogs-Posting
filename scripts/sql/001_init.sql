-- Initial schema for future Supabase wiring (not executed yet).
-- This script is safe to run on a new database. Adjust as needed if objects exist.

-- Enable UUID extension (id generation)
create extension if not exists "uuid-ossp";

-- Profiles (link to auth.users via user_id; optional until auth is wired)
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique,
  display_name text not null,
  bio text,
  avatar_url text,
  role text not null default 'user', -- 'user' | 'admin'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Posts
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null,
  title text not null,
  slug text unique,
  excerpt text,
  content text, -- consider moving to storage or splitting into blocks in future
  tags text[] default '{}',
  status text not null default 'published', -- 'draft' | 'published'
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Simple views counter to power "trending"
create table if not exists public.post_metrics (
  post_id uuid primary key references public.posts(id) on delete cascade,
  views bigint not null default 0
);

-- Indexes for search and sort
create index if not exists posts_published_at_idx on public.posts (published_at desc nulls last);
create index if not exists posts_title_trgm_idx on public.posts using gin (title gin_trgm_ops);
create index if not exists posts_excerpt_trgm_idx on public.posts using gin (excerpt gin_trgm_ops);
create index if not exists posts_tags_idx on public.posts using gin (tags);

-- RLS (enable and define basic policies; adjust after auth wiring)
alter table public.posts enable row level security;
alter table public.post_metrics enable row level security;
alter table public.profiles enable row level security;

-- Public read for published posts
drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts"
on public.posts for select
using (status = 'published');

-- Public read for metrics (aggregate views)
drop policy if exists "public read post metrics" on public.post_metrics;
create policy "public read post metrics"
on public.post_metrics for select
using (true);

-- Owners can manage their posts (placeholder; depends on auth.uid())
drop policy if exists "owners manage their posts" on public.posts;
create policy "owners manage their posts"
on public.posts for all
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

-- Admins can manage everything (assumes profiles.role = 'admin')
drop policy if exists "admins manage all posts" on public.posts;
create policy "admins manage all posts"
on public.posts for all
using (
  exists (
    select 1 from public.profiles pr
    where pr.user_id = auth.uid() and pr.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles pr
    where pr.user_id = auth.uid() and pr.role = 'admin'
  )
);
