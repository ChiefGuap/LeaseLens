-- =============================================================================
-- Migration: Stored Procedure — properties_in_view
-- Description: Returns all properties whose location falls within the
--              bounding box visible on the user's phone screen.
-- =============================================================================

create or replace function public.properties_in_view(
  min_lat  double precision,
  min_long double precision,
  max_lat  double precision,
  max_long double precision
)
returns setof public.properties
language sql
stable
as $$
  select *
  from   public.properties
  where  location operator(extensions.&&) extensions.st_makeenvelope(
           min_long, min_lat,   -- lower-left  (x_min, y_min)
           max_long, max_lat,   -- upper-right (x_max, y_max)
           4326                 -- SRID: WGS-84
         );
$$;

comment on function public.properties_in_view is
  'Returns properties within the supplied lat/long bounding box using PostGIS && intersection. '
  'Designed to be called from a mobile map view to fetch only visible markers.';
