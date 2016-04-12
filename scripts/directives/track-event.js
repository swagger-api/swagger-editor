'use strict';

var angular = require('angular');

/*
 * An attribute directive that will fire analytics event when element that this
 * directive is attached to is clicked
 * If the event name is separated this directive will fire subevents
 *
 * For example track-event="project new" will fire `project` event with `new`
 * subevent
*/
SwaggerEditor.directive('trackEvent', function(Analytics) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      $element.bind('click', function() {
        var eventName = $attributes.trackEvent;

        if (angular.isString(eventName)) {
          // A Google Analytics event has three  components: event category,
          // event action and event label;
          // we use 'click-item' as event action for this directive
          // an joined array of event hierarchy as event action
          // event label is set to window.location.origin to label events with
          // domain that they been fired from
          var eventCategory = 'click-item';
          var eventAction = eventName.split(' ').join('->');
          var eventLabel = window.location.origin;

          Analytics.sendEvent(eventCategory, eventAction, eventLabel);
        }
      });
    }
  };
});
