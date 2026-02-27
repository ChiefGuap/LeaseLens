import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReportViolationFormProps {
    visible: boolean;
    propertyName: string;
    onClose: () => void;
    onSubmit: (type: string, description: string) => Promise<string | null>;
}

const VIOLATION_TYPES = [
    "Plumbing/Mold",
    "Pest Infestation",
    "Electrical Hazard",
    "Fire Safety Violation",
    "Structural Damage",
    "HVAC Failure",
    "Noise Complaint",
    "Sanitation Issue",
    "Other",
];

/**
 * Modal form for submitting a community violation report.
 */
export default function ReportViolationForm({
    visible,
    propertyName,
    onClose,
    onSubmit,
}: ReportViolationFormProps): React.ReactElement {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!selectedType) {
            setError("Please select a violation type");
            return;
        }
        if (description.trim().length < 10) {
            setError("Please provide more detail (at least 10 characters)");
            return;
        }

        setLoading(true);
        setError(null);

        const errMsg = await onSubmit(selectedType, description.trim());

        if (errMsg) {
            setError(errMsg);
        } else {
            setSuccess(true);
        }

        setLoading(false);
    };

    const handleClose = () => {
        setSelectedType(null);
        setDescription("");
        setError(null);
        setSuccess(false);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={handleClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#CDD6F4" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Report Issue</Text>
                    <View style={styles.closeButton} />
                </View>

                {success ? (
                    <View style={styles.successContainer}>
                        <Text style={styles.successIcon}>✅</Text>
                        <Text style={styles.successTitle}>Report Submitted!</Text>
                        <Text style={styles.successSubtitle}>
                            Thank you for helping make Davis rentals more transparent. Your
                            report will be reviewed.
                        </Text>
                        <Pressable style={styles.doneButton} onPress={handleClose}>
                            <Text style={styles.doneButtonText}>Done</Text>
                        </Pressable>
                    </View>
                ) : (
                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.propertyLabel}>Reporting for</Text>
                        <Text style={styles.propertyName}>{propertyName}</Text>

                        {/* Type selection */}
                        <Text style={styles.sectionTitle}>Violation Type</Text>
                        <View style={styles.typeGrid}>
                            {VIOLATION_TYPES.map((type) => (
                                <Pressable
                                    key={type}
                                    style={[
                                        styles.typeChip,
                                        selectedType === type && styles.typeChipActive,
                                    ]}
                                    onPress={() => setSelectedType(type)}
                                >
                                    <Text
                                        style={[
                                            styles.typeChipText,
                                            selectedType === type && styles.typeChipTextActive,
                                        ]}
                                    >
                                        {type}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* Description */}
                        <Text style={styles.sectionTitle}>Description</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Describe the issue in detail…"
                            placeholderTextColor="#6C7086"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        {error && <Text style={styles.error}>{error}</Text>}

                        <Pressable
                            style={({ pressed }) => [
                                styles.submitButton,
                                pressed && styles.submitButtonPressed,
                            ]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#1E1E2E" size="small" />
                            ) : (
                                <Text style={styles.submitButtonText}>
                                    Submit Report
                                </Text>
                            )}
                        </Pressable>
                    </ScrollView>
                )}
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
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    propertyLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6C7086",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    propertyName: {
        fontSize: 20,
        fontWeight: "700",
        color: "#CDD6F4",
        marginTop: 4,
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: "#A6ADC8",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    typeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 24,
    },
    typeChip: {
        backgroundColor: "#313244",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#45475A",
    },
    typeChipActive: {
        backgroundColor: "rgba(137, 180, 250, 0.15)",
        borderColor: "#89B4FA",
    },
    typeChipText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6C7086",
    },
    typeChipTextActive: {
        color: "#89B4FA",
    },
    textArea: {
        backgroundColor: "#313244",
        borderRadius: 14,
        padding: 16,
        fontSize: 15,
        color: "#CDD6F4",
        minHeight: 120,
        borderWidth: 1,
        borderColor: "#45475A",
        marginBottom: 16,
    },
    error: {
        color: "#EF4444",
        fontSize: 13,
        textAlign: "center",
        marginBottom: 12,
    },
    submitButton: {
        backgroundColor: "#F59E0B",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: 40,
    },
    submitButtonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    submitButtonText: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1E1E2E",
    },
    successContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },
    successIcon: {
        fontSize: 56,
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#CDD6F4",
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 15,
        color: "#6C7086",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 32,
    },
    doneButton: {
        backgroundColor: "#89B4FA",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 40,
    },
    doneButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E1E2E",
    },
});
