import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

/**
 * Root layout — wraps the entire app with gesture support
 * required by @gorhom/bottom-sheet.
 */
export default function RootLayout(): React.ReactElement {
    return (
        <GestureHandlerRootView style={styles.root}>
            <Stack screenOptions={{ headerShown: false }} />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});
