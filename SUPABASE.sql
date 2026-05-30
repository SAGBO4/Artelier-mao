-- Supabase setup for artelier
--
-- 1) Run this in Supabase SQL editor
-- 2) Create a Storage bucket named: site (public)
-- 3) (Recommended) Limit writes to authenticated users only

-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  year text not null,
  type text not null,
  chapter text not null,
  ratio text not null default '4/5',
  tone text not null default 'warm',
  image_url text
);

-- Enable RLS
alter table public.projects enable row level security;

-- Public can read projects
drop policy if exists "projects_select_public" on public.projects;
create policy "projects_select_public"
on public.projects for select
to anon
using (true);

-- Only authenticated users can insert/update/delete
drop policy if exists "projects_modify_auth" on public.projects;
create policy "projects_modify_auth"
on public.projects for all
to authenticated
using (true)
with check (true);


-- Contacts table
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean not null default false
);

alter table public.contacts enable row level security;

-- Public can insert (submit contact form)
drop policy if exists "contacts_insert_public" on public.contacts;
create policy "contacts_insert_public"
on public.contacts for insert
to anon
with check (true);

-- Only authenticated users (admin) can select/update/delete
drop policy if exists "contacts_admin_all" on public.contacts;
create policy "contacts_admin_all"
on public.contacts for all
to authenticated
using (true)
with check (true);
