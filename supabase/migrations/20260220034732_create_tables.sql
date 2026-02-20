-- =============================================================================
-- Migration: Create Core Tables (properties, violations, reviews)
-- Description: Sets up the three main tables for LeaseLens.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. properties
-- ---------------------------------------------------------------------------
create table public.properties (
  id              bigint generated always as identity primary key,
  name            text not null,
  address_normalized text not null,
  location        extensions.geometry(Point, 4326) not null,  -- WGS-84
  risk_score      numeric(5, 2) default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

comment on table  public.properties is 'Apartment / building records plotted on the map.';
comment on column public.properties.location is 'PostGIS point in SRID 4326 (lon/lat).';
comment on column public.properties.risk_score is 'Computed risk score (0–100) based on violation history.';

-- Spatial index for fast bounding-box & proximity queries
create index idx_properties_location on public.properties using gist (location);

-- B-tree index for address lookups
create index idx_properties_address on public.properties (address_normalized);

-- ---------------------------------------------------------------------------
-- 2. violations
-- ---------------------------------------------------------------------------
create table public.violations (
  id              bigint generated always as identity primary key,
  property_id     bigint not null references public.properties (id) on delete cascade,
  case_number     text not null unique,
  type            text not null,
  status          text not null default 'open',
  date            date not null,
  created_at      timestamptz default now()
);

comment on table  public.violations is 'Code-violation records linked to a property.';

create index idx_violations_property on public.violations (property_id);
create index idx_violations_status  on public.violations (status);

-- ---------------------------------------------------------------------------
-- 3. reviews
-- ---------------------------------------------------------------------------
create table public.reviews (
  id              bigint generated always as identity primary key,
  property_id     bigint not null references public.properties (id) on delete cascade,
  source          text not null,          -- e.g. 'google', 'yelp', 'user'
  rating          numeric(2, 1) not null, -- 0.0 – 5.0
  created_at      timestamptz default now()
);

comment on table  public.reviews is 'External and user-submitted reviews linked to a property.';

create index idx_reviews_property on public.reviews (property_id);
