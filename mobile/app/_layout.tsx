import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from "../hooks/useAuth";

/**
 * Root layout — shows auth screens when logged out, tab navigator when logged in.
 */
export default function RootLayout(): React.ReactElement {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#89B4FA" />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.root}>
            <Stack screenOptions={{ headerShown: false }}>
                {session ? (
                    <Stack.Screen name="(tabs)" />
                ) : (
                    <Stack.Screen name="(auth)/login" />
                )}
                <Stack.Screen name="(auth)/signup" />
            </Stack>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    loading: {
        flex: 1,
        backgroundColor: "#1E1E2E",
        alignItems: "center",
        justifyContent: "center",
    },
});
