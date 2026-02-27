import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import {
    Property,
    Violation,
    getLatitude,
    getLongitude,
} from "../types/property";
import { useViolations } from "../hooks/useViolations";
import { useReviews } from "../hooks/useReviews";
import ReviewCard from "./ReviewCard";
import ViolationDetailModal from "./ViolationDetailModal";

interface PropertySheetProps {
    property: Property | null;
    onToggleFavorite?: () => void;
    isFavorite?: boolean;
    onReportPress?: () => void;
}

type Tab = "violations" | "reviews";

const PropertySheet = forwardRef<BottomSheet, PropertySheetProps>(
    ({ property, onToggleFavorite, isFavorite = false, onReportPress }, ref) => {
        const snapPoints = useMemo(() => ["5%", "65%"], []);
        const [activeTab, setActiveTab] = useState<Tab>("violations");
        const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);

        const { violations, loading: violationsLoading } = useViolations(
            property ? Number(property.id) : null
        );
        const { reviews, loading: reviewsLoading } = useReviews(
            property ? Number(property.id) : null
        );

        const getRiskColor = useCallback((score: number): string => {
            if (score >= 7) return "#EF4444";
            if (score >= 4) return "#F59E0B";
            return "#22C55E";
        }, []);

        const getRiskLabel = useCallback((score: number): string => {
            if (score >= 7) return "High Risk";
            if (score >= 4) return "Moderate Risk";
            return "Low Risk";
        }, []);

        const averageRating = useMemo(() => {
            if (reviews.length === 0) return null;
            const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
            return sum / reviews.length;
        }, [reviews]);

        return (
            <>
                <BottomSheet
                    ref={ref}
                    index={0}
                    snapPoints={snapPoints}
                    enablePanDownToClose={false}
                    backgroundStyle={styles.sheetBackground}
                    handleIndicatorStyle={styles.handleIndicator}
                >
                    <BottomSheetScrollView style={styles.contentContainer}>
                        {property ? (
                            <>
                                {/* Header row with name + favorite */}
                                <View style={styles.headerRow}>
                                    <Text style={styles.propertyName} numberOfLines={2}>
                                        {property.name}
                                    </Text>
                                    {onToggleFavorite && (
                                        <Pressable
                                            onPress={onToggleFavorite}
                                            style={styles.favoriteButton}
                                        >
                                            <Ionicons
                                                name={isFavorite ? "heart" : "heart-outline"}
                                                size={24}
                                                color={isFavorite ? "#EF4444" : "#6C7086"}
                                            />
                                        </Pressable>
                                    )}
                                </View>

                                {/* Risk + rating row */}
                                <View style={styles.metricsRow}>
                                    <View style={styles.metricCard}>
                                        <View
                                            style={[
                                                styles.scoreBadge,
                                                { backgroundColor: getRiskColor(property.risk_score) },
                                            ]}
                                        >
                                            <Text style={styles.scoreValue}>
                                                {property.risk_score.toFixed(1)}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text
                                                style={[
                                                    styles.riskLabel,
                                                    { color: getRiskColor(property.risk_score) },
                                                ]}
                                            >
                                                {getRiskLabel(property.risk_score)}
                                            </Text>
                                            <Text style={styles.metricSubtext}>Risk Score</Text>
                                        </View>
                                    </View>

                                    {averageRating !== null && (
                                        <View style={styles.metricCard}>
                                            <View style={styles.ratingBadge}>
                                                <Ionicons name="star" size={16} color="#F59E0B" />
                                                <Text style={styles.ratingNumber}>
                                                    {averageRating.toFixed(1)}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text style={styles.ratingLabel}>Avg Rating</Text>
                                                <Text style={styles.metricSubtext}>
                                                    {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>

                                <Text style={styles.coordsText}>
                                    📍 {getLatitude(property).toFixed(4)},{" "}
                                    {getLongitude(property).toFixed(4)}
                                </Text>

                                {/* Tab bar */}
                                <View style={styles.tabBar}>
                                    <Pressable
                                        style={[
                                            styles.tab,
                                            activeTab === "violations" && styles.tabActive,
                                        ]}
                                        onPress={() => setActiveTab("violations")}
                                    >
                                        <Ionicons
                                            name="warning"
                                            size={14}
                                            color={
                                                activeTab === "violations"
                                                    ? "#89B4FA"
                                                    : "#6C7086"
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.tabText,
                                                activeTab === "violations" && styles.tabTextActive,
                                            ]}
                                        >
                                            Violations
                                        </Text>
                                        {violations.length > 0 && (
                                            <View style={styles.tabBadge}>
                                                <Text style={styles.tabBadgeText}>
                                                    {violations.length}
                                                </Text>
                                            </View>
                                        )}
                                    </Pressable>

                                    <Pressable
                                        style={[
                                            styles.tab,
                                            activeTab === "reviews" && styles.tabActive,
                                        ]}
                                        onPress={() => setActiveTab("reviews")}
                                    >
                                        <Ionicons
                                            name="star"
                                            size={14}
                                            color={
                                                activeTab === "reviews"
                                                    ? "#89B4FA"
                                                    : "#6C7086"
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.tabText,
                                                activeTab === "reviews" && styles.tabTextActive,
                                            ]}
                                        >
                                            Reviews
                                        </Text>
                                        {reviews.length > 0 && (
                                            <View style={[styles.tabBadge, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
                                                <Text style={[styles.tabBadgeText, { color: "#F59E0B" }]}>
                                                    {reviews.length}
                                                </Text>
                                            </View>
                                        )}
                                    </Pressable>
                                </View>

                                {/* Tab content */}
                                {activeTab === "violations" ? (
                                    <>
                                        {violationsLoading ? (
                                            <ActivityIndicator
                                                size="small"
                                                color="#89B4FA"
                                                style={{ marginTop: 16 }}
                                            />
                                        ) : violations.length > 0 ? (
                                            <View style={styles.listContainer}>
                                                {violations.map((v) => (
                                                    <Pressable
                                                        key={v.id}
                                                        style={({ pressed }) => [
                                                            styles.violationCard,
                                                            pressed && styles.cardPressed,
                                                        ]}
                                                        onPress={() => setSelectedViolation(v)}
                                                    >
                                                        <View style={styles.violationHeader}>
                                                            <Text style={styles.violationType}>
                                                                {v.type}
                                                            </Text>
                                                            <View
                                                                style={[
                                                                    styles.statusBadge,
                                                                    {
                                                                        backgroundColor:
                                                                            v.status === "open"
                                                                                ? "rgba(239,68,68,0.15)"
                                                                                : "rgba(108,112,134,0.15)",
                                                                    },
                                                                ]}
                                                            >
                                                                <Text
                                                                    style={[
                                                                        styles.statusText,
                                                                        {
                                                                            color:
                                                                                v.status === "open"
                                                                                    ? "#EF4444"
                                                                                    : "#6C7086",
                                                                        },
                                                                    ]}
                                                                >
                                                                    {v.status.toUpperCase()}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.violationFooter}>
                                                            <Text style={styles.violationMeta}>
                                                                {v.case_number} · {v.date}
                                                            </Text>
                                                            <Ionicons
                                                                name="chevron-forward"
                                                                size={14}
                                                                color="#45475A"
                                                            />
                                                        </View>
                                                    </Pressable>
                                                ))}
                                            </View>
                                        ) : (
                                            <Text style={styles.emptyText}>
                                                ✅ No violations on record
                                            </Text>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {reviewsLoading ? (
                                            <ActivityIndicator
                                                size="small"
                                                color="#89B4FA"
                                                style={{ marginTop: 16 }}
                                            />
                                        ) : reviews.length > 0 ? (
                                            <View style={styles.listContainer}>
                                                {reviews.map((r) => (
                                                    <ReviewCard key={r.id} review={r} />
                                                ))}
                                            </View>
                                        ) : (
                                            <Text style={styles.emptyText}>
                                                No reviews yet
                                            </Text>
                                        )}
                                    </>
                                )}

                                {/* Report button */}
                                {onReportPress && (
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.reportButton,
                                            pressed && styles.reportButtonPressed,
                                        ]}
                                        onPress={onReportPress}
                                    >
                                        <Ionicons name="flag" size={16} color="#F59E0B" />
                                        <Text style={styles.reportButtonText}>
                                            Report an Issue
                                        </Text>
                                    </Pressable>
                                )}
                            </>
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyIcon}>🏠</Text>
                                <Text style={styles.emptyTitle}>Select a Property</Text>
                                <Text style={styles.emptySubtitle}>
                                    Tap a marker on the map to view details
                                </Text>
                            </View>
                        )}
                    </BottomSheetScrollView>
                </BottomSheet>

                {/* Violation detail modal */}
                <ViolationDetailModal
                    violation={selectedViolation}
                    visible={selectedViolation !== null}
                    onClose={() => setSelectedViolation(null)}
                />
            </>
        );
    }
);

PropertySheet.displayName = "PropertySheet";
export default PropertySheet;

const styles = StyleSheet.create({
    sheetBackground: {
        backgroundColor: "#1E1E2E",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    handleIndicator: {
        backgroundColor: "#6C7086",
        width: 40,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 8,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    propertyName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#CDD6F4",
        flex: 1,
        marginRight: 12,
    },
    favoriteButton: {
        padding: 4,
    },
    metricsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 8,
    },
    metricCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    scoreBadge: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    scoreValue: {
        fontSize: 16,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    riskLabel: {
        fontSize: 14,
        fontWeight: "600",
    },
    ratingBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(245, 158, 11, 0.15)",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 12,
    },
    ratingNumber: {
        fontSize: 16,
        fontWeight: "800",
        color: "#F59E0B",
    },
    ratingLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#CDD6F4",
    },
    metricSubtext: {
        fontSize: 11,
        color: "#6C7086",
        marginTop: 1,
    },
    coordsText: {
        fontSize: 13,
        color: "#6C7086",
        marginBottom: 16,
    },
    tabBar: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#313244",
        paddingBottom: 12,
    },
    tab: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "transparent",
    },
    tabActive: {
        backgroundColor: "rgba(137, 180, 250, 0.1)",
    },
    tabText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6C7086",
    },
    tabTextActive: {
        color: "#89B4FA",
    },
    tabBadge: {
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 8,
    },
    tabBadgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#EF4444",
    },
    listContainer: {
        gap: 0,
        marginTop: 4,
    },
    violationCard: {
        backgroundColor: "#313244",
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
    },
    cardPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    violationHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    violationType: {
        fontSize: 15,
        fontWeight: "600",
        color: "#CDD6F4",
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    violationFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    violationMeta: {
        fontSize: 12,
        color: "#6C7086",
    },
    emptyText: {
        fontSize: 14,
        color: "#A6ADC8",
        marginTop: 16,
        textAlign: "center",
    },
    reportButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderRadius: 14,
        paddingVertical: 14,
        marginTop: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: "rgba(245, 158, 11, 0.2)",
    },
    reportButtonPressed: {
        opacity: 0.7,
    },
    reportButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#F59E0B",
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 40,
        paddingTop: 40,
    },
    emptyIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#CDD6F4",
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 14,
        color: "#6C7086",
    },
});
