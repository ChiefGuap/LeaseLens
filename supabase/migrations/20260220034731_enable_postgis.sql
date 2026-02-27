-- =============================================================================
-- Migration: Enable PostGIS Extension
-- Description: Activates the PostGIS extension for geospatial queries.
-- =============================================================================

create extension if not exists postgis with schema extensions;
