/**
 * GeoJSON Point returned by PostgREST for a PostGIS geography column.
 */
export interface GeoJSONPoint {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
}

/**
 * Represents a row from the Supabase `properties` table.
 */
export interface Property {
    id: string;
    name: string;
    location: GeoJSONPoint;
    risk_score: number;
    created_at?: string;
    updated_at?: string;
}

/**
 * Convenience helpers to extract lat/lng from a GeoJSON point.
 */
export function getLatitude(property: Property): number {
    return property.location.coordinates[1];
}

export function getLongitude(property: Property): number {
    return property.location.coordinates[0];
}
