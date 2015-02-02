'use strict';

/*
 * An attribute directive that will fire analytics event when element that this
 * directive is attached to is clicked
 * If the event name is separated this directive will fire subevents
 *
 * For example track-event="project new" will fire `project` event with `new`
 * subevent
*/
SwaggerEditor.directive('trackEvent', function (Analytics) {
  return {
    restrict: 'A',
    link: function ($scope, $element, $attributes) {
      $element.bind('click', function () {
        var eventName = $attributes.trackEvent;
        if (angular.isString(eventName)) {
          Analytics.sendEvent.apply(null, eventName.split(' '));

        }
      });
    }
  };
});
