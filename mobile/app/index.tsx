import React, { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import { useProperties } from "../hooks/useProperties";
import PropertySheet from "../components/PropertySheet";
import { Property } from "../types/property";

/** Davis, CA center coordinates */
const DAVIS_REGION: Region = {
    latitude: 38.5382,
    longitude: -121.7617,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
};

/**
 * Returns a hex color based on the risk_score.
 *   ≤ 3 → green, 4–6 → amber, ≥ 7 → red
 */
function getMarkerColor(score: number): string {
    if (score >= 7) return "#EF4444";
    if (score >= 4) return "#F59E0B";
    return "#22C55E";
}

/**
 * Main map screen – renders the full-screen MapView,
 * property markers, and the bottom-sheet overlay.
 */
export default function MapScreen(): React.ReactElement {
    const { properties, loading, error } = useProperties();
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(
        null
    );
    const [mapReady, setMapReady] = useState<boolean>(false);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleMarkerPress = useCallback(
        (property: Property) => {
            setSelectedProperty(property);
            bottomSheetRef.current?.snapToIndex(1); // snap to 50%
        },
        []
    );

    const handleMapReady = useCallback(() => {
        setMapReady(true);
    }, []);

    // ── Loading state ────────────────────────────────────
    if (!mapReady || loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#89B4FA" />
                <Text style={styles.loadingText}>Loading LeaseLens…</Text>

                {/* Render map off-screen so onMapReady fires */}
                {!mapReady && (
                    <MapView
                        style={styles.hiddenMap}
                        initialRegion={DAVIS_REGION}
                        onMapReady={handleMapReady}
                    />
                )}
            </View>
        );
    }

    // ── Error state ──────────────────────────────────────
    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorTitle}>Something went wrong</Text>
                <Text style={styles.errorMessage}>{error}</Text>
            </View>
        );
    }

    // ── Main map ─────────────────────────────────────────
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={DAVIS_REGION}
                showsUserLocation
                showsMyLocationButton
            >
                {properties.map((property) => (
                    <Marker
                        key={property.id}
                        coordinate={{
                            latitude: property.latitude,
                            longitude: property.longitude,
                        }}
                        title={property.name}
                        pinColor={getMarkerColor(property.risk_score)}
                        onPress={() => handleMarkerPress(property)}
                    />
                ))}
            </MapView>

            <PropertySheet ref={bottomSheetRef} property={selectedProperty} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    hiddenMap: {
        width: 0,
        height: 0,
        position: "absolute",
    },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1E1E2E",
        paddingHorizontal: 32,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#CDD6F4",
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#CDD6F4",
        marginBottom: 8,
    },
    errorMessage: {
        fontSize: 14,
        color: "#A6ADC8",
        textAlign: "center",
        lineHeight: 20,
    },
});
