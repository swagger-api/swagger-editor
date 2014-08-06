'use strict';

PhonicsApp.service('FileLoader', ['$log', function FileLoader($log) {

  // Load from URL
  this.loadFromUrl = function (url) {
    $log.log(url);
  };

  // Load from Local file
  this.load = function (fileContent) {
    $log.log(fileContent);
  };
}]);
