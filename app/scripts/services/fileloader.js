'use strict';

/*
** takes a JSON or YAML string, returns YAML string
*/
function load(string) {
  var jsonError, yamlError;

  if (!angular.isString(string)) {
    throw new Error('load function only accepts a string');
  }

  // Try figuring out if it's a JSON string
  try {
    JSON.parse(string);
  } catch (error) {
    jsonError = error;
  }

  // if it's a JSON string, convert it to YAML string and return it
  if (!jsonError) {
    return jsyaml.dump(JSON.parse(string));
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

  // If it was neither JSON or YAML, throw an error
  throw new Error('load function called with an invalid string');
}

SwaggerEditor.service('FileLoader', function FileLoader($http, defaults) {

  // Load from URL
  this.loadFromUrl = function (url) {

    // Temporarily use this service to get around non-CORSable URLs
    if (angular.isString(url) && url.indexOf('http') === 0) {
      url = defaults.importProxyUrl + url;
    }

    return $http({
      method: 'GET',
      url: url,
      headers: {
        accept: 'application/x-yaml,text/yaml,application/json,*/*'
      }
    }).then(function (resp) {
      if (angular.isObject(resp.data)) {
        return jsyaml.dump(resp.data);
      } else {
        return load(resp.data);
      }
    });
  };

  // Load from Local file content (string)
  this.load = load;
});
