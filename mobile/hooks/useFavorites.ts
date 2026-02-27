import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

interface UseFavoritesResult {
    favoriteIds: Set<number>;
    loading: boolean;
    toggleFavorite: (propertyId: number) => Promise<void>;
    isFavorite: (propertyId: number) => boolean;
}

/**
 * Manages the user's favorite properties.
 * Fetches all favorites on mount, provides toggle and check functions.
 */
export function useFavorites(): UseFavoritesResult {
    const { user } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            setFavoriteIds(new Set());
            return;
        }

        let cancelled = false;

        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("favorites")
                    .select("property_id")
                    .eq("user_id", user.id);

                if (!error && data && !cancelled) {
                    setFavoriteIds(
                        new Set(data.map((f: { property_id: number }) => f.property_id))
                    );
                }
            } catch {
                // Silently fail — favorites are non-critical
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchFavorites();
        return () => { cancelled = true; };
    }, [user]);

    const isFavorite = useCallback(
        (propertyId: number): boolean => favoriteIds.has(propertyId),
        [favoriteIds]
    );

    const toggleFavorite = useCallback(
        async (propertyId: number): Promise<void> => {
            if (!user) return;

            if (favoriteIds.has(propertyId)) {
                // Remove
                setFavoriteIds((prev) => {
                    const next = new Set(prev);
                    next.delete(propertyId);
                    return next;
                });

                await supabase
                    .from("favorites")
                    .delete()
                    .eq("user_id", user.id)
                    .eq("property_id", propertyId);
            } else {
                // Add
                setFavoriteIds((prev) => new Set(prev).add(propertyId));

                await supabase
                    .from("favorites")
                    .insert({ user_id: user.id, property_id: propertyId });
            }
        },
        [user, favoriteIds]
    );

    return { favoriteIds, loading, toggleFavorite, isFavorite };
}
