// https://github.com/kristerkari/react-native-svg-transformer/issues/108#issuecomment-1179823978
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const {
  resolver: { sourceExts, assetExts },
} = config;

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

config.resolver = {
  assetExts: [...assetExts.filter((ext) => ext !== "svg"), "db"],
  sourceExts: [...sourceExts, "svg"],
}

module.exports = config;
