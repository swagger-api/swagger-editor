'use strict';

SwaggerEditor.directive('collapseWhen', ['$interval', function ($interval) {
    // Speed of animation
    var ANIMATION_TIME = 30;

    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            scope.buffer = 0;

            /**
             * The function is responsible for drawing the animation
             * @param currentHeight
             */
            function draw(currentHeight) {
                element.css('height', currentHeight + 'px');
            };
            /**
             * The animation function for collapsing and expanding block (example, easy-out, easy-in)
             * @param isCollapsing
             * @param currentHeight
             * @param desiredHeight - height that should be reached
             */
            function animateCollapsingBlock(isCollapsing, currentHeight, desiredHeight) {
                var cssStyle = {};
                var delta = (desiredHeight - currentHeight) / ANIMATION_TIME;
                if (!isCollapsing) {
                    cssStyle = {
                        'height': 'auto'
                    };
                } else {
                    cssStyle = {
                        'height': desiredHeight
                    };
                }
                var timer = $interval(function () {
                    // Condition on animation end
                    if ((isCollapsing ^ (currentHeight >= desiredHeight))) {
                        $interval.cancel(timer);
                        currentHeight = 0;
                        element.css(cssStyle);
                        return;
                    }
                    currentHeight += delta;
                    draw(currentHeight);
                }, 0);
            };

            scope.$watch(attrs.collapseWhen, function (isExpanded) {
                    if (isExpanded) {
                        scope.buffer = element.height();
                        //  collapse the block
                        animateCollapsingBlock(isExpanded, scope.buffer, 0);
                    } else {
                        if (scope.buffer != 0) {
                            // expand the block
                            animateCollapsingBlock(isExpanded, 0, scope.buffer);
                        }
                    }
                }
            );
        }
    }
}]);
