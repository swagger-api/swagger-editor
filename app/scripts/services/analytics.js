'use strict';

SwaggerEditor.service('Analytics', function Analytics(defaults) {

  var isDisabled = false;
  var initialized = false;
  var id = _.defaults(defaults, {
    analytics: {google: {id: null}}
  }).analytics.google.id;

  /*
   * Initialize the analytics
  */
  this.initialize = function () {
    var ga = window.ga;

    // disable if Google Analytics's `ga` global is not present or it is not
    // configured in default
    if (!window.ga || !id) {
      isDisabled = true;
      return;
    }

    // don't initialize more than once
    if (initialized) {
      return;
    }

    // Load the plugin.
    ga('require', 'linker');

    // Define which domains to autoLink.
    ga('linker:autoLink', ['swagger.io']);

    ga('create', id, 'auto', {allowLinker: true});

    ga('send', 'pageview');

    initialized = true;
  };

  /*
   * Expose event tracking
  */
  this.sendEvent = function (eventName) {

    if (isDisabled) {
      return;
    }

    if (!angular.isString(eventName)) {
      throw new Error('Event name should be a string');
    }

    window.ga('send', eventName);
  };
});
