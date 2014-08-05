'use strict';

PhonicsApp.service('FileLoader', ['$log', function FileLoader($log) {

  // Load from URL
  this.loadFromUrl = function (url) { $log(url); };

  // Load from Local file
  this.loadFromLocalFile = function (file) { $log(file); };
}]);
