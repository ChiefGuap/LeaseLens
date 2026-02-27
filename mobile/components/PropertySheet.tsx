import React, { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheet, {
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Property, getLatitude, getLongitude } from "../types/property";

interface PropertySheetProps {
    property: Property | null;
}

/**
 * A bottom-sheet overlay that displays details for the selected property.
 * Snap points: collapsed (5%) and half-screen (50%).
 */
const PropertySheet = forwardRef<BottomSheet, PropertySheetProps>(
    ({ property }, ref) => {
        const snapPoints = useMemo(() => ["5%", "50%"], []);

        const getRiskColor = useCallback((score: number): string => {
            if (score >= 7) return "#EF4444"; // red
            if (score >= 4) return "#F59E0B"; // amber
            return "#22C55E"; // green
        }, []);

        const getRiskLabel = useCallback((score: number): string => {
            if (score >= 7) return "High Risk";
            if (score >= 4) return "Moderate Risk";
            return "Low Risk";
        }, []);

        return (
            <BottomSheet
                ref={ref}
                index={0}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                backgroundStyle={styles.sheetBackground}
                handleIndicatorStyle={styles.handleIndicator}
            >
                <BottomSheetView style={styles.contentContainer}>
                    {property ? (
                        <>
                            <Text style={styles.propertyName}>{property.name}</Text>

                            <View style={styles.scoreRow}>
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
                                <Text
                                    style={[
                                        styles.riskLabel,
                                        { color: getRiskColor(property.risk_score) },
                                    ]}
                                >
                                    {getRiskLabel(property.risk_score)}
                                </Text>
                            </View>

                            <View style={styles.divider} />

                            <Text style={styles.sectionTitle}>Property Details</Text>
                            <Text style={styles.detailText}>
                                Risk Score: {property.risk_score} / 10
                            </Text>
                            <Text style={styles.coordsText}>
                                📍 {getLatitude(property).toFixed(4)}, {getLongitude(property).toFixed(4)}
                            </Text>
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
                </BottomSheetView>
            </BottomSheet>
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
    propertyName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#CDD6F4",
        marginBottom: 12,
    },
    scoreRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },
    scoreBadge: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    scoreValue: {
        fontSize: 18,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    riskLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "#313244",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#A6ADC8",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 8,
    },
    detailText: {
        fontSize: 15,
        color: "#BAC2DE",
        marginBottom: 4,
    },
    coordsText: {
        fontSize: 13,
        color: "#6C7086",
        marginTop: 4,
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 40,
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
