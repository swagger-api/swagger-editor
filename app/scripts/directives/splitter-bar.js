'use strict';

PhonicsApp.directive('splitterBar', function(){
  return {
    template: '',
    replace: false,
    restrict: 'E',
    link: function($scope, $element, $attributes){
      var $document = $(document);
      var $parent = $element.parent();
      function resize(mouseMoveEvent){
        var x = mouseMoveEvent.pageX - $parent.offset().left;
        var y = mouseMoveEvent.pageY - $parent.offset().top;
        x = |x;
        y = |y;
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
        }else{
          if( x < MIN_SIZE || x > $parent.width() - MIN_SIZE) {
            return;
          }
          $document.trigger('pane-resize');
          $element.css('left', x);
          $('#' + $attributes.leftPane).css('width', x);
          $('#' + $attributes.rightPane).css('width',
            $parent.width() - x - $element.width());
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
});
