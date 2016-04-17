var Sway = require('sway');

// Worker code from here
/* eslint-env worker */
onmessage = function(message) {
  Sway.create(message.data).then(function(api) {
    var results = api.validate();

    if (results.errors.length) {
      postMessage({
        specs: api.definitionFullyResolved || api.definitions,
        errors: sanitizeErrors(results.errors),
        warnings: results.warnings
      });
      return;
    }

    postMessage({
      errors: [],
      specs: api.definitionFullyResolved,
      warnings: results.warnings
    });
  })

  .catch(function(err) {
    postMessage({
      specs: message.data,
      warnings: [],
      errors: [{
        message: err.message,
        code: err.code ? 'ERROR_THROWN_BY_SWAY_CODE: ' + err.code :
          'UNCAUGHT_SWAY_WORKER_ERROR'
      }]
    });
  });
};

// Error object can not get serialized using the structured cloning algorithm,
// therefore we're removing them and appending the error message to our main
// error object.
/**
 * @param {array} errors - errors
 * @return {array} emptie errors
*/
function sanitizeErrors(errors) {
  if (!errors || !errors.length) {
    return [];
  }

  return errors.map(function(error) {
    if (error.err instanceof Error) {
      error.message = error.err.message;
      delete error.err;
    }

    return error;
  });
}
