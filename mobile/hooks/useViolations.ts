import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Violation } from "../types/property";

interface UseViolationsResult {
    violations: Violation[];
    loading: boolean;
    error: string | null;
}

/**
 * Fetches violations for a specific property from the Supabase `violations` table.
 * Automatically refetches when propertyId changes.
 */
export function useViolations(propertyId: number | null): UseViolationsResult {
    const [violations, setViolations] = useState<Violation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (propertyId === null) {
            setViolations([]);
            return;
        }

        let cancelled = false;

        const fetchViolations = async (): Promise<void> => {
            try {
                setLoading(true);
                setError(null);

                const { data, error: supabaseError } = await supabase
                    .from("violations")
                    .select("id, property_id, case_number, type, status, date")
                    .eq("property_id", propertyId)
                    .order("date", { ascending: false });

                if (supabaseError) {
                    throw new Error(supabaseError.message);
                }

                if (!cancelled) {
                    setViolations((data as Violation[]) ?? []);
                }
            } catch (err) {
                if (!cancelled) {
                    const message =
                        err instanceof Error
                            ? err.message
                            : "Failed to fetch violations";
                    setError(message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchViolations();

        return () => {
            cancelled = true;
        };
    }, [propertyId]);

    return { violations, loading, error };
}
