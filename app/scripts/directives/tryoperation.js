'use strict';

SwaggerEditor.controller('TryOperation', function ($scope, formdataFilter,
  AuthManager, SchemaForm) {
  var specs = $scope.$parent.specs;
  var rawModel = '';

  var parameters = $scope.getParameters();
  var hasBodyParam = parameters.some(function (param) {
    return param.in === 'body' || param.in === 'formData';
  });

  // httpProtocol is static for now we can use HTTP2 later if we wanted
  $scope.httpProtorcol = 'HTTP/1.1';

  // binds to $scope
  $scope.generateUrl = generateUrl;
  $scope.makeCall = makeCall;
  $scope.xhrInProgress = false;
  $scope.parameters = parameters;

  var securityOptions = getSecurityOptions();

  // setup SchemaForm
  SchemaForm.options = {
    theme: 'bootstrap3'
  };

  $scope.requestModel = makeRequestModel();
  $scope.requestSchema = makeRequestSchema();

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
    if (securityOptions) {
      schema.properties.security = {
        title: 'Security',
        description: 'Authenticate securities before using them.',
        type: 'array',
        uniqueItems: true,
        items: {
          type: 'string',

          // All security options
          // TODO: How to tell user some security options are not yet
          // authenticated?
          enum: securityOptions
        }
      };
    }

    // Add Content-Type header only if this operation has a body parameter
    if (hasBodyParam) {
      schema.properties.contentType = {
        type: 'string',
        title: 'Content-Type',
        enum: [
          'multipart/form-data',
          'application/x-www',
          'application/json'
        ]
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
          .properties[paramSchema.title] = paramSchema;
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
      scheme: [walkToProperty('schemes')[0]],

      // Default Accept header is the first one
      accept: walkToProperty('produces')[0]
    };

    // if there is security options add the security property
    if (securityOptions.length) {
      model.security = securityOptions[0];
    }

    // Add Content-Type header only if this operation has a body parameter
    if (hasBodyParam) {

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
          model.parameters[paramSchema.title] = paramSchema.default;

        // if there is no default value select a default value based on type
        } else if (angular.isDefined(defaults[paramSchema.type])) {

          var title = paramSchema.title || paramSchema.name;

          if (paramSchema.type === 'object') {
            model.parameters[title] = createEmptyObject(paramSchema);
          } else {
            model.parameters[title] = defaults[paramSchema.type];
          }

        // use empty string as fallback
        } else {
          model.parameters[paramSchema.title] = '';
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
    // we are going to make it an object with a specific key
    // TODO: Figure out file upload
    if (schema.type === 'file') {
      schema.type = 'object';
      schema.properties = {
        '__file__(not implemented yet)': {type: 'boolean'}
      };
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
    if (Array.isArray($scope.operation.security)) {
      securityOptions = securityOptions.concat(
        $scope.operation.security.map(function (security) {
          return Object.keys(security)[0];
        })
      );
    }
    if (Array.isArray($scope.specs.security)) {
      securityOptions = securityOptions.concat(
        $scope.specs.security.map(function (security) {
          return Object.keys(security)[0];
        })
      );
    }
    return _.unique(securityOptions);
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

    // if parameter has a schema use it directly
    if (parameter.schema) {
      return parameter.schema;

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

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ------------------------------ OLD STUFF ----------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  /*
   * Generates a filter function based on type for filtering parameters
   *
   * @param {string} type
   *
   * @return {function} - the filter function
  */
  function filterParamsFor(type) {
    return function filterParams(result, param) {
      if (param.in === type && param.model[param.name] &&
        param['default'] !== param.model[param.name]) {
        result[param.name] = param.model[param.name];
      }
      return result;
    };
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
    var host = specs.host || window.location.host;
    var basePath = specs.basePath || '';
    var pathParams = parameters.reduce(filterParamsFor('path'), {});
    var queryParams = parameters.reduce(filterParamsFor('query'), {});
    var queryParamsStr;
    var pathStr;

    // a regex that matches mustaches in path. e.g: /{pet}
    var pathParamRegex = /{([^{}]+)}/g;

    // if basePath is just a single slash (`/`), ignore it
    if (basePath === '/') {
      basePath = '';
    }

    // if there are selected securities and they are located in the query append
    // them to the URL
    if (requestModel.security) {
      for (var securityOption in requestModel.security) {
        var auth = AuthManager.getAuth(securityOption);

        // if auth exists and it's an api key in query, add it to query params
        if (auth && auth.type === 'apiKey' && auth.security.in === 'query') {
          var authQueryParam = {};
          authQueryParam[auth.security.name] = auth.options.apiKey;
          _.extend(queryParams, authQueryParam);
        }
      }
    }

    // generate the query string portion of the URL based on query parameters
    queryParamsStr = window.decodeURIComponent($.param(queryParams));

    // fill in path parameter values inside the path
    pathStr = $scope.path.pathName.replace(pathParamRegex,

      // a simple replace method where it uses the available path parameter
      // value to replace the path parameter or leave it as it is if path
      // parameter doesn't exist.
      function (match) {
        return pathParams[match.substring(1, match.length - 1)] || match;
      }
    );

    // queryParamsStr can be undefined. Fall back to empty string in that case
    queryParamsStr = queryParamsStr || '';

    // constructing the URL
    return scheme + '://' + // example: http://
      host +                // example: api.example.com
      basePath +            // example: /v1
      pathStr +             // example: /users/me
      queryParamsStr;       // example: ?all=true
  }

  $scope.hasBodyParam = hasBodyParam;

  $scope.rawChanged = function (change) {
    var editor = change[1];
    rawModel = editor.getValue();
  };

  function getBodyModel() {

    // scan parameters, check for first parameter with in === 'body'. If found
    // return model for that parameter. You
    for (var i = 0; i < $scope.parameters.length; i++) {
      if ($scope.parameters[i].in === 'body') {
        return modelOfParameter($scope.parameters[i]);
      }
    }

    return $scope.parameters.filter(function (param) {
      return param.in === 'formData';
    }).reduce(function (total, param) {
      return _.extend(total, modelOfParameter(param));
    }, {});
  }

  $scope.getRequestBody = function () {

    if ($scope.inputMode === 'raw') {
      return rawModel;
    }

    var bodyModel = getBodyModel();

    if (!$scope.contentType) {
      return '';
    } else if ($scope.contentType.indexOf('form-data') > -1) {
      return formdataFilter(bodyModel);
    } else if ($scope.contentType.indexOf('application/json') > -1) {
      return JSON.stringify(bodyModel, null, 2);
    } else if ($scope.contentType.indexOf('x-www-form-urlencoded') > -1) {
      return $.param(bodyModel);
    }

    return '';
  };

  function getHeaderParams() {
    var parameters = $scope.parameters.filter(function (param) {
      return param.in === 'header';
    }).reduce(function (obj, param) {
      var model = modelOfParameter(param)[param.name];
      if (model) {
        obj[param.name] = model;
      }
      return obj;
    }, {});

    $scope.selectedSecuries.forEach(function (selectedSecurity) {

      // If Auth that extend the parameters with `Authentication parameter
      var auth = AuthManager.getAuth(selectedSecurity);
      if (auth) {
        var authHeader = null;
        if (auth.type === 'basic') {
          authHeader = {Authorization: 'Basic ' + auth.options.base64};
        } else if (auth.type === 'apiKey' && auth.security.in === 'header') {
          authHeader = {};
          authHeader[auth.security.name] = auth.options.apiKey;
        } else if (auth.type === 'oAuth2') {
          authHeader = {Authorization: 'Bearer ' + auth.options.accessToken};
        }

        parameters = _.extend(parameters, authHeader);
      }
    });

    return parameters;
  }

  $scope.getHeaders = function () {
    var headerParams = getHeaderParams();
    var content = $scope.getRequestBody();

    headerParams = _.extend(headerParams, {
      Host: ($scope.specs.host || window.location.host)

        // remove port from Host header
        .replace(/\:.+/, ''),
      Accept: $scope.accepts || '*/*',
      'Accept-Encoding': 'gzip,deflate,sdch', //TODO: where this is coming from?
      'Accept-Language': 'en-US,en;q=0.8,fa;q=0.6,sv;q=0.4', // TODO: wut?
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      Origin: window.location.origin,
      Referer: window.location.origin + window.location.pathname,
      'User-Agent': window.navigator.userAgent
    });

    if (content) {
      headerParams['Content-Length'] = content.length;
      headerParams['Content-Type'] = $scope.contentType;
    }

    return headerParams;
  };

  $scope.walkToProperty = walkToProperty;

  /*
   * Get model of a parameter
  */
  function modelOfParameter(param) {
    // part of horrible hack for json schema form
    if (Array.isArray(param.model[param.name])) {
      return param.model[param.name];
    }
    return param.model;
  }

  function makeCall() {
    $scope.xhrInProgress = true;
    $scope.error = null;
    var omitHeaders = ['Host', 'Accept-Encoding', 'Connection', 'Origin',
      'Referer', 'User-Agent', 'Cache-Control', 'Content-Length'];

    $.ajax({
      url: $scope.generateUrl(),
      type: $scope.operation.operationName,
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
      $scope.responseHeaders = getResponseHeaders(jqXHR);

      $scope.$digest();
    });
  }

  $scope.setInputMode = function (mode) {
    $scope.inputMode = mode;
  };

  $scope.prettyPrint = function (input) {
    // Try if it's JSON
    try {
      return JSON.stringify(JSON.parse(input), null, 2);
    } catch (jsonError) {}

    return input;
  };

  // Returns true if response is JSON
  $scope.isJson = function (value) {
    var err;
    try {
      JSON.parse(value);
    } catch (error) {
      err = error;
    }

    return !err;
  };

  $scope.isHTML = function (value) {
    var a = window.document.createElement('div');
    a.innerHTML = value;
    for (var c = a.childNodes, i = c.length; i--;) {
      if (c[i].nodeType === 1) {
        return true;
      }
    }
    return false;
  };

  $scope.isPlain = function (value) {
    return !$scope.isHTML(value) && !$scope.isJson(value);
  };

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

  function getResponseHeaders(xhr) {
    return parseHeaders(xhr.getAllResponseHeaders());
  }

  $scope.getSecurityOptions = getSecurityOptions;
  $scope.securityIsAuthenticated = function (securityName) {
    return AuthManager.securityIsAuthenticated(securityName);
  };
});
