'use strict';

const apiDOMResolverPlugin = [
  'module-resolver',
  {
    root: ['./src'],
    alias: {
      apidom: '../../apidom/packages/apidom',
      'apidom-ast': '../../apidom/packages/apidom-ast',
      'apidom-ns-asyncapi-2': '../../apidom/packages/apidom-ns-asyncapi-2',
      'apidom-ns-openapi-3-1': '../../apidom/packages/apidom-ns-openapi-3-1',
      'apidom-parser': '../../apidom/packages/apidom-parser',
      'apidom-parser-adapter-asyncapi-json-2':
        '../../apidom/packages/apidom-parser-adapter-asyncapi-json-2',
      'apidom-parser-adapter-asyncapi-yaml-2':
        '../../apidom/packages/apidom-parser-adapter-asyncapi-yaml-2',
      'apidom-parser-adapter-json': '../../apidom/packages/apidom-parser-adapter-json',
      'apidom-parser-adapter-openapi-json-3-1':
        '../../apidom/packages/apidom-parser-adapter-openapi-json-3-1',
      'apidom-parser-adapter-openapi-yaml-3-1':
        '../../apidom/packages/apidom-parser-adapter-openapi-yaml-3-1',
      'apidom-parser-adapter-yaml-1-2': '../../apidom/packages/apidom-parser-adapter-yaml-1-2',
      'apidom-reference': '../../apidom/packages/apidom-reference',
      'apidom-ls': '../../apidom/packages/apidom-ls',
    },
  },
];

module.exports = {
  presets: ['react-app'],
  plugins: [apiDOMResolverPlugin],
};
