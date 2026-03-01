create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  data jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.samples (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  name text not null,
  file_path text not null,
  mime_type text,
  size_bytes integer,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.samples enable row level security;

drop policy if exists "read public projects" on public.projects;
create policy "read public projects"
on public.projects
for select
using (is_public = true or auth.uid() = owner_id);

drop policy if exists "insert own projects" on public.projects;
create policy "insert own projects"
on public.projects
for insert
with check (auth.uid() = owner_id);

drop policy if exists "update own projects" on public.projects;
create policy "update own projects"
on public.projects
for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "read own samples" on public.samples;
create policy "read own samples"
on public.samples
for select
using (auth.uid() = owner_id);

drop policy if exists "insert own samples" on public.samples;
create policy "insert own samples"
on public.samples
for insert
with check (auth.uid() = owner_id);
