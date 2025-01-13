const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx');
  config.server = {
    ...config.server,
    port: process.env.EXPO_PORT || 19000,
    host: process.env.EXPO_HOST || '0.0.0.0',
  };

  return config;
})();
