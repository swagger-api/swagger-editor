'use strict';

SwaggerEditor.controller('TryOperation', function ($scope, formdataFilter,
  AuthManager, SchemaForm) {

  var parameters = $scope.getParameters();
  var securityOptions = getSecurityOptions();
  var FILE_TYPE = ' F I L E '; // File key identifier for file types

  // binds to $scope
  $scope.generateUrl = generateUrl;
  $scope.makeCall = makeCall;
  $scope.xhrInProgress = false;
  $scope.parameters = parameters;
  $scope.getRequestBody = getRequestBody;
  $scope.hasRequestBody = hasRequestBody;
  $scope.getHeaders = getHeaders;
  $scope.requestModel = makeRequestModel();
  $scope.requestSchema = makeRequestSchema();
  $scope.hasFileParam = hasFileParam();
  // httpProtocol is static for now we can use HTTP2 later if we wanted
  $scope.httpProtocol = 'HTTP/1.1';
  $scope.locationHost = window.location.host;

  configureSchemaForm();

  // Deeply watch specs for updates to regenerate the from
  $scope.$watch('specs', function () {
    $scope.requestModel = makeRequestModel();
    $scope.requestSchema = makeRequestSchema();
  }, true);

  /*
   * configure SchemaForm directive based on request schema
  */
  function configureSchemaForm() {
    /*jshint camelcase: false */

    var defaultOptions = {
      theme: 'bootstrap3',
      remove_empty_properties: true,
      show_errors: 'change'
    };

    var looseOptions = {
      no_additional_properties: false,
      disable_properties: false,
      disable_edit_json: false
    };

    var loose = isLoose();

    SchemaForm.options = _.extend(defaultOptions, loose ? looseOptions : {});
  }

  /*
   * Determines if this request has a loose body parameter schema
   * A loose body parameter schema is a body parameter that allows additional
   * properties or has no properties object
   *
   * Note that "loose schema" is not a formal definition, we use this definition
   * here to determine type of form to render
   *
   * @returns {boolean}
  */
  function isLoose() {

    // loose schema is only for requests with body parameter
    if (!hasRequestBody()) {
      return false;
    }

    // we're accessing deep in the schema. many operations can fail here
    try {

      for (var p in $scope.requestSchema.properties.parameters.properties) {
        var param = $scope.requestSchema.properties.parameters.properties[p];
        if (param.in === 'body') {

          // loose object
          if (
              param.type === 'object' &&
              (param.additionalProperties ||
              _.isEmpty(param.properties))
            ) {

            return true;
          }

          // loose array of objects
          if (
              param.type === 'array' &&
              (param.items.additionalProperties ||
              _.isEmpty(param.items.properties))
            ) {

            return true;
          }
        }
      }
    } catch (e) {}

    return false;
  }

  /*
   * Makes the request schema to generate the form in the template
   * The schema has all required attributes for making a call for this operation
   *
   * @returns {object} - A JSON Schema containing all properties required to
   *   make this call
  */
  function makeRequestSchema() {

    // base schema
    var schema = {
      type: 'object',
      title: 'Request',
      required: ['scheme', 'accept'],
      properties: {
        scheme: {
          type: 'string',
          title: 'Scheme',

          // Add schemes
          enum: walkToProperty('schemes')
        },
        accept: {
          type: 'string',
          title: 'Accept',

          // All possible Accept headers
          enum: walkToProperty('produces')
        }
      }
    };

    // Only if there is a security definition add security property
    if (securityOptions.length) {
      schema.properties.security = {
        title: 'Security',
        description: 'Only authenticated security options are shown.',
        type: 'array',
        uniqueItems: true,
        items: {
          type: 'string',

          // All security options
          enum: securityOptions
        }
      };
    }

    // Add Content-Type header only if this operation has a body parameter
    if (hasRequestBody()) {
      var defaultConsumes = [
        'multipart/form-data',
        'x-www-form-urlencoded',
        'application/json'
      ];
      schema.properties.contentType = {
        type: 'string',
        title: 'Content-Type',
        enum: walkToProperty('consumes') || defaultConsumes
      };
    }

    // Only if there is a parameter add the parameters property
    if (parameters.length) {
      schema.properties.parameters = {
        type: 'object',
        title: 'Parameters',
        properties: {}
      };

      // Add a new property for each parameter
      parameters.map(pickSchemaFromParameter).map(normalizeJSONSchema)
      .forEach(function (paramSchema) {

        // extend the parameters property with the schema
        schema.properties.parameters
          .properties[paramSchema.name] = paramSchema;
      });
    }

    return schema;
  }

  /*
   * Makes a model with empty values that conforms to the JSON Schema generated
   *   by makeRequestSchema.
   *
   * @returns {object} - the model
  */
  function makeRequestModel() {

    // base model
    var model = {

      // Add first scheme as default scheme
      scheme: walkToProperty('schemes')[0],

      // Default Accept header is the first one
      accept: walkToProperty('produces')[0]
    };

    // if there is security options add the security property
    if (securityOptions.length) {
      model.security = securityOptions;
    }

    // Add Content-Type header only if this operation has a body parameter
    if (hasRequestBody()) {

      // Default to application/json
      model.contentType = 'application/json';
    }

    // Only if there is a parameter add the parameters default values
    if (parameters.length) {
      model.parameters = {};
      parameters.map(pickSchemaFromParameter).map(normalizeJSONSchema)
      .forEach(function (paramSchema) {
        var defaults = {
          object: {},
          array: [],
          integer: 0,
          string: ''
        };

        // if default value is provided use it
        if (angular.isDefined(paramSchema.default)) {
          model.parameters[paramSchema.name] = paramSchema.default;

        // if there is no default value but there is minimum or maximum use them
        } else if (angular.isDefined(paramSchema.minimum)) {
          model.parameters[paramSchema.name] = paramSchema.minimum;
        } else if (angular.isDefined(paramSchema.maximum)) {
          model.parameters[paramSchema.name] = paramSchema.maximum;

        // if there is no default value select a default value based on type
        } else if (angular.isDefined(defaults[paramSchema.type])) {

          var title = paramSchema.name || paramSchema.name;

          if (paramSchema.type === 'object') {
            model.parameters[title] = createEmptyObject(paramSchema);
          } else {
            model.parameters[title] = defaults[paramSchema.type];
          }

        // use empty string as fallback
        } else {
          model.parameters[paramSchema.name] = '';
        }
      });
    }

    return model;
  }

  /*
   * Fills in empty gaps of a JSON Schema. This method is mostly used to
   * normalize JSON Schema objects that are abstracted from Swagger parameters
   *
   * @param {object} - JSON Schema
   *
   * @returns {object} - Normalized JSON Schema
  */
  function normalizeJSONSchema(schema) {

    // provide title property if it's missing.
    if (!schema.title && angular.isString(schema.name)) {
      schema.title = schema.name;
    }

    // if schema is missing the "type" property fill it in based on available
    // properties
    if (!schema.type) {

      // it's an object if it has "properties" property
      if (schema.properties) {
        schema.type = 'object';
      }

      // it's an array if it has "items" property
      if (schema.items) {
        schema.type = 'array';
      }
    }

    // Swagger extended JSON Schema with a new type, file. If we see file type
    // we will add format: file to the schema so the form generator will render
    // a file input
    if (schema.type === 'file') {
      schema.type = 'string';
      schema.format = 'file';
    }

    return schema;
  }

  /*
   * Because some properties are cascading this walks up the tree to get them
   *
   * @param {string} propertyName
   *
   * @retusn {array|undefined} - list of possible properties
  */
  function walkToProperty(propertyName) {
    var defaultProperties = {
      produces: ['*/*'],
      schemes: ['http']
    };

    if (Array.isArray($scope.operation[propertyName])) {
      return $scope.operation[propertyName];
    } else if (Array.isArray($scope.specs[propertyName])) {
      return $scope.specs[propertyName];
    }

    // By default return the default property if it exists
    if (defaultProperties[propertyName]) {
      return defaultProperties[propertyName];
    }

    return undefined;
  }

  /*
   * Walks up the Swagger tree to find all possible security options
   *
   * @returns {array} - a list of security options or an empty array
  */
  function getSecurityOptions() {
    var securityOptions = [];

    // operation level securities
    if (_.isArray($scope.operation.security)) {
      $scope.operation.security.map(function (security) {
        _.keys(security).forEach(function (key) {
          securityOptions = securityOptions.concat(key);
        });
      });

    // root level securities
    } else if (_.isArray($scope.specs.security)) {
      $scope.specs.security.map(function (security) {
        _.keys(security).forEach(function (key) {
          securityOptions = securityOptions.concat(key);
        });
      });
    }

    return _.unique(securityOptions).filter(function (security) {

      // only return authenticated options
      return AuthManager.securityIsAuthenticated(security);
    });
  }

  /*
   * Picks JSON Schema from parameter
   * Since the parameter is a subset of JSON Schema we need to add
   * the missing properties
   *
   * @param {object} parameter - the parameter
   * @returns {object} - the schema
  */
  function pickSchemaFromParameter(parameter) {

    // if parameter has a schema populate it into the parameter so the parameter
    // has all schema properties
    if (parameter.schema) {
      return _.omit(_.extend(parameter, parameter.schema), 'schema');

    // if parameter does not have a schema, use the parameter itself as
    // schema.
    } else {
      return parameter;
    }
  }

  /*
   * Creates empty object from JSON Schema
   *
   * @param {object} schema - JSON Schema
   *
   * @returns {object} - result (empty object based on the schema)
  */
  function createEmptyObject(schema) {
    if (schema.type !== 'object') {
      throw new TypeError('schema should be an object schema.');
    }

    // TODO: expand this list
    var defaultValues = {
      string: '',
      integer: 0
    };

    var result = {};

    // If schema has no properties (loose schema), return the empty object
    if (!schema.properties) {
      return result;
    }

    Object.keys(schema.properties).forEach(function (propertyName) {

      // if this property is an object itself, recurse
      if (schema.properties[propertyName].type === 'object') {
        result[propertyName] =
          createEmptyObject(schema.properties[propertyName]);

      // otherwise use the defaultValues hash
      } else {
        result[propertyName] =
          defaultValues[schema.properties[propertyName].type] || null;
      }
    });

    return result;
  }

  /*
   * Generates a filter function based on type for filtering parameters
   *
   * @param {string} type
   *
   * @return {function} - the filter function
  */
  function parameterTypeFilter(type) {
    return function filterParams(parameter) {
      return parameter.in === type;
    };
  }

  /*
   * Used for generating a hash from array of parameters.
   *   This method is used in Array#reduce method iterations
   *
   * @param {object} hash - the hash passed around in iterations
   * @param {object} param - a Swagger parameter object
   *
   * @param {object} - complete hash from parameters to this iterations
  */
  function hashifyParams(hash, param) {
    if (!hash) {
      hash = {};
    }

    var paramValue = $scope.requestModel.parameters[param.name];
    var required = $scope.requestSchema.properties.parameters
      .properties[param.name].required === true;

    // if this parameter is not provided (empty string value) by user and it's
    // not required, move to next parameter without adding this one to the hash
    if (param.type === 'string' && paramValue === '' && !required) {
      return hash;
    }

    hash[param.name] = $scope.requestModel.parameters[param.name];

    return hash;
  }

  /*
   * Generates the URL for this call based on all parameters and other
   *   conditions
   *
   * @returns {string} - the URL
  */
  function generateUrl() {
    var requestModel = $scope.requestModel;
    var scheme = requestModel.scheme;
    var host = $scope.specs.host || window.location.host;
    var basePath = $scope.specs.basePath || '';
    var pathParams = parameters.filter(parameterTypeFilter('path'))
      .reduce(hashifyParams, {});
    var queryParams = parameters.filter(parameterTypeFilter('query'))
      .reduce(hashifyParams, {});
    var queryParamsStr;
    var pathStr;
    var isCollectionQueryParam = parameters.filter(parameterTypeFilter('query'))
      .some(function (parameter) {

        // if a query parameter has a collection format it doesn't matter what
        // is it's value, it will force the URL to not use `[]` in query string
        return parameter.items && parameter.items.collectionFormat;
      });

    // a regex that matches mustaches in path. e.g: /{pet}
    var pathParamRegex = /{([^{}]+)}/g;

    // if basePath is just a single slash (`/`), ignore it
    if (basePath === '/') {
      basePath = '';
    }

    // if there are selected securities and they are located in the query append
    // them to the URL
    if (angular.isArray(requestModel.security)) {
      requestModel.security.forEach(function (securityOption) {
        var auth = AuthManager.getAuth(securityOption);

        // if auth exists and it's an api key in query, add it to query params
        if (auth && auth.type === 'apiKey' && auth.security.in === 'query') {
          var authQueryParam = {};
          authQueryParam[auth.security.name] = auth.options.apiKey;
          _.extend(queryParams, authQueryParam);
        }
      });
    }

    // generate the query string portion of the URL based on query parameters
    queryParamsStr = window.decodeURIComponent(
      $.param(queryParams, isCollectionQueryParam));

    // fill in path parameter values inside the path
    pathStr = $scope.pathName.replace(pathParamRegex,

      // a simple replace method where it uses the available path parameter
      // value to replace the path parameter or leave it as it is if path
      // parameter doesn't exist.
      function (match) {
        var matchKey = match.substring(1, match.length - 1);

        if (angular.isDefined(pathParams[matchKey])) {
          return pathParams[matchKey];
        }

        return match;
      }
    );

    // queryParamsStr can be undefined. Fall back to empty string in that case
    queryParamsStr = queryParamsStr ? ('?' + queryParamsStr) : '';

    // constructing the URL
    return scheme + '://' + // example: http://
      host +                // example: api.example.com
      basePath +            // example: /v1
      pathStr +             // example: /users/me
      queryParamsStr;       // example: ?all=true
  }

  /*
   * Returns all header parameters
   *
   * @returns {object} - list of all parameters that are in header
  */
  function getHeaderParams() {

    // Select header parameters from all parameters and reduce them into a
    // single key/value hash where the key is parameter name
    var params = parameters.filter(parameterTypeFilter('header'))
      .reduce(hashifyParams, {});

    // add header based securities to list of headers
    if (angular.isArray($scope.requestModel.security)) {
      $scope.requestModel.security.forEach(function (secuirtyOption) {

        var auth = AuthManager.getAuth(secuirtyOption);

        if (auth) {
          var authHeader = {};

          // HTTP basic authentication is always in header
          if (auth.type === 'basic') {
            authHeader = {Authorization: 'Basic ' + auth.options.base64};

          // apiKey security can be in header, if it's in header use it
          } else if (auth.type === 'apiKey' && auth.security.in === 'header') {
            authHeader[auth.security.name] = auth.options.apiKey;

          // OAuth securities are always in header
          } else if (auth.type === 'oAuth2') {
            authHeader = {Authorization: 'Bearer ' + auth.options.accessToken};
          }

          // Extend the params hash with this auth
          params = _.extend(params, authHeader);
        }
      });
    }

    return params;
  }

  /*
   * Returns all headers needed to be shown in request preview
   *
   * @returns {object} - a hash of headers key/value pairs
  */
  function getHeaders() {
    var headerParams = getHeaderParams();
    var content = $scope.getRequestBody();

    // get spec host or default host in the window. remove port from Host header
    var host = ($scope.specs.host || window.location.host).replace(/\:.+/, '');

    // A list of default headers that will be included in the XHR call
    var defaultHeaders = {
      Host: host,
      Accept: $scope.requestModel.accept || '*/*',
      'Accept-Encoding': 'gzip,deflate,sdch', //TODO: where this is coming from?
      'Accept-Language': 'en-US,en;q=0.8,fa;q=0.6,sv;q=0.4', // TODO: wut?
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      Origin: window.location.origin,
      Referer: window.location.origin + window.location.pathname,
      'User-Agent': window.navigator.userAgent
    };

    headerParams = _.extend(defaultHeaders, headerParams);

    // if request has a body add Content-Type and Content-Length headers
    if (content !== null) {
      // TODO: handle file case
      headerParams['Content-Length'] = content.length;
      headerParams['Content-Type'] = $scope.requestModel.contentType;
    }

    return headerParams;
  }

  /*
   * Determines if request has a body. A request has body if it has a parameter
   *  that is in body or in form data
   *
   * @returns {boolean} - true if request has a body
  */
  function hasRequestBody() {
    var bodyParam = parameters.filter(parameterTypeFilter('body'));
    var formDataParams = parameters.filter(parameterTypeFilter('formData'));

    return bodyParam.length || formDataParams.length;
  }

  /*
   * Gets the body parameter's current value
   *
   * @returns {string|object|null} - body parameter value or null if there is
   *   request body
  */
  function getBodyModel() {

    if (!hasRequestBody()) {
      return null;
    }

    var bodyParam = parameters.filter(parameterTypeFilter('body'))[0];
    var formDataParams = parameters.filter(parameterTypeFilter('formData'));

    // body parameter case
    if (bodyParam) {
      var bodyParamName = bodyParam.name;
      var bodyParamValue =  $scope.requestModel.parameters[bodyParamName];

      // if body type is file then return special result object with FILE_TYPE
      // key
      if (bodyParam.format === 'file') {
        var result = {};

        result[FILE_TYPE] = bodyParamValue;

        return result;
      }

      return bodyParamValue;

    // formData case
    } else {
      return formDataParams.reduce(hashifyParams, {});
    }
  }

  /*
   * Gets the request body based on current form data and other parameters
   *
   * @returns {string|null} - Raw request body or null if there is no body model
  */
  function getRequestBody() {

    var bodyParam = parameters.filter(parameterTypeFilter('body'))[0];
    var bodyModel = getBodyModel();
    var contentType = $scope.requestModel.contentType;

    // if bodyModel doesn't exists, don't make a request body
    if (bodyModel === undefined || bodyModel === null) {
      return null;
    }

    // if body model is a file, return a FormData instance with the file in it
    if (bodyModel[FILE_TYPE]) {

      // TODO: put the mechanism of getting the file object into a method
      var bodyParamName = bodyParam.name;
      var form = new FormData();
      var inputEl = $('input[type="file"][name*="' + bodyParamName + '"]')[0];

      if (!inputEl) {
        return 'No file is selected';
      }

      var file = inputEl.files[0];
      if (!file) {
        return 'No file is selected';
      }

      form.append(bodyParamName, file, file.name);

      return form;
    }

    // if encoding is not defined, return body model as is
    if (!contentType) {
      return bodyModel;

    // if body has form-data encoding use formdataFilter to encode it to string
    } else if (/form\-data/.test(contentType)) {
      return formdataFilter(bodyModel);

    // if body has application/json encoding use JSON to stringify it
    } else if (/json/.test(contentType)) {
      return JSON.stringify(bodyModel, null, 2);

    // if encoding is x-www-form-urlencoded use jQuery.param method to stringify
    } else if (/urlencode/.test(contentType)) {
      return $.param(bodyModel);
    }

    return null;
  }

  /*
  * Returns true if this operation has a body param and that body param has
  *  a file
  *
  * @returns {boolean}
  */
  function hasFileParam() {
    return getRequestBody() && getRequestBody().indexOf(FILE_TYPE) > -1;
  }

  /*
   * Parse a HTTP response header string into hash of HTTP header key/values
   * into
   *
   * @headers {string} - HTTP Headers
   *
   * @return {object} - HTTP header key/value
  */
  function parseHeaders(headers) {
    var result = {};

    headers.split('\n').forEach(function (line) {
      var key = line.split(':')[0];
      var value = line.split(':')[1];
      if (key && angular.isString(key) && angular.isString(value)) {
        result[key.trim()] = value.trim();
      }
    });

    return result;
  }

  /*
   * Makes the XHR call
   *
  */
  function makeCall() {
    $scope.xhrInProgress = true;
    $scope.error = null;
    var omitHeaders = ['Host', 'Accept-Encoding', 'Connection', 'Origin',
      'Referer', 'User-Agent', 'Cache-Control', 'Content-Length'];

    $.ajax({
      url: $scope.generateUrl(),
      type: $scope.operationName,
      headers: _.omit($scope.getHeaders(), omitHeaders),
      data: $scope.getRequestBody(),
      contentType: $scope.contentType
    })

    .fail(function (jqXHR, textStatus, errorThrown) {
      $scope.xhrInProgress = false;
      $scope.textStatus = textStatus;
      $scope.error = errorThrown;
      $scope.xhr = jqXHR;

      $scope.$digest();
    })

    .done(function (data, textStatus, jqXHR) {
      $scope.textStatus = textStatus;
      $scope.xhrInProgress = false;
      $scope.responseData = data;
      $scope.xhr = jqXHR;
      $scope.responseHeaders = parseHeaders(jqXHR.getAllResponseHeaders());

      $scope.$digest();
    });
  }

  /*
   * Make pretty printed version of a JSON string
   *
   * @param {string} input
   *
   * @returns {string}
  */
  $scope.prettyPrint = function (input) {

    // Try if it's JSON and return pretty JSON
    try {
      return JSON.stringify(JSON.parse(input), null, 2);
    } catch (jsonError) {}

    return input;
  };

  /*
   * Returns true if response is JSON
   *
   * @param {string|object|array} value
   *
   * @returns {boolean}
  */
  $scope.isJson = function (value) {

    // if value is already parsed return true
    if (angular.isObject(value) || angular.isArray(value)) {
      return true;
    }

    var err;
    try {
      JSON.parse(value);
    } catch (error) {
      err = error;
    }

    return !err;
  };

  /*
   * Returns true if response is specified type
   *
   * @param {object} headers - response headers
   * @param {string} type - the type to check for
   *
   * @returns {boolean}
  */
  $scope.isType = function (headers, type) {
    var regex = new RegExp(type);
    headers = headers || {};

    return headers['Content-Type'] && regex.test(headers['Content-Type']);
  };

  /*
   * Determines if this call is cross-origin
   *
   * @returns {boolean}
  */
  $scope.isCrossOrigin = function () {
    return $scope.specs.host && $scope.specs.host !== $scope.locationHost;
  };
});
