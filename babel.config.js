const apiDOMResolverPlugin = [
  'module-resolver',
  {
    root: ['./src'],
    alias: {
      apidom: '../../apidom/packages/apidom/cjs',
      'apidom-ast': '../../apidom/packages/apidom-ast',
      'apidom-ns-asyncapi-2-0': '../../apidom/packages/apidom-ns-asyncapi-2-0',
      'apidom-ns-openapi-3-1': '../../apidom/packages/apidom-ns-openapi-3-1',
      'apidom-parser': '../../apidom/packages/apidom-parser',
      'apidom-parser-adapter-asyncapi-json-2-0':
        '../../apidom/packages/apidom-parser-adapter-asyncapi-json-2-0',
      'apidom-parser-adapter-asyncapi-yaml-2-0':
        '../../apidom/packages/apidom-parser-adapter-asyncapi-yaml-2-0',
      'apidom-parser-adapter-json': '../../apidom/packages/apidom-parser-adapter-json',
      'apidom-parser-adapter-openapi-json-3-1':
        '../../apidom/packages/apidom-parser-adapter-openapi-json-3-1',
      'apidom-parser-adapter-openapi-yaml-3-1':
        '../../apidom/packages/apidom-parser-adapter-openapi-yaml-3-1',
      'apidom-parser-adapter-yaml-1-2': '../../apidom/packages/apidom-parser-adapter-yaml-1-2',
    },
  },
];

module.exports = {
  env: {
    cjs: {
      ignore: ['../../apidom/packages/'],
      presets: [
        [
          '@babel/preset-env',
          {
            debug: false,
            modules: 'commonjs',
            targets: {
              node: '10',
            },
            useBuiltIns: false,
            corejs: 3,
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
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
            version: '^7.11.2',
          },
        ],
        apiDOMResolverPlugin,
      ],
    },
    es: {
      presets: [
        [
          '@babel/preset-env',
          {
            debug: false,
            modules: false,
            useBuiltIns: false,
            corejs: 3,
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
            version: '^7.11.2',
            useESModules: true,
          },
        ],
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
        'lodash',
        apiDOMResolverPlugin,
      ],
    },
    browser: {
      sourceType: 'unambiguous', // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
      presets: [
        [
          '@babel/preset-env',
          {
            debug: true,
            useBuiltIns: false,
            corejs: 3,
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
            version: '^7.11.2',
            useESModules: true,
          },
        ],
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
        'lodash',
        apiDOMResolverPlugin,
      ],
    },
  },
};
