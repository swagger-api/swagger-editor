'use strict';

module.exports = {
  test: {
    root: 'dist',
    port: 8282,
    host: '127.0.0.1',
    cache: 0,
    showDir : true,
    autoIndex: true,
    defaultExt: 'html',
    runInBackground: true,
    logFn: function noop() {}
  }
};
