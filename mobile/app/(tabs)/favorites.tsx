import React from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Favorites screen — placeholder for Phase 3.
 * Will show a list of saved properties.
 */
export default function FavoritesScreen(): React.ReactElement {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Saved Places</Text>
                <Text style={styles.subtitle}>
                    Properties you've bookmarked
                </Text>
            </View>

            <View style={styles.emptyState}>
                <Ionicons name="heart-outline" size={64} color="#45475A" />
                <Text style={styles.emptyTitle}>No Saved Places Yet</Text>
                <Text style={styles.emptySubtitle}>
                    Tap the heart icon on a property to save it here
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E2E",
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#CDD6F4",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#6C7086",
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 100,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#CDD6F4",
        marginTop: 16,
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 14,
        color: "#6C7086",
        textAlign: "center",
        paddingHorizontal: 40,
    },
});
