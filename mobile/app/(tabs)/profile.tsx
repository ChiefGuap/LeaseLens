import React from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";

/**
 * Profile screen showing user info and sign-out button.
 */
export default function ProfileScreen(): React.ReactElement {
    const { user, signOut } = useAuth();

    const handleSignOut = () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Sign Out",
                style: "destructive",
                onPress: signOut,
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>

            <View style={styles.content}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={40} color="#89B4FA" />
                    </View>
                    <Text style={styles.email}>{user?.email ?? "Guest"}</Text>
                    <Text style={styles.memberSince}>
                        Member since{" "}
                        {user?.created_at
                            ? new Date(user.created_at).toLocaleDateString(
                                "en-US",
                                { month: "long", year: "numeric" }
                            )
                            : "—"}
                    </Text>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Ionicons
                            name="heart"
                            size={22}
                            color="#EF4444"
                        />
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Saved</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons
                            name="flag"
                            size={22}
                            color="#F59E0B"
                        />
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Reports</Text>
                    </View>
                </View>

                {/* Sign out */}
                <Pressable
                    style={({ pressed }) => [
                        styles.signOutButton,
                        pressed && styles.signOutPressed,
                    ]}
                    onPress={handleSignOut}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={20}
                        color="#EF4444"
                    />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>
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
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 32,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#313244",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    email: {
        fontSize: 17,
        fontWeight: "600",
        color: "#CDD6F4",
        marginBottom: 4,
    },
    memberSince: {
        fontSize: 13,
        color: "#6C7086",
    },
    statsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#313244",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        gap: 6,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "800",
        color: "#CDD6F4",
    },
    statLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6C7086",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    signOutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderRadius: 14,
        paddingVertical: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: "rgba(239, 68, 68, 0.2)",
    },
    signOutPressed: {
        opacity: 0.7,
    },
    signOutText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#EF4444",
    },
});
