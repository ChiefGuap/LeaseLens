-- =============================================================================
-- Migration: Create favorites and community_reports tables
-- =============================================================================

-- User-bookmarked properties
create table public.favorites (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  property_id bigint not null references public.properties(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, property_id)
);

create index idx_favorites_user on public.favorites (user_id);

-- Enable RLS
alter table public.favorites enable row level security;

create policy "Users can view own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Community-submitted violation reports
create table public.community_reports (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  property_id bigint not null references public.properties(id) on delete cascade,
  type        text not null,
  description text not null,
  status      text default 'pending',
  created_at  timestamptz default now()
);

create index idx_community_reports_property on public.community_reports (property_id);

-- Enable RLS
alter table public.community_reports enable row level security;

create policy "Anyone can view community reports"
  on public.community_reports for select
  using (true);

create policy "Authenticated users can submit reports"
  on public.community_reports for insert
  with check (auth.uid() = user_id);

-- Enable RLS on existing tables for read access
alter table public.properties enable row level security;
create policy "Anyone can view properties" on public.properties for select using (true);

alter table public.violations enable row level security;
create policy "Anyone can view violations" on public.violations for select using (true);

alter table public.reviews enable row level security;
create policy "Anyone can view reviews" on public.reviews for select using (true);
