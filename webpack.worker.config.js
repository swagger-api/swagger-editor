import webpack from 'webpack';
import dotenv from 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolve } from 'import-meta-resolve';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const NODE_ENV = process.env.NODE_ENV || 'development';

const apidomWorkerPath = process.env.VITE_APIDOM_WORKER_PATH;
const editorWorkerPath = process.env.VITE_EDITOR_WORKER_PATH;

export default {
  mode: NODE_ENV,
  entry: {
    'apidom.worker': apidomWorkerPath,
    'editor.worker': editorWorkerPath,
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/static/js'),
  },
  resolve: {
    fallback: {
      path: false,
      fs: false,
      http: resolve('stream-http', import.meta.url), // required for asyncapi parser
      https: resolve('https-browserify', import.meta.url), // required for asyncapi parser
      stream: resolve('stream-browserify', import.meta.url),
      util: resolve('util', import.meta.url),
      url: resolve('url', import.meta.url),
      buffer: resolve('buffer', import.meta.url),
      zlib: false,
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: ['process'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.wasm$/,
        loader: 'file-loader',
        type: 'javascript/auto',
      },
    ],
  },
};
