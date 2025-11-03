import babelJest from 'babel-jest';

import { require } from '../util.js';

export default babelJest.default.createTransformer({
  presets: [
    [
      require.resolve('babel-preset-react-app'),
      {
        runtime: 'automatic',
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-class-static-block'],
  babelrc: false,
  configFile: false,
});
