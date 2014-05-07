'use strict';

PhonicsApp.directive('splitterBar', function(){
  return {
    template: '',
    replace: false,
    restrict: 'E',
    link: function($scope, $element, $attributes){
      var $document = $(document);
      function resize(mouseMoveEvent){
        var x = mouseMoveEvent.pageX;
        var MIN_WIDTH = 100;
        if( x < MIN_WIDTH || x > window.innerWidth - MIN_WIDTH) {
          return;
        }
        $element.css('left', x);
        $('#' + $attributes.leftPane).css('width', x);
        $('#' + $attributes.rightPane).css('width',
          window.innerWidth - x - $element.width());
      }
      $element.on('mousedown', function(){
        $document.on('mousemove', resize);
        $document.on('mouseup', function(){
          $document.off('mousemove', resize);
        });
      });
    }
  };
});