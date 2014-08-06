'use strict';


function load(fileContent) {

  // Figure out file type
  var json = null;
  var yaml = null;
  try {
    json = JSON.parse(fileContent);
  } catch (jsonError) {}
  if (!json){
    try {
      yaml = jsyaml.load(fileContent);
    } catch (yamlError) {}
  }

  if (json) {
    return json;
  }
  if (yaml) {
    return yaml;
  }
  return null;
}

PhonicsApp.service('FileLoader', ['$http', function FileLoader($http) {

  // Load from URL
  this.loadFromUrl = function (url) {
    return $http.get(url).then(load);
  };

  // Load from Local file content (string)
  this.load = load;
}]);
