'use strict'

PhonicsApp.filter('markdown', function() {
  return function markdownFilter(input){
    var output = null;
    if(input.indexOf('\n') > -1){
      output = markdown.toHTML(input);
    } else {
      output = input;
    }
    return output;
  };
});
