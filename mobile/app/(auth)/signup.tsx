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

export default function SignupScreen(): React.ReactElement {
    const router = useRouter();
    const { signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSignup = async () => {
        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError(null);

        const errMsg = await signUp(email.trim(), password);

        if (errMsg) {
            setError(errMsg);
        } else {
            setSuccess(true);
        }

        setLoading(false);
    };

    if (success) {
        return (
            <View style={[styles.container, styles.inner]}>
                <Text style={styles.logo}>✅</Text>
                <Text style={styles.title}>Account Created!</Text>
                <Text style={styles.subtitle}>
                    Check your email to confirm your account, then sign in.
                </Text>
                <Pressable
                    style={styles.button}
                    onPress={() => router.replace("/(auth)/login")}
                >
                    <Text style={styles.buttonText}>Back to Sign In</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.inner}>
                <Text style={styles.logo}>🏠</Text>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                    Join LeaseLens to save favorites and report issues
                </Text>

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
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#6C7086"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    {error && <Text style={styles.error}>{error}</Text>}

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#1E1E2E" size="small" />
                        ) : (
                            <Text style={styles.buttonText}>Create Account</Text>
                        )}
                    </Pressable>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Already have an account?{" "}
                    </Text>
                    <Pressable onPress={() => router.replace("/(auth)/login")}>
                        <Text style={styles.footerLink}>Sign In</Text>
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
        fontSize: 28,
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
