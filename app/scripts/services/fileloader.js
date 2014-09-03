'use strict';

/*
** takes a JSON or YAML string, returns YAML string
*/
function load(string) {
  var jsonError, yamlError;

  if (!angular.isString(string)) {
    throw new Error('load function only accepts a string');
  }

  // Try parsing the string as a YAML string  and capture the error
  try {
    jsyaml.load(string);
  } catch (error) {
    yamlError = error;
  }

  // If there was no error in parsing the string as a YAML string
  // return the original string
  if (!yamlError) {
    return string;
  }

  // If it wasn't a YAML string, try figuring out if it's a JSON string
  try {
    JSON.parse(string);
  } catch (error) {
    jsonError = error;
  }

  // if it's a JSON string, convert it to YAML string and return it
  if (!jsonError) {
    return jsyaml.dump(JSON.parse(string));
  }

  // If it was neither JSON or YAML, throw an error
  throw new Error('load function called with an invalid string');
}

PhonicsApp.service('FileLoader', function FileLoader($http) {

  // Load from URL
  this.loadFromUrl = function (url) {
    return $http.get(url).then(function (resp) {
      return load(resp.data);
    });
  };

  // Load from Local file content (string)
  this.load = load;
});
