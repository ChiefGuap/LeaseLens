import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function LoginScreen(): React.ReactElement {
    const router = useRouter();
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError(null);

        const errMsg = await signIn(email.trim(), password);

        if (errMsg) {
            setError(errMsg);
            setLoading(false);
        }
        // On success, the auth listener in _layout.tsx routes automatically
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.inner}>
                {/* Brand */}
                <Text style={styles.logo}>🏠</Text>
                <Text style={styles.title}>LeaseLens</Text>
                <Text style={styles.subtitle}>
                    Rental transparency for Davis
                </Text>

                {/* Form */}
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#6C7086"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#6C7086"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    {error && <Text style={styles.error}>{error}</Text>}

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#1E1E2E" size="small" />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </Pressable>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Don't have an account?{" "}
                    </Text>
                    <Pressable onPress={() => router.push("/(auth)/signup")}>
                        <Text style={styles.footerLink}>Sign Up</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E2E",
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 32,
    },
    logo: {
        fontSize: 56,
        textAlign: "center",
        marginBottom: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#CDD6F4",
        textAlign: "center",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 15,
        color: "#6C7086",
        textAlign: "center",
        marginBottom: 40,
    },
    form: {
        gap: 14,
    },
    input: {
        backgroundColor: "#313244",
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 16,
        fontSize: 16,
        color: "#CDD6F4",
        borderWidth: 1,
        borderColor: "#45475A",
    },
    error: {
        color: "#EF4444",
        fontSize: 13,
        textAlign: "center",
        marginTop: 2,
    },
    button: {
        backgroundColor: "#89B4FA",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 6,
    },
    buttonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1E1E2E",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    footerText: {
        fontSize: 14,
        color: "#6C7086",
    },
    footerLink: {
        fontSize: 14,
        fontWeight: "600",
        color: "#89B4FA",
    },
});
