-- Lernvokabeln — accounts + cloud sync (Phase 1) backend.
-- Paste into Supabase → SQL Editor → Run. Then in Authentication → URL Configuration,
-- add the app URLs (localhost + your domain) as Redirect URLs so magic-link can return.

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  display_name text,
  created_at timestamptz default now()
);

create table if not exists progress (
  user_id uuid references auth.users on delete cascade,
  card_id text,                 -- stable id, e.g. "L1:A:Stoff"
  box int,                      -- passive/recognition box (0..5)
  abox int,                     -- active/production box (0..2)
  due bigint,                   -- next-due timestamp (ms)
  seen bool,
  updated_at timestamptz default now(),
  primary key (user_id, card_id)
);

alter table profiles enable row level security;
alter table progress enable row level security;

-- each user can only read/write their own rows (enforced by the database, not the client)
create policy "own profile"  on profiles for all using (auth.uid() = id)      with check (auth.uid() = id);
create policy "own progress" on progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
