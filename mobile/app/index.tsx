import { Redirect } from "expo-router";

/**
 * Root index — redirects to the tabs group.
 * Auth gating happens in _layout.tsx.
 */
export default function Index() {
    return <Redirect href="/(tabs)/map" />;
}
