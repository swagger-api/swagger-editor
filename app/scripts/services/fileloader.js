'use strict';

/*
 * File loader service to load file from a URL or string
*/
SwaggerEditor.service('FileLoader', function FileLoader($q, $http, defaults,
  YAML) {

  /**
   * Load a file from URL
   *
   * @param {string} url - the URL to load from
   * @param {boolean} disableProxy - disables cors-it proxy
   * @return {Promise} - resolves to content of the file
  */
  function loadFromUrl(url, disableProxy) {
    var deferred = $q.defer();

    if (disableProxy === undefined) {
      disableProxy = false;
    }

    // Temporarily use this service to get around non-CORSable URLs
    if (_.startsWith(url, 'http') && !disableProxy) {
      url = defaults.importProxyUrl + url;
    }

    $http({
      method: 'GET',
      url: url,
      headers: {
        accept: 'application/x-yaml,text/yaml,application/json,*/*'
      }
    }).then(function (resp) {
      if (angular.isObject(resp.data)) {
        YAML.dump(resp.data, function (error, yamlString) {
          if (error) { return deferred.reject(error); }

          deferred.resolve(yamlString);
        });
      } else {
        load(resp.data).then(deferred.resolve, deferred.reject);
      }
    });

    return deferred.promise;
  }

  /**
   * takes a JSON or YAML string, returns YAML string
   *
   * @param {string} string - the JSON or YAML raw string
   * @return {Promise}
   * @throws {TypeError} - resolves to a YAML string
  */
  function load(string) {
    var deferred = $q.defer();

    if (!angular.isString(string)) {
      throw new TypeError('load function only accepts a string');
    }

    YAML.load(string, function (error, json) {
      if (error) { return deferred.reject(error); }

      YAML.dump(json, function (error, yamlString) {
        if (error) { return deferred.reject(error); }

        deferred.resolve(yamlString);
      });
    });

    return deferred.promise;
  }

  // Load from Local file content (string)
  this.load = load;
  this.loadFromUrl = loadFromUrl;
});
