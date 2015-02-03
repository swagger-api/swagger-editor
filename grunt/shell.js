'use strict';

module.exports = {
  'publish': {
    command: [
      './node_modules/mversion/bin/version patch --tag -m "%s"',
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
