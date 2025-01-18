module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [
        [
          'module:react-native-dotenv',
          {
            moduleName: '@env',
            path: './config/.env',
            blocklist: null,
            allowlist: null,
            safe: false,
            allowUndefined: true,
          },
        ],
      ],
    };
  };
