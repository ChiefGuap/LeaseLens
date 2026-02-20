const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Ensure Metro's worker process can resolve react-native-worklets
// from within react-native-reanimated/plugin (jest-worker isolation issue)
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    "react-native-worklets": path.resolve(
        __dirname,
        "node_modules/react-native-worklets"
    ),
};

module.exports = config;
