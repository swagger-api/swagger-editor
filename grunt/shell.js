module.exports = {
  'publish-npm': {
    command: 'sh scripts/publish-npm.sh'
  },
  'serve-dist': {
    command: './node_modules/http-server/bin/http-server -p 8090 &'
  },
  'replace-defaults-a127': {
    command: 'sh scripts/replace-defaults-a127.sh'
  },
  'pusblish-npm-a127': {
    command: 'sh scripts/publish-npm-a127.sh'
  },
  'a127-restore-defaults': {
    command: 'git reset --hard'
  }
};
