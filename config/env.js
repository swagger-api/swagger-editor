import fs from 'fs';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import paths from './paths.js';
import { require } from './util.js';

delete require.cache[require.resolve('./paths')];

const { NODE_ENV } = process.env;
if (!NODE_ENV) {
  throw new Error('The NODE_ENV environment variable is required but was not specified.');
}

const dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  paths.dotenv,
].filter(Boolean);

dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    dotenvExpand(
      dotenv.config({
        path: dotenvFile,
      })
    );
  }
});

const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter((key) => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        return {
          ...env,
          [key]: process.env[key],
        };
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PUBLIC_URL: publicUrl,
        FAST_REFRESH: process.env.FAST_REFRESH !== 'false',
      }
    );
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      return { ...env, [key]: JSON.stringify(raw[key]) };
    }, {}),
  };

  return { raw, stringified };
}

export default getClientEnvironment;
