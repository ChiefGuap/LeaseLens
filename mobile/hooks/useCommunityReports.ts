import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export interface CommunityReport {
    id: number;
    user_id: string;
    property_id: number;
    type: string;
    description: string;
    status: string;
    created_at: string;
}

interface UseCommunityReportsResult {
    reports: CommunityReport[];
    loading: boolean;
    submitReport: (
        propertyId: number,
        type: string,
        description: string
    ) => Promise<string | null>;
}

/**
 * Fetches community reports for a property and allows submitting new ones.
 */
export function useCommunityReports(
    propertyId: number | null
): UseCommunityReportsResult {
    const { user } = useAuth();
    const [reports, setReports] = useState<CommunityReport[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (propertyId === null) {
            setReports([]);
            return;
        }

        let cancelled = false;

        const fetch = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("community_reports")
                    .select("*")
                    .eq("property_id", propertyId)
                    .order("created_at", { ascending: false });

                if (!error && data && !cancelled) {
                    setReports(data as CommunityReport[]);
                }
            } catch {
                // Non-critical
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetch();
        return () => { cancelled = true; };
    }, [propertyId]);

    const submitReport = useCallback(
        async (
            pid: number,
            type: string,
            description: string
        ): Promise<string | null> => {
            if (!user) return "You must be signed in to report an issue";

            const { error } = await supabase.from("community_reports").insert({
                user_id: user.id,
                property_id: pid,
                type,
                description,
            });

            if (error) return error.message;

            // Refresh the list
            const { data: newData } = await supabase
                .from("community_reports")
                .select("*")
                .eq("property_id", pid)
                .order("created_at", { ascending: false });

            if (newData) setReports(newData as CommunityReport[]);
            return null;
        },
        [user]
    );

    return { reports, loading, submitReport };
}
