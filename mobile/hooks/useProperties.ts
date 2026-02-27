import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Property } from "../types/property";

interface UsePropertiesResult {
    properties: Property[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Fetches all properties from the Supabase `properties` table.
 * Returns typed data along with loading and error states.
 */
export function useProperties(): UsePropertiesResult {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProperties = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: supabaseError } = await supabase
                .from("properties")
                .select("id, name, location, risk_score");

            if (supabaseError) {
                throw new Error(supabaseError.message);
            }

            setProperties((data as Property[]) ?? []);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to fetch properties";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    return { properties, loading, error, refetch: fetchProperties };
}
