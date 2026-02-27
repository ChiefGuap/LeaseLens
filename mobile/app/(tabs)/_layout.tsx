import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

/**
 * Tab navigator with three tabs: Map, Favorites, and Profile.
 * Uses Catppuccin Mocha theme colors.
 */
export default function TabLayout(): React.ReactElement {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#89B4FA",
                tabBarInactiveTintColor: "#6C7086",
                tabBarStyle: {
                    backgroundColor: "#1E1E2E",
                    borderTopColor: "#313244",
                    borderTopWidth: 1,
                    paddingBottom: Platform.OS === "ios" ? 20 : 8,
                    paddingTop: 8,
                    height: Platform.OS === "ios" ? 88 : 64,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "600",
                },
            }}
        >
            <Tabs.Screen
                name="map"
                options={{
                    title: "Map",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: "Saved",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-circle" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
