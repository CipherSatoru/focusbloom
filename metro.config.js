const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable inline requires for faster startup
config.transformer = {
  ...config.transformer,
  inlineRequires: true,
};

module.exports = config;
