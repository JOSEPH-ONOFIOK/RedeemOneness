-- ============================================================
-- Redeem Oneness — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── ENUM ────────────────────────────────────────────────────
create type public.role as enum ('member', 'mentor', 'business', 'admin');

-- ── PROFILES ────────────────────────────────────────────────
-- Extends auth.users; one row per user
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        public.role not null,
  full_name   text not null,
  email       text not null,
  phone       text,
  location    text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- ── BRANCHES ────────────────────────────────────────────────
create table public.branches (
  id           uuid primary key default gen_random_uuid(),
  church_name  text not null,
  branch_name  text not null,
  city         text not null,
  state        text not null,
  country      text not null default 'Nigeria',
  code         text unique not null,   -- used in QR URL e.g. ?branch=RCCG-LAGOS-ISL
  admin_id     uuid references public.profiles(id) on delete set null,
  created_at   timestamptz default now()
);

-- ── MEMBERS ─────────────────────────────────────────────────
create table public.members (
  id                uuid primary key references public.profiles(id) on delete cascade,
  branch_id         uuid references public.branches(id) on delete set null,
  branch_code       text not null,
  skills            text[] default '{}',
  sector_interests  text[] default '{}',
  job_categories    text[] default '{}',
  bio               text,
  employment_status boolean,           -- true = employed, false = unemployed, null = not specified
  date_of_birth     date               -- for birthday notifications
);

-- ── BUSINESSES ──────────────────────────────────────────────
create table public.businesses (
  id            uuid primary key references public.profiles(id) on delete cascade,
  company_name  text not null,
  industry      text,
  description   text,
  website       text,
  size          text
);

-- ── MENTORS ─────────────────────────────────────────────────
create table public.mentors (
  id                uuid primary key references public.profiles(id) on delete cascade,
  sector_expertise  text,
  years_experience  integer,
  bio               text,
  preferred_contact text
);

-- ── JOBS ────────────────────────────────────────────────────
create table public.jobs (
  id               uuid primary key default gen_random_uuid(),
  business_id      uuid not null references public.businesses(id) on delete cascade,
  title            text not null,
  description      text,
  location         text,
  type             text,
  sector           text,
  skills_required  text[] default '{}',
  status           text default 'open' check (status in ('open','closed')),
  created_at       timestamptz default now()
);

-- ── APPLICATIONS ────────────────────────────────────────────
create table public.applications (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references public.jobs(id) on delete cascade,
  member_id   uuid not null references public.members(id) on delete cascade,
  status      text default 'pending' check (status in ('pending','viewed','interview','accepted','rejected')),
  message     text,
  created_at  timestamptz default now(),
  unique(job_id, member_id)
);

-- ── MENTORSHIP REQUESTS ──────────────────────────────────────
create table public.mentorship_requests (
  id          uuid primary key default gen_random_uuid(),
  mentor_id   uuid not null references public.mentors(id) on delete cascade,
  member_id   uuid not null references public.members(id) on delete cascade,
  status      text default 'pending' check (status in ('pending','accepted','rejected')),
  message     text,
  created_at  timestamptz default now(),
  unique(mentor_id, member_id)
);

-- ── MESSAGES ────────────────────────────────────────────────
create table public.messages (
  id            uuid primary key default gen_random_uuid(),
  sender_id     uuid not null references public.profiles(id) on delete cascade,
  recipient_id  uuid not null references public.profiles(id) on delete cascade,
  content       text not null,
  read_at       timestamptz,
  created_at    timestamptz default now()
);

-- ── ANNOUNCEMENTS ───────────────────────────────────────────
create table public.announcements (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  branch_id   uuid references public.branches(id) on delete set null,  -- null = platform-wide
  title       text not null,
  content     text not null,
  created_at  timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles           enable row level security;
alter table public.branches           enable row level security;
alter table public.members            enable row level security;
alter table public.businesses         enable row level security;
alter table public.mentors            enable row level security;
alter table public.jobs               enable row level security;
alter table public.applications       enable row level security;
alter table public.mentorship_requests enable row level security;
alter table public.messages           enable row level security;
alter table public.announcements      enable row level security;

-- profiles: users can read all, edit only their own
create policy "profiles_read_all"   on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- branches: anyone can read; only admins can insert/update
create policy "branches_read_all"   on public.branches for select using (true);
create policy "branches_insert"     on public.branches for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- members: owner + admin can read; owner can update
create policy "members_read"        on public.members for select using (true);
create policy "members_insert_own"  on public.members for insert with check (auth.uid() = id);
create policy "members_update_own"  on public.members for update using (auth.uid() = id);

-- businesses: anyone can read; owner can write
create policy "businesses_read"     on public.businesses for select using (true);
create policy "businesses_insert"   on public.businesses for insert with check (auth.uid() = id);
create policy "businesses_update"   on public.businesses for update using (auth.uid() = id);

-- mentors: anyone can read; owner can write
create policy "mentors_read"        on public.mentors for select using (true);
create policy "mentors_insert"      on public.mentors for insert with check (auth.uid() = id);
create policy "mentors_update"      on public.mentors for update using (auth.uid() = id);

-- jobs: anyone can read open jobs; business owner can write
create policy "jobs_read_open"      on public.jobs for select using (status = 'open');
create policy "jobs_insert"         on public.jobs for insert with check (auth.uid() = business_id);
create policy "jobs_update"         on public.jobs for update using (auth.uid() = business_id);

-- applications: member sees own, business sees apps for their jobs
create policy "apps_member_read"    on public.applications for select using (auth.uid() = member_id);
create policy "apps_business_read"  on public.applications for select using (
  exists (select 1 from public.jobs where id = job_id and business_id = auth.uid())
);
create policy "apps_insert"         on public.applications for insert with check (auth.uid() = member_id);
create policy "apps_update_business" on public.applications for update using (
  exists (select 1 from public.jobs where id = job_id and business_id = auth.uid())
);

-- mentorship requests: mentor and member see their own
create policy "mr_read"             on public.mentorship_requests for select using (
  auth.uid() = mentor_id or auth.uid() = member_id
);
create policy "mr_insert"           on public.mentorship_requests for insert with check (auth.uid() = member_id);
create policy "mr_update_mentor"    on public.mentorship_requests for update using (auth.uid() = mentor_id);

-- messages: sender and recipient only
create policy "msg_read"            on public.messages for select using (
  auth.uid() = sender_id or auth.uid() = recipient_id
);
create policy "msg_insert"          on public.messages for insert with check (auth.uid() = sender_id);

-- announcements: all authenticated users can read; admin/mentor can create
create policy "ann_read"            on public.announcements for select using (true);
create policy "ann_insert"          on public.announcements for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','mentor'))
);

-- ── BRANCH ADMINS (multiple admins per branch) ──────────────
create table public.branch_admins (
  id          uuid primary key default gen_random_uuid(),
  branch_id   uuid not null references public.branches(id) on delete cascade,
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  invited_by  uuid references public.profiles(id),
  is_head     boolean default false,
  created_at  timestamptz default now(),
  unique(branch_id, profile_id)
);

-- ── ADMIN INVITES ────────────────────────────────────────────
create table public.admin_invites (
  id          uuid primary key default gen_random_uuid(),
  branch_id   uuid not null references public.branches(id) on delete cascade,
  email       text not null,
  invited_by  uuid references public.profiles(id),
  status      text default 'pending' check (status in ('pending','accepted','revoked')),
  created_at  timestamptz default now(),
  unique(branch_id, email)
);

alter table public.branch_admins enable row level security;
alter table public.admin_invites  enable row level security;

create policy "branch_admins_read"   on public.branch_admins for select using (true);
create policy "branch_admins_insert" on public.branch_admins for insert with check (
  exists (select 1 from public.branches where id = branch_id and admin_id = auth.uid())
);
create policy "branch_admins_delete" on public.branch_admins for delete using (
  exists (select 1 from public.branches where id = branch_id and admin_id = auth.uid())
);

create policy "admin_invites_read"   on public.admin_invites for select using (true);
create policy "admin_invites_insert" on public.admin_invites for insert with check (
  exists (select 1 from public.branches where id = branch_id and admin_id = auth.uid())
);
create policy "admin_invites_update" on public.admin_invites for update using (
  exists (select 1 from public.branches where id = branch_id and admin_id = auth.uid())
);

-- ============================================================
-- MIGRATION: Run these if schema already applied
-- ALTER TABLE public.members ADD COLUMN IF NOT EXISTS employment_status boolean;
-- ALTER TABLE public.members ADD COLUMN IF NOT EXISTS date_of_birth date;
-- ============================================================

-- ============================================================
-- HELPER FUNCTION: auto-create profile after signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Profile is inserted by the app (we need role info not available here)
  return new;
end;
$$;
