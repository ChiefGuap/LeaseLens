/**
 * Represents a row from the Supabase `properties` table.
 */
export interface Property {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    risk_score: number;
}
