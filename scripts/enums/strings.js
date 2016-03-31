'use strict';

SwaggerEditor.config(function($provide) {
  $provide.constant('strings', {

    // stausMessages keys should start with one of following words:
    //   * error
    //   * progress
    //   * success
    // depending on starting word, the UI will appear with a different
    // appearance
    stausMessages: {
      'error-connection': 'Server connection error',
      'error-general': 'Error!',
      'progress-working': 'Working...',
      'progress-unsaved': 'Unsaved changes',
      'success-process': 'Processed with no error',
      'progress-saving': 'Saving...',
      'success-saved': 'All changes saved',
      'error-yaml': 'YAML Syntax Error',
      'error-swagger': 'Swagger Error'
    }
  });
});
