import React, { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useProperties } from "../../hooks/useProperties";
import { useFavorites } from "../../hooks/useFavorites";
import { useCommunityReports } from "../../hooks/useCommunityReports";
import PropertySheet from "../../components/PropertySheet";
import ReportViolationForm from "../../components/ReportViolationForm";
import { Property, getLatitude, getLongitude } from "../../types/property";

/** Davis, CA center coordinates */
const DAVIS_REGION: Region = {
    latitude: 38.5382,
    longitude: -121.7617,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
};

/** Returns a hex color based on the risk_score. */
function getMarkerColor(score: number): string {
    if (score >= 7) return "#EF4444";
    if (score >= 4) return "#F59E0B";
    return "#22C55E";
}

/** Main map screen with search bar, property markers, favorites, and reports. */
export default function MapScreen(): React.ReactElement {
    const { properties, loading, error } = useProperties();
    const { isFavorite, toggleFavorite } = useFavorites();

    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [reportVisible, setReportVisible] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const { submitReport } = useCommunityReports(
        selectedProperty ? Number(selectedProperty.id) : null
    );

    const handleMarkerPress = useCallback((property: Property) => {
        setSelectedProperty(property);
        bottomSheetRef.current?.snapToIndex(1);
    }, []);

    const handleToggleFavorite = useCallback(() => {
        if (selectedProperty) {
            toggleFavorite(Number(selectedProperty.id));
        }
    }, [selectedProperty, toggleFavorite]);

    const handleReportSubmit = useCallback(
        async (type: string, description: string): Promise<string | null> => {
            if (!selectedProperty) return "No property selected";
            return submitReport(Number(selectedProperty.id), type, description);
        },
        [selectedProperty, submitReport]
    );

    // Filter properties by search query
    const filteredProperties = properties.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#89B4FA" />
                <Text style={styles.loadingText}>Loading LeaseLens…</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorTitle}>Something went wrong</Text>
                <Text style={styles.errorMessage}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={DAVIS_REGION}
                showsUserLocation
                showsMyLocationButton
            >
                {filteredProperties.map((property) => (
                    <Marker
                        key={property.id}
                        coordinate={{
                            latitude: getLatitude(property),
                            longitude: getLongitude(property),
                        }}
                        title={property.name}
                        pinColor={getMarkerColor(property.risk_score)}
                        onPress={() => handleMarkerPress(property)}
                    />
                ))}
            </MapView>

            {/* Search bar overlay */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons
                        name="search"
                        size={18}
                        color="#6C7086"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search properties…"
                        placeholderTextColor="#6C7086"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <Ionicons
                            name="close-circle"
                            size={18}
                            color="#6C7086"
                            onPress={() => setSearchQuery("")}
                        />
                    )}
                </View>
            </View>

            <PropertySheet
                ref={bottomSheetRef}
                property={selectedProperty}
                isFavorite={
                    selectedProperty
                        ? isFavorite(Number(selectedProperty.id))
                        : false
                }
                onToggleFavorite={handleToggleFavorite}
                onReportPress={() => setReportVisible(true)}
            />

            {/* Report form modal */}
            <ReportViolationForm
                visible={reportVisible}
                propertyName={selectedProperty?.name ?? ""}
                onClose={() => setReportVisible(false)}
                onSubmit={handleReportSubmit}
            />
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
    searchContainer: {
        position: "absolute",
        top: 60,
        left: 16,
        right: 16,
        zIndex: 10,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(30, 30, 46, 0.92)",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#313244",
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#CDD6F4",
    },
});
