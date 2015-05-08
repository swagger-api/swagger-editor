'use strict';

module.exports = {
  'publish': {
    command: [
      'npm publish',
      'node scripts/copy-dist-package-json.js',
      'cd dist',
      'npm publish'
    ].join(';\n')
  },
  'serve-dist': {
    command: './node_modules/http-server/bin/http-server -p 8090 &'
  }
};
