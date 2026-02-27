import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Violation } from "../types/property";

interface ViolationDetailModalProps {
    violation: Violation | null;
    visible: boolean;
    onClose: () => void;
}

/**
 * Full-screen modal showing detailed information about a violation.
 */
export default function ViolationDetailModal({
    violation,
    visible,
    onClose,
}: ViolationDetailModalProps): React.ReactElement {
    if (!violation) return <></>;

    const isOpen = violation.status === "open";

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#CDD6F4" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Violation Details</Text>
                    <View style={styles.closeButton} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Status banner */}
                    <View
                        style={[
                            styles.statusBanner,
                            {
                                backgroundColor: isOpen
                                    ? "rgba(239, 68, 68, 0.12)"
                                    : "rgba(34, 197, 94, 0.12)",
                            },
                        ]}
                    >
                        <Ionicons
                            name={isOpen ? "alert-circle" : "checkmark-circle"}
                            size={20}
                            color={isOpen ? "#EF4444" : "#22C55E"}
                        />
                        <Text
                            style={[
                                styles.statusBannerText,
                                { color: isOpen ? "#EF4444" : "#22C55E" },
                            ]}
                        >
                            {isOpen
                                ? "This violation is currently OPEN"
                                : "This violation has been RESOLVED"}
                        </Text>
                    </View>

                    {/* Type */}
                    <Text style={styles.violationType}>{violation.type}</Text>

                    {/* Detail cards */}
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailCard}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="document-text" size={18} color="#89B4FA" />
                            </View>
                            <Text style={styles.detailLabel}>Case Number</Text>
                            <Text style={styles.detailValue}>{violation.case_number}</Text>
                        </View>

                        <View style={styles.detailCard}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="calendar" size={18} color="#F5C2E7" />
                            </View>
                            <Text style={styles.detailLabel}>Date Filed</Text>
                            <Text style={styles.detailValue}>{violation.date}</Text>
                        </View>

                        <View style={styles.detailCard}>
                            <View style={styles.detailIcon}>
                                <Ionicons
                                    name={isOpen ? "time" : "checkmark-done"}
                                    size={18}
                                    color={isOpen ? "#F59E0B" : "#22C55E"}
                                />
                            </View>
                            <Text style={styles.detailLabel}>Status</Text>
                            <Text
                                style={[
                                    styles.detailValue,
                                    { color: isOpen ? "#F59E0B" : "#22C55E" },
                                ]}
                            >
                                {violation.status.charAt(0).toUpperCase() +
                                    violation.status.slice(1)}
                            </Text>
                        </View>

                        <View style={styles.detailCard}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="warning" size={18} color="#FAB387" />
                            </View>
                            <Text style={styles.detailLabel}>Category</Text>
                            <Text style={styles.detailValue}>{violation.type}</Text>
                        </View>
                    </View>

                    {/* Timeline */}
                    <Text style={styles.sectionTitle}>Timeline</Text>
                    <View style={styles.timeline}>
                        <View style={styles.timelineItem}>
                            <View style={[styles.timelineDot, { backgroundColor: "#89B4FA" }]} />
                            <View style={styles.timelineContent}>
                                <Text style={styles.timelineTitle}>Violation Filed</Text>
                                <Text style={styles.timelineDate}>{violation.date}</Text>
                            </View>
                        </View>
                        <View style={styles.timelineLine} />
                        {isOpen ? (
                            <View style={styles.timelineItem}>
                                <View
                                    style={[
                                        styles.timelineDot,
                                        { backgroundColor: "#F59E0B" },
                                    ]}
                                />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineTitle}>
                                        Under Review
                                    </Text>
                                    <Text style={styles.timelineDate}>
                                        Awaiting resolution
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.timelineItem}>
                                <View
                                    style={[
                                        styles.timelineDot,
                                        { backgroundColor: "#22C55E" },
                                    ]}
                                />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineTitle}>
                                        Resolved
                                    </Text>
                                    <Text style={styles.timelineDate}>
                                        Case closed
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E2E",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#313244",
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#CDD6F4",
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    statusBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    statusBannerText: {
        fontSize: 13,
        fontWeight: "700",
    },
    violationType: {
        fontSize: 26,
        fontWeight: "800",
        color: "#CDD6F4",
        marginBottom: 24,
    },
    detailsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 32,
    },
    detailCard: {
        width: "47%",
        backgroundColor: "#313244",
        borderRadius: 14,
        padding: 16,
    },
    detailIcon: {
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: "#6C7086",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: "700",
        color: "#CDD6F4",
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#A6ADC8",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 16,
    },
    timeline: {
        paddingLeft: 8,
        marginBottom: 40,
    },
    timelineItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    timelineContent: {
        flex: 1,
    },
    timelineTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#CDD6F4",
    },
    timelineDate: {
        fontSize: 13,
        color: "#6C7086",
        marginTop: 2,
    },
    timelineLine: {
        width: 2,
        height: 32,
        backgroundColor: "#45475A",
        marginLeft: 5,
    },
});
