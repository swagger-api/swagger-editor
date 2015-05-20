'use strict';

/*
 * File loader service to load file from a URL or string
*/
SwaggerEditor.service('FileLoader', function FileLoader($http, defaults) {

  /*
   * Load a  file from URL
   *
   * @param {string} url - the URL to load from
   * @param {boolean} disableProxy - disables cors-it proxy
  */
  function loadFromUrl(url, disableProxy) {

    if (disableProxy === undefined) {
      disableProxy = false;
    }

    // Temporarily use this service to get around non-CORSable URLs
    if (_.startsWith(url, 'http') && !disableProxy) {
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
  }

  /*
   * takes a JSON or YAML string, returns YAML string
   *
   * @param {string} string - the JSON or YAML raw string
   *
   * @throws {TypeError}
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
    throw new TypeError('load function called with an invalid argument');
  }

  // Load from Local file content (string)
  this.load = load;
  this.loadFromUrl = loadFromUrl;
});
