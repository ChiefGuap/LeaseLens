import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Review } from "../types/property";

interface ReviewCardProps {
    review: Review;
}

const SOURCE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
    yelp: { icon: "star", color: "#EF4444", label: "Yelp" },
    google: { icon: "logo-google", color: "#4285F4", label: "Google" },
    user: { icon: "person", color: "#89B4FA", label: "User" },
};

/**
 * Displays a single review with source icon, star rating, and visual bar.
 */
export default function ReviewCard({ review }: ReviewCardProps): React.ReactElement {
    const config = SOURCE_CONFIG[review.source] ?? SOURCE_CONFIG.user;
    const starCount = Math.round(review.rating);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={[styles.sourceBadge, { backgroundColor: `${config.color}20` }]}>
                    <Ionicons
                        name={config.icon as any}
                        size={14}
                        color={config.color}
                    />
                    <Text style={[styles.sourceLabel, { color: config.color }]}>
                        {config.label}
                    </Text>
                </View>
                <Text style={styles.ratingValue}>{review.rating.toFixed(1)}</Text>
            </View>

            {/* Stars */}
            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons
                        key={i}
                        name={i <= starCount ? "star" : "star-outline"}
                        size={16}
                        color={i <= starCount ? "#F59E0B" : "#45475A"}
                    />
                ))}
            </View>

            {/* Rating bar */}
            <View style={styles.ratingBar}>
                <View
                    style={[
                        styles.ratingFill,
                        {
                            width: `${(review.rating / 5) * 100}%`,
                            backgroundColor: config.color,
                        },
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#313244",
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    sourceBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    sourceLabel: {
        fontSize: 12,
        fontWeight: "700",
    },
    ratingValue: {
        fontSize: 18,
        fontWeight: "800",
        color: "#CDD6F4",
    },
    starsRow: {
        flexDirection: "row",
        gap: 2,
        marginBottom: 8,
    },
    ratingBar: {
        height: 4,
        backgroundColor: "#45475A",
        borderRadius: 2,
        overflow: "hidden",
    },
    ratingFill: {
        height: 4,
        borderRadius: 2,
    },
});
