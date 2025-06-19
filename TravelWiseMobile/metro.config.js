const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  stream: require.resolve("stream-browserify"),
  events: require.resolve("events"),
  http: require.resolve("http-browserify"),
  crypto: require.resolve("crypto-browserify"),
  https: require.resolve("https-browserify"),
  net: require.resolve("react-native-tcp"),
  tls: require.resolve("react-native-tcp"),
  zlib: require.resolve("browserify-zlib"),
  path: require.resolve("path-browserify"),
  fs: require.resolve("react-native-fs"),
  os: require.resolve("os-browserify"),
  url: require.resolve("url"),
  util: require.resolve("util"),
  buffer: require.resolve("buffer"),
  process: require.resolve("process/browser"),
  assert: require.resolve("assert"),
  ...defaultConfig.resolver.extraNodeModules,
};

module.exports = defaultConfig;
