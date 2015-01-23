'use strict';

SwaggerEditor.config(function ($provide) {
  $provide.constant('strings', {
    stausMessages: {
      '-2': 'Unsaved changes. Check your server connection',
      '-1': 'Error!',
      0: 'Working...',
      1: 'Unsaved changes',
      2: 'All changes saved.'
    }
  });
});
