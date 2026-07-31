const { createConfigPlugin, AndroidConfig } = require('@expo/config');

/**
 * FocusBloom Native Config Plugin
 *
 * Registers the native Android modules (AppBlockerModule, UsageTrackerModule)
 * and declares the required permissions and services.
 */
const FocusBloomPlugin = createConfigPlugin('focusbloom-native', (config) => {
  // Add permissions
  config.android.permissions = [
    ...(config.android?.permissions || []),
    'PACKAGE_USAGE_STATS',
    'BIND_ACCESSIBILITY_SERVICE',
    'WRITE_SECURE_SETTINGS',
    'RECEIVE_BOOT_COMPLETED',
    'FOREGROUND_SERVICE',
    'VIBRATE',
    'SYSTEM_ALERT_WINDOW',
  ];

  // Add native dependencies
  config.dependencies = [
    ...(config.dependencies || []),
  ];

  return config;
});

module.exports = FocusBloomPlugin;
