'use strict';

PhonicsApp.directive('splitterBar', ['Splitter', function (splitter){
  var ANIMATION_DURATION = 400;

  function registerVerticalPanes ($element) {
    splitter.registerSide('left', $element.offsetLeft);
    splitter.registerSide('right', window.innerWidth - $element.offsetLeft - 4);
  }

  return {
    template: '',
    replace: false,
    restrict: 'E',
    link: function($scope, $element, $attributes){
      var $document = $(document);
      var $parent = $element.parent();
      if(!('horizontal' in $attributes)){
        registerVerticalPanes($element.get(0));
      }

      splitter.addHideListener('left', function () {
        $('#' + $attributes.leftPane).animate({width: 0}, ANIMATION_DURATION);
        $('#' + $attributes.rightPane).animate({width: window.innerWidth}, ANIMATION_DURATION, function () {
          $document.trigger('pane-resize');
        });
        $element.hide();
      });

      splitter.addShowListener('left', function (width) {
        $('#' + $attributes.leftPane).animate({width: width}, ANIMATION_DURATION);
        $('#' + $attributes.rightPane).animate({width: window.innerWidth - width - 4}, ANIMATION_DURATION, function () {
          $('#' + $attributes.rightPane).css('overflow', 'auto');
          $element.show();
          $document.trigger('pane-resize');
        });
      });

      splitter.addHideListener('right', function () {
        $('#' + $attributes.rightPane).animate({width: 0}, ANIMATION_DURATION);
        $('#' + $attributes.leftPane).animate({width: window.innerWidth}, ANIMATION_DURATION, function(){
          $document.trigger('pane-resize');
        });
        $element.hide();
      });

      splitter.addShowListener('right', function (width) {
        $('#' + $attributes.rightPane).animate({width: width}, ANIMATION_DURATION);
        $('#' + $attributes.leftPane).animate({width: window.innerWidth - width}, ANIMATION_DURATION, function () {
          $('#' + $attributes.rightPane).css('overflow', 'auto');
          $element.show();
          $document.trigger('pane-resize');
        });
      });

      function resize(mouseMoveEvent){
        var x = mouseMoveEvent.pageX - $parent.offset().left;
        var y = mouseMoveEvent.pageY - $parent.offset().top;
        x = x || window.innerWidth / 2;
        y = y || window.innerHeight / 2;
        var MIN_SIZE = 100;
        if('horizontal' in $attributes){
          if( y < MIN_SIZE || y > $parent.height() - MIN_SIZE) {
            return;
          }
          $document.trigger('pane-resize');
          $element.css('top', y);
          $('#' + $attributes.topPane).css('height', y + $element.height());
          $('#' + $attributes.bottomPane).css('height',
            $parent.height() - y);
        } else {
          if( x < MIN_SIZE || x > $parent.width() - MIN_SIZE) {
            return;
          }
          $document.trigger('pane-resize');
          $element.css('left', x);
          $('#' + $attributes.leftPane).css('width', x);
          $('#' + $attributes.rightPane).css('width',
            $parent.width() - x - $element.width());
          registerVerticalPanes($element.get(0));
        }
      }
      $element.on('mousedown', function(mousedownEvent){
        mousedownEvent.preventDefault();
        $document.on('mousemove', resize);
        $document.on('mouseup', function(){
          $document.off('mousemove', resize);
        });
      });
      $(window).on('resize', _.throttle(resize,300));
    }
  };
}]);
