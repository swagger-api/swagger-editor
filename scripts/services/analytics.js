'use strict';

var _ = require('lodash');
SwaggerEditor.service('Analytics', function Analytics(defaults) {
  var isDisabled = false;
  var initialized = false;
  var id = _.defaults(defaults, {
    analytics: {google: {id: null}}
  }).analytics.google.id;

  /*
   * Initialize the analytics
  */
  this.initialize = function() {
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
   * Expose event tracking calls.
   * This function can have unlimited number of arguments but usually three
   * arguments that are:
   * eventCategory: The category of the event. For example: selected-example
   * eventAction: The event action: For example: pet-store
   * eventLabel: The event label. This can be anything you want.
  */
  this.sendEvent = function(/* eventCategory, eventAction, eventLabel*/) {
    if (isDisabled) {
      return;
    }

    if (!arguments.length) {
      throw new Error('sendEvent was called with no arguments');
    }

    Array.prototype.unshift.call(arguments, 'event');
    Array.prototype.unshift.call(arguments, 'send');

    window.ga.apply(window.ga, arguments);
  };
});
