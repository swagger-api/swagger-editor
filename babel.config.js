module.exports = {
  env: {
    cjs: {
      presets: [
        [
          '@babel/preset-env',
          {
            debug: false,
            modules: 'commonjs',
            corejs: { version: 3 },
            useBuiltIns: false,
            targets: {
              node: '8',
            },
            forceAllTransforms: false,
            ignoreBrowserslistConfig: true,
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-transform-modules-commonjs',
          {
            loose: true,
          },
        ],
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
      ],
    },
    es: {
      presets: [
        [
          '@babel/preset-env',
          {
            debug: false,
            modules: false,
            corejs: { version: 3 },
            useBuiltIns: false,
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            absoluteRuntime: false,
            corejs: 3,
            version: '^7.11.2',
          },
        ],
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
        'lodash',
      ],
    },
    browser: {
      sourceType: 'unambiguous', // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
      presets: [
        [
          '@babel/preset-env',
          {
            debug: false,
            corejs: { version: 3 },
            useBuiltIns: false,
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
            version: '^7.11.2',
          },
        ],
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
        'lodash',
      ],
    },
  },
};
