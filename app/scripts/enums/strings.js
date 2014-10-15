'use strict';

PhonicsApp.config(function ($provide) {
  $provide.constant('strings', {
    stausMessages: {
      '-2': 'Unsaved Changes. Check your server connection',
      '-1': 'Error!',
      0: 'Working...',
      1: 'All changes saved.'
    }
  });
});
