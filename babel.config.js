module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@/components': './components',
            '@/hooks': './hooks',
            '@/store': './store',
            '@/utils': './utils',
            '@/theme': './theme',
            '@/types': './types',
            '@/native': './native',
          },
        },
      ],
    ],
  };
};
