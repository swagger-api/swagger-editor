'use strict';

PhonicsApp.filter('markdown', ['marked', function (marked) {
  return function markdownFilter(input) {
    var output = null;
    if (input.indexOf('\n') > -1) {
      output = marked(input);
    } else {
      output = input;
    }
    return output;
  };
}]);
