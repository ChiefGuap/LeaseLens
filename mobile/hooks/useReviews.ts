import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Review } from "../types/property";

interface UseReviewsResult {
    reviews: Review[];
    loading: boolean;
    error: string | null;
}

/**
 * Fetches reviews for a specific property from the Supabase `reviews` table.
 */
export function useReviews(propertyId: number | null): UseReviewsResult {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (propertyId === null) {
            setReviews([]);
            return;
        }

        let cancelled = false;

        const fetchReviews = async (): Promise<void> => {
            try {
                setLoading(true);
                setError(null);

                const { data, error: supabaseError } = await supabase
                    .from("reviews")
                    .select("id, property_id, source, rating, created_at")
                    .eq("property_id", propertyId)
                    .order("created_at", { ascending: false });

                if (supabaseError) {
                    throw new Error(supabaseError.message);
                }

                if (!cancelled) {
                    setReviews((data as Review[]) ?? []);
                }
            } catch (err) {
                if (!cancelled) {
                    const message =
                        err instanceof Error
                            ? err.message
                            : "Failed to fetch reviews";
                    setError(message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchReviews();

        return () => {
            cancelled = true;
        };
    }, [propertyId]);

    return { reviews, loading, error };
}
