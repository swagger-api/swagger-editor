module.exports = {
  'publish-npm': {
    command: 'sh scripts/publish-npm.sh'
  },
  'serve-dist': {
    command: './node_modules/http-server/bin/http-server -p 8090 &'
  },
  'publish-npm-src': {
    command: 'npm version patch; npm publish'
  }
};
