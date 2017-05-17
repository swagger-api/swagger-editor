/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _concat = __webpack_require__(1);

	var _concat2 = _interopRequireDefault(_concat);

	var _validator = __webpack_require__(16);

	var _hook = __webpack_require__(168);

	var _ast = __webpack_require__(74);

	var _getTimestamp = __webpack_require__(191);

	var _getTimestamp2 = _interopRequireDefault(_getTimestamp);

	var _register = __webpack_require__(252);

	var _register2 = _interopRequireDefault(_register);

	var _modes = __webpack_require__(254);

	var _modes2 = _interopRequireDefault(_modes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(0, _register2.default)(function (_ref) {
	  var jsSpec = _ref.jsSpec,
	      resolvedSpec = _ref.resolvedSpec,
	      specStr = _ref.specStr,
	      mode = _ref.mode;

	  var boundGetLineNumber = _ast.getLineNumberForPath.bind(null, specStr);

	  if (!_modes2.default[mode]) {
	    return console.error("WARNING: Validation plugin was supplied an invalid mode. Skipping validation.");
	  }

	  var settings = _modes2.default[mode];

	  var inputs = {
	    jsSpec: jsSpec,
	    resolvedSpec: resolvedSpec,
	    specStr: specStr,
	    settings: settings,
	    getLineNumberForPath: boundGetLineNumber
	  };

	  var perfArray = [];
	  var LOG_VALIDATION_PERF = (null) !== "production";

	  var markStep = function markStep(step) {
	    return perfArray.push({ step: step, stamp: (0, _getTimestamp2.default)() });
	  };
	  markStep("origin");

	  // Generate errors based on the spec
	  var structuralValidationResult = settings.runStructural ? (0, _validator.validate)(inputs) : [];
	  markStep("structural");

	  var semanticValidatorResult = settings.runSemantic ? (0, _hook.runSemanticValidators)(inputs) : [];
	  markStep("semantic");

	  var combinedErrors = (0, _concat2.default)([], semanticValidatorResult, structuralValidationResult);
	  markStep("combine");

	  if (LOG_VALIDATION_PERF) {
	    perfArray.forEach(function (el, i) {
	      if (i === 0) return;
	      // eslint-disable-next-line no-console
	      console.log(el.step + " took " + (el.stamp - perfArray[i - 1].stamp) + "ms");
	    });
	  }

	  return combinedErrors;
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayPush = __webpack_require__(2),
	    baseFlatten = __webpack_require__(3),
	    copyArray = __webpack_require__(15),
	    isArray = __webpack_require__(14);

	/**
	 * Creates a new array concatenating `array` with any additional arrays
	 * and/or values.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Array
	 * @param {Array} array The array to concatenate.
	 * @param {...*} [values] The values to concatenate.
	 * @returns {Array} Returns the new concatenated array.
	 * @example
	 *
	 * var array = [1];
	 * var other = _.concat(array, 2, [3], [[4]]);
	 *
	 * console.log(other);
	 * // => [1, 2, 3, [4]]
	 *
	 * console.log(array);
	 * // => [1]
	 */
	function concat() {
	  var length = arguments.length;
	  if (!length) {
	    return [];
	  }
	  var args = Array(length - 1),
	      array = arguments[0],
	      index = length;

	  while (index--) {
	    args[index - 1] = arguments[index];
	  }
	  return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
	}

	module.exports = concat;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;

	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}

	module.exports = arrayPush;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayPush = __webpack_require__(2),
	    isFlattenable = __webpack_require__(4);

	/**
	 * The base implementation of `_.flatten` with support for restricting flattening.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {number} depth The maximum recursion depth.
	 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
	 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, depth, predicate, isStrict, result) {
	  var index = -1,
	      length = array.length;

	  predicate || (predicate = isFlattenable);
	  result || (result = []);

	  while (++index < length) {
	    var value = array[index];
	    if (depth > 0 && predicate(value)) {
	      if (depth > 1) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, depth - 1, predicate, isStrict, result);
	      } else {
	        arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}

	module.exports = baseFlatten;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(5),
	    isArguments = __webpack_require__(8),
	    isArray = __webpack_require__(14);

	/** Built-in value references. */
	var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

	/**
	 * Checks if `value` is a flattenable `arguments` object or array.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
	 */
	function isFlattenable(value) {
	  return isArray(value) || isArguments(value) ||
	    !!(spreadableSymbol && value && value[spreadableSymbol]);
	}

	module.exports = isFlattenable;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var root = __webpack_require__(6);

	/** Built-in value references. */
	var Symbol = root.Symbol;

	module.exports = Symbol;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var freeGlobal = __webpack_require__(7);

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	module.exports = root;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

	module.exports = freeGlobal;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsArguments = __webpack_require__(9),
	    isObjectLike = __webpack_require__(13);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
	  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
	    !propertyIsEnumerable.call(value, 'callee');
	};

	module.exports = isArguments;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(10),
	    isObjectLike = __webpack_require__(13);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';

	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
	  return isObjectLike(value) && baseGetTag(value) == argsTag;
	}

	module.exports = baseIsArguments;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(5),
	    getRawTag = __webpack_require__(11),
	    objectToString = __webpack_require__(12);

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}

	module.exports = baseGetTag;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(5);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}

	module.exports = getRawTag;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}

	module.exports = objectToString;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	module.exports = isArray;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	module.exports = copyArray;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.









	validate = validate;var _jsonschema = __webpack_require__(17);var _jsonschema2 = _interopRequireDefault(_jsonschema);var _pathTranslator = __webpack_require__(28);var _jsonSchema = __webpack_require__(73);var _jsonSchema2 = _interopRequireDefault(_jsonSchema);var _ast = __webpack_require__(74);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var validator = new _jsonschema2.default.Validator();validator.addSchema(_jsonSchema2.default);function validate(_ref) {var jsSpec = _ref.jsSpec,specStr = _ref.specStr,_ref$settings = _ref.settings,settings = _ref$settings === undefined ? {} : _ref$settings;
	  settings.schemas.forEach(function (schema) {return validator.addSchema(schema);});
	  return validator.validate(jsSpec, settings.testSchema || {}).
	  errors.map(function (err) {
	    return {
	      level: "error",
	      line: (0, _ast.getLineNumberForPath)(specStr, (0, _pathTranslator.transformPathToArray)(err.property, jsSpec) || []),
	      path: err.property.replace("instance.", ""),
	      message: err.message,
	      source: "schema",
	      original: err // this won't make it into state, but is still helpful
	    };
	  });
	}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Validator = module.exports.Validator = __webpack_require__(18);

	module.exports.ValidatorResult = __webpack_require__(27).ValidatorResult;
	module.exports.ValidationError = __webpack_require__(27).ValidationError;
	module.exports.SchemaError = __webpack_require__(27).SchemaError;

	module.exports.validate = function (instance, schema, options) {
	  var v = new Validator();
	  return v.validate(instance, schema, options);
	};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var urilib = __webpack_require__(19);

	var attribute = __webpack_require__(26);
	var helpers = __webpack_require__(27);
	var ValidatorResult = helpers.ValidatorResult;
	var SchemaError = helpers.SchemaError;
	var SchemaContext = helpers.SchemaContext;

	/**
	 * Creates a new Validator object
	 * @name Validator
	 * @constructor
	 */
	var Validator = function Validator () {
	  // Allow a validator instance to override global custom formats or to have their
	  // own custom formats.
	  this.customFormats = Object.create(Validator.prototype.customFormats);
	  this.schemas = {};
	  this.unresolvedRefs = [];

	  // Use Object.create to make this extensible without Validator instances stepping on each other's toes.
	  this.types = Object.create(types);
	  this.attributes = Object.create(attribute.validators);
	};

	// Allow formats to be registered globally.
	Validator.prototype.customFormats = {};

	// Hint at the presence of a property
	Validator.prototype.schemas = null;
	Validator.prototype.types = null;
	Validator.prototype.attributes = null;
	Validator.prototype.unresolvedRefs = null;

	/**
	 * Adds a schema with a certain urn to the Validator instance.
	 * @param schema
	 * @param urn
	 * @return {Object}
	 */
	Validator.prototype.addSchema = function addSchema (schema, uri) {
	  if (!schema) {
	    return null;
	  }
	  var ourUri = uri || schema.id;
	  this.addSubSchema(ourUri, schema);
	  if (ourUri) {
	    this.schemas[ourUri] = schema;
	  }
	  return this.schemas[ourUri];
	};

	Validator.prototype.addSubSchema = function addSubSchema(baseuri, schema) {
	  if(!schema || typeof schema!='object') return;
	  // Mark all referenced schemas so we can tell later which schemas are referred to, but never defined
	  if(schema.$ref){
	    var resolvedUri = urilib.resolve(baseuri, schema.$ref);
	    // Only mark unknown schemas as unresolved
	    if (this.schemas[resolvedUri] === undefined) {
	      this.schemas[resolvedUri] = null;
	      this.unresolvedRefs.push(resolvedUri);
	    }
	    return;
	  }
	  var ourUri = schema.id && urilib.resolve(baseuri, schema.id);
	  var ourBase = ourUri || baseuri;
	  if (ourUri) {
	    if(this.schemas[ourUri]){
	      if(!helpers.deepCompareStrict(this.schemas[ourUri], schema)){
	        throw new Error('Schema <'+schema+'> already exists with different definition');
	      }
	      return this.schemas[ourUri];
	    }
	    this.schemas[ourUri] = schema;
	    var documentUri = ourUri.replace(/^([^#]*)#$/, '$1');
	    this.schemas[documentUri] = schema;
	  }
	  this.addSubSchemaArray(ourBase, ((schema.items instanceof Array)?schema.items:[schema.items]));
	  this.addSubSchemaArray(ourBase, ((schema.extends instanceof Array)?schema.extends:[schema.extends]));
	  this.addSubSchema(ourBase, schema.additionalItems);
	  this.addSubSchemaObject(ourBase, schema.properties);
	  this.addSubSchema(ourBase, schema.additionalProperties);
	  this.addSubSchemaObject(ourBase, schema.definitions);
	  this.addSubSchemaObject(ourBase, schema.patternProperties);
	  this.addSubSchemaObject(ourBase, schema.dependencies);
	  this.addSubSchemaArray(ourBase, schema.disallow);
	  this.addSubSchemaArray(ourBase, schema.allOf);
	  this.addSubSchemaArray(ourBase, schema.anyOf);
	  this.addSubSchemaArray(ourBase, schema.oneOf);
	  this.addSubSchema(ourBase, schema.not);
	  return this.schemas[ourUri];
	};

	Validator.prototype.addSubSchemaArray = function addSubSchemaArray(baseuri, schemas) {
	  if(!(schemas instanceof Array)) return;
	  for(var i=0; i<schemas.length; i++){
	    this.addSubSchema(baseuri, schemas[i]);
	  }
	};

	Validator.prototype.addSubSchemaObject = function addSubSchemaArray(baseuri, schemas) {
	  if(!schemas || typeof schemas!='object') return;
	  for(var p in schemas){
	    this.addSubSchema(baseuri, schemas[p]);
	  }
	};



	/**
	 * Sets all the schemas of the Validator instance.
	 * @param schemas
	 */
	Validator.prototype.setSchemas = function setSchemas (schemas) {
	  this.schemas = schemas;
	};

	/**
	 * Returns the schema of a certain urn
	 * @param urn
	 */
	Validator.prototype.getSchema = function getSchema (urn) {
	  return this.schemas[urn];
	};

	/**
	 * Validates instance against the provided schema
	 * @param instance
	 * @param schema
	 * @param [options]
	 * @param [ctx]
	 * @return {Array}
	 */
	Validator.prototype.validate = function validate (instance, schema, options, ctx) {
	  if (!options) {
	    options = {};
	  }
	  var propertyName = options.propertyName || 'instance';
	  // This will work so long as the function at uri.resolve() will resolve a relative URI to a relative URI
	  var base = urilib.resolve(options.base||'/', schema.id||'');
	  if(!ctx){
	    ctx = new SchemaContext(schema, options, propertyName, base, Object.create(this.schemas));
	    if (!ctx.schemas[base]) {
	      ctx.schemas[base] = schema;
	    }
	  }
	  if (schema) {
	    var result = this.validateSchema(instance, schema, options, ctx);
	    if (!result) {
	      throw new Error('Result undefined');
	    }
	    return result;
	  }
	  throw new SchemaError('no schema specified', schema);
	};

	/**
	* @param Object schema
	* @return mixed schema uri or false
	*/
	function shouldResolve(schema) {
	  var ref = (typeof schema === 'string') ? schema : schema.$ref;
	  if (typeof ref=='string') return ref;
	  return false;
	}

	/**
	 * Validates an instance against the schema (the actual work horse)
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @private
	 * @return {ValidatorResult}
	 */
	Validator.prototype.validateSchema = function validateSchema (instance, schema, options, ctx) {
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!schema) {
	    throw new Error("schema is undefined");
	  }

	  if (schema['extends']) {
	    if (schema['extends'] instanceof Array) {
	      var schemaobj = {schema: schema, ctx: ctx};
	      schema['extends'].forEach(this.schemaTraverser.bind(this, schemaobj));
	      schema = schemaobj.schema;
	      schemaobj.schema = null;
	      schemaobj.ctx = null;
	      schemaobj = null;
	    } else {
	      schema = helpers.deepMerge(schema, this.superResolve(schema['extends'], ctx));
	    }
	  }

	  var switchSchema;
	  if (switchSchema = shouldResolve(schema)) {
	    var resolved = this.resolve(schema, switchSchema, ctx);
	    var subctx = new SchemaContext(resolved.subschema, options, ctx.propertyPath, resolved.switchSchema, ctx.schemas);
	    return this.validateSchema(instance, resolved.subschema, options, subctx);
	  }

	  var skipAttributes = options && options.skipAttributes || [];
	  // Validate each schema attribute against the instance
	  for (var key in schema) {
	    if (!attribute.ignoreProperties[key] && skipAttributes.indexOf(key) < 0) {
	      var validatorErr = null;
	      var validator = this.attributes[key];
	      if (validator) {
	        validatorErr = validator.call(this, instance, schema, options, ctx);
	      } else if (options.allowUnknownAttributes === false) {
	        // This represents an error with the schema itself, not an invalid instance
	        throw new SchemaError("Unsupported attribute: " + key, schema);
	      }
	      if (validatorErr) {
	        result.importErrors(validatorErr);
	      }
	    }
	  }

	  if (typeof options.rewrite == 'function') {
	    var value = options.rewrite.call(this, instance, schema, options, ctx);
	    result.instance = value;
	  }
	  return result;
	};

	/**
	* @private
	* @param Object schema
	* @param SchemaContext ctx
	* @returns Object schema or resolved schema
	*/
	Validator.prototype.schemaTraverser = function schemaTraverser (schemaobj, s) {
	  schemaobj.schema = helpers.deepMerge(schemaobj.schema, this.superResolve(s, schemaobj.ctx));
	}

	/**
	* @private
	* @param Object schema
	* @param SchemaContext ctx
	* @returns Object schema or resolved schema
	*/
	Validator.prototype.superResolve = function superResolve (schema, ctx) {
	  var ref;
	  if(ref = shouldResolve(schema)) {
	    return this.resolve(schema, ref, ctx).subschema;
	  }
	  return schema;
	}

	/**
	* @private
	* @param Object schema
	* @param Object switchSchema
	* @param SchemaContext ctx
	* @return Object resolved schemas {subschema:String, switchSchema: String}
	* @thorws SchemaError
	*/
	Validator.prototype.resolve = function resolve (schema, switchSchema, ctx) {
	  switchSchema = ctx.resolve(switchSchema);
	  // First see if the schema exists under the provided URI
	  if (ctx.schemas[switchSchema]) {
	    return {subschema: ctx.schemas[switchSchema], switchSchema: switchSchema};
	  }
	  // Else try walking the property pointer
	  var parsed = urilib.parse(switchSchema);
	  var fragment = parsed && parsed.hash;
	  var document = fragment && fragment.length && switchSchema.substr(0, switchSchema.length - fragment.length);
	  if (!document || !ctx.schemas[document]) {
	    throw new SchemaError("no such schema <" + switchSchema + ">", schema);
	  }
	  var subschema = helpers.objectGetPath(ctx.schemas[document], fragment.substr(1));
	  if(subschema===undefined){
	    throw new SchemaError("no such schema " + fragment + " located in <" + document + ">", schema);
	  }
	  return {subschema: subschema, switchSchema: switchSchema};
	};

	/**
	 * Tests whether the instance if of a certain type.
	 * @private
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @param type
	 * @return {boolean}
	 */
	Validator.prototype.testType = function validateType (instance, schema, options, ctx, type) {
	  if (typeof this.types[type] == 'function') {
	    return this.types[type].call(this, instance);
	  }
	  if (type && typeof type == 'object') {
	    var res = this.validateSchema(instance, type, options, ctx);
	    return res === undefined || !(res && res.errors.length);
	  }
	  // Undefined or properties not on the list are acceptable, same as not being defined
	  return true;
	};

	var types = Validator.prototype.types = {};
	types.string = function testString (instance) {
	  return typeof instance == 'string';
	};
	types.number = function testNumber (instance) {
	  // isFinite returns false for NaN, Infinity, and -Infinity
	  return typeof instance == 'number' && isFinite(instance);
	};
	types.integer = function testInteger (instance) {
	  return (typeof instance == 'number') && instance % 1 === 0;
	};
	types.boolean = function testBoolean (instance) {
	  return typeof instance == 'boolean';
	};
	types.array = function testArray (instance) {
	  return instance instanceof Array;
	};
	types['null'] = function testNull (instance) {
	  return instance === null;
	};
	types.date = function testDate (instance) {
	  return instance instanceof Date;
	};
	types.any = function testAny (instance) {
	  return true;
	};
	types.object = function testObject (instance) {
	  // TODO: fix this - see #15
	  return instance && (typeof instance) === 'object' && !(instance instanceof Array) && !(instance instanceof Date);
	};

	module.exports = Validator;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var punycode = __webpack_require__(20);
	var util = __webpack_require__(22);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // Special case for a simple path URL
	    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(23);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && util.isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!util.isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  // Copy chrome, IE, opera backslash-handling behavior.
	  // Back slashes before the query string get converted to forward slashes
	  // See: https://code.google.com/p/chromium/issues/detail?id=25916
	  var queryIndex = url.indexOf('?'),
	      splitter =
	          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
	      uSplit = url.split(splitter),
	      slashRegex = /\\/g;
	  uSplit[0] = uSplit[0].replace(slashRegex, '/');
	  url = uSplit.join(splitter);

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  if (!slashesDenoteHost && url.split('#').length === 1) {
	    // Try fast path regexp
	    var simplePath = simplePathPattern.exec(rest);
	    if (simplePath) {
	      this.path = rest;
	      this.href = rest;
	      this.pathname = simplePath[1];
	      if (simplePath[2]) {
	        this.search = simplePath[2];
	        if (parseQueryString) {
	          this.query = querystring.parse(this.search.substr(1));
	        } else {
	          this.query = this.search.substr(1);
	        }
	      } else if (parseQueryString) {
	        this.search = '';
	        this.query = {};
	      }
	      return this;
	    }
	  }

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a punycoded representation of "domain".
	      // It only converts parts of the domain name that
	      // have non-ASCII characters, i.e. it doesn't matter if
	      // you call it with a domain that already is ASCII-only.
	      this.hostname = punycode.toASCII(this.hostname);
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      if (rest.indexOf(ae) === -1)
	        continue;
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (util.isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      util.isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (util.isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  var tkeys = Object.keys(this);
	  for (var tk = 0; tk < tkeys.length; tk++) {
	    var tkey = tkeys[tk];
	    result[tkey] = this[tkey];
	  }

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    var rkeys = Object.keys(relative);
	    for (var rk = 0; rk < rkeys.length; rk++) {
	      var rkey = rkeys[rk];
	      if (rkey !== 'protocol')
	        result[rkey] = relative[rkey];
	    }

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      var keys = Object.keys(relative);
	      for (var v = 0; v < keys.length; v++) {
	        var k = keys[v];
	        result[k] = relative[k];
	      }
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!util.isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especially happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host || srcPath.length > 1) &&
	      (last === '.' || last === '..') || last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last === '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especially happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)(module), (function() { return this; }())))

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 22 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = {
	  isString: function(arg) {
	    return typeof(arg) === 'string';
	  },
	  isObject: function(arg) {
	    return typeof(arg) === 'object' && arg !== null;
	  },
	  isNull: function(arg) {
	    return arg === null;
	  },
	  isNullOrUndefined: function(arg) {
	    return arg == null;
	  }
	};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(24);
	exports.encode = exports.stringify = __webpack_require__(25);


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var helpers = __webpack_require__(27);

	/** @type ValidatorResult */
	var ValidatorResult = helpers.ValidatorResult;
	/** @type SchemaError */
	var SchemaError = helpers.SchemaError;

	var attribute = {};

	attribute.ignoreProperties = {
	  // informative properties
	  'id': true,
	  'default': true,
	  'description': true,
	  'title': true,
	  // arguments to other properties
	  'exclusiveMinimum': true,
	  'exclusiveMaximum': true,
	  'additionalItems': true,
	  // special-handled properties
	  '$schema': true,
	  '$ref': true,
	  'extends': true
	};

	/**
	 * @name validators
	 */
	var validators = attribute.validators = {};

	/**
	 * Validates whether the instance if of a certain type
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {ValidatorResult|null}
	 */
	validators.type = function validateType (instance, schema, options, ctx) {
	  // Ignore undefined instances
	  if (instance === undefined) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var types = Array.isArray(schema.type) ? schema.type : [schema.type];
	  if (!types.some(this.testType.bind(this, instance, schema, options, ctx))) {
	    var list = types.map(function (v) {
	      return v.id && ('<' + v.id + '>') || (v+'');
	    });
	    result.addError({
	      name: 'type',
	      argument: list,
	      message: "is not of a type(s) " + list,
	    });
	  }
	  return result;
	};

	function testSchema(instance, options, ctx, callback, schema){
	  var res = this.validateSchema(instance, schema, options, ctx);
	  if (! res.valid && callback instanceof Function) {
	    callback(res);
	  }
	  return res.valid;
	}

	/**
	 * Validates whether the instance matches some of the given schemas
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {ValidatorResult|null}
	 */
	validators.anyOf = function validateAnyOf (instance, schema, options, ctx) {
	  // Ignore undefined instances
	  if (instance === undefined) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var inner = new ValidatorResult(instance, schema, options, ctx);
	  if (!Array.isArray(schema.anyOf)){
	    throw new SchemaError("anyOf must be an array");
	  }
	  if (!schema.anyOf.some(
	    testSchema.bind(
	      this, instance, options, ctx, function(res){inner.importErrors(res);}
	      ))) {
	    var list = schema.anyOf.map(function (v, i) {
	      return (v.id && ('<' + v.id + '>')) || (v.title && JSON.stringify(v.title)) || (v['$ref'] && ('<' + v['$ref'] + '>')) || '[subschema '+i+']';
	    });
	    if (options.nestedErrors) {
	      result.importErrors(inner);
	    }
	    result.addError({
	      name: 'anyOf',
	      argument: list,
	      message: "is not any of " + list.join(','),
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance matches every given schema
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null}
	 */
	validators.allOf = function validateAllOf (instance, schema, options, ctx) {
	  // Ignore undefined instances
	  if (instance === undefined) {
	    return null;
	  }
	  if (!Array.isArray(schema.allOf)){
	    throw new SchemaError("allOf must be an array");
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var self = this;
	  schema.allOf.forEach(function(v, i){
	    var valid = self.validateSchema(instance, v, options, ctx);
	    if(!valid.valid){
	      var msg = (v.id && ('<' + v.id + '>')) || (v.title && JSON.stringify(v.title)) || (v['$ref'] && ('<' + v['$ref'] + '>')) || '[subschema '+i+']';
	      result.addError({
	        name: 'allOf',
	        argument: { id: msg, length: valid.errors.length, valid: valid },
	        message: 'does not match allOf schema ' + msg + ' with ' + valid.errors.length + ' error[s]:',
	      });
	      result.importErrors(valid);
	    }
	  });
	  return result;
	};

	/**
	 * Validates whether the instance matches exactly one of the given schemas
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null}
	 */
	validators.oneOf = function validateOneOf (instance, schema, options, ctx) {
	  // Ignore undefined instances
	  if (instance === undefined) {
	    return null;
	  }
	  if (!Array.isArray(schema.oneOf)){
	    throw new SchemaError("oneOf must be an array");
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var inner = new ValidatorResult(instance, schema, options, ctx);
	  var count = schema.oneOf.filter(
	    testSchema.bind(
	      this, instance, options, ctx, function(res) {inner.importErrors(res);}
	      ) ).length;
	  var list = schema.oneOf.map(function (v, i) {
	    return (v.id && ('<' + v.id + '>')) || (v.title && JSON.stringify(v.title)) || (v['$ref'] && ('<' + v['$ref'] + '>')) || '[subschema '+i+']';
	  });
	  if (count!==1) {
	    if (options.nestedErrors) {
	      result.importErrors(inner);
	    }
	    result.addError({
	      name: 'oneOf',
	      argument: list,
	      message: "is not exactly one from " + list.join(','),
	    });
	  }
	  return result;
	};

	/**
	 * Validates properties
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null|ValidatorResult}
	 */
	validators.properties = function validateProperties (instance, schema, options, ctx) {
	  if(instance === undefined || !(instance instanceof Object)) return;
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var properties = schema.properties || {};
	  for (var property in properties) {
	    var prop = (instance || undefined) && instance[property];
	    var res = this.validateSchema(prop, properties[property], options, ctx.makeChild(properties[property], property));
	    if(res.instance !== result.instance[property]) result.instance[property] = res.instance;
	    result.importErrors(res);
	  }
	  return result;
	};

	/**
	 * Test a specific property within in instance against the additionalProperties schema attribute
	 * This ignores properties with definitions in the properties schema attribute, but no other attributes.
	 * If too many more types of property-existance tests pop up they may need their own class of tests (like `type` has)
	 * @private
	 * @return {boolean}
	 */
	function testAdditionalProperty (instance, schema, options, ctx, property, result) {
	  if (schema.properties && schema.properties[property] !== undefined) {
	    return;
	  }
	  if (schema.additionalProperties === false) {
	    result.addError({
	      name: 'additionalProperties',
	      argument: property,
	      message: "additionalProperty " + JSON.stringify(property) + " exists in instance when not allowed",
	    });
	  } else {
	    var additionalProperties = schema.additionalProperties || {};
	    var res = this.validateSchema(instance[property], additionalProperties, options, ctx.makeChild(additionalProperties, property));
	    if(res.instance !== result.instance[property]) result.instance[property] = res.instance;
	    result.importErrors(res);
	  }
	}

	/**
	 * Validates patternProperties
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null|ValidatorResult}
	 */
	validators.patternProperties = function validatePatternProperties (instance, schema, options, ctx) {
	  if(instance === undefined) return;
	  if(!this.types.object(instance)) return;
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var patternProperties = schema.patternProperties || {};

	  for (var property in instance) {
	    var test = true;
	    for (var pattern in patternProperties) {
	      var expr = new RegExp(pattern);
	      if (!expr.test(property)) {
	        continue;
	      }
	      test = false;
	      var res = this.validateSchema(instance[property], patternProperties[pattern], options, ctx.makeChild(patternProperties[pattern], property));
	      if(res.instance !== result.instance[property]) result.instance[property] = res.instance;
	      result.importErrors(res);
	    }
	    if (test) {
	      testAdditionalProperty.call(this, instance, schema, options, ctx, property, result);
	    }
	  }

	  return result;
	};

	/**
	 * Validates additionalProperties
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null|ValidatorResult}
	 */
	validators.additionalProperties = function validateAdditionalProperties (instance, schema, options, ctx) {
	  if(instance === undefined) return;
	  if(!this.types.object(instance)) return;
	  // if patternProperties is defined then we'll test when that one is called instead
	  if (schema.patternProperties) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  for (var property in instance) {
	    testAdditionalProperty.call(this, instance, schema, options, ctx, property, result);
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is at least of a certain length, when the instance value is a string.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.minProperties = function validateMinProperties (instance, schema, options, ctx) {
	  if (!instance || typeof instance !== 'object') {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var keys = Object.keys(instance);
	  if (!(keys.length >= schema.minProperties)) {
	    result.addError({
	      name: 'minProperties',
	      argument: schema.minProperties,
	      message: "does not meet minimum property length of " + schema.minProperties,
	    })
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is at most of a certain length, when the instance value is a string.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.maxProperties = function validateMaxProperties (instance, schema, options, ctx) {
	  if (!instance || typeof instance !== 'object') {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var keys = Object.keys(instance);
	  if (!(keys.length <= schema.maxProperties)) {
	    result.addError({
	      name: 'maxProperties',
	      argument: schema.maxProperties,
	      message: "does not meet maximum property length of " + schema.maxProperties,
	    });
	  }
	  return result;
	};

	/**
	 * Validates items when instance is an array
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null|ValidatorResult}
	 */
	validators.items = function validateItems (instance, schema, options, ctx) {
	  if (!Array.isArray(instance)) {
	    return null;
	  }
	  var self = this;
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (instance === undefined || !schema.items) {
	    return result;
	  }
	  instance.every(function (value, i) {
	    var items = Array.isArray(schema.items) ? (schema.items[i] || schema.additionalItems) : schema.items;
	    if (items === undefined) {
	      return true;
	    }
	    if (items === false) {
	      result.addError({
	        name: 'items',
	        message: "additionalItems not permitted",
	      });
	      return false;
	    }
	    var res = self.validateSchema(value, items, options, ctx.makeChild(items, i));
	    if(res.instance !== result.instance[i]) result.instance[i] = res.instance;
	    result.importErrors(res);
	    return true;
	  });
	  return result;
	};

	/**
	 * Validates minimum and exclusiveMinimum when the type of the instance value is a number.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.minimum = function validateMinimum (instance, schema, options, ctx) {
	  if (typeof instance !== 'number') {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var valid = true;
	  if (schema.exclusiveMinimum && schema.exclusiveMinimum === true) {
	    valid = instance > schema.minimum;
	  } else {
	    valid = instance >= schema.minimum;
	  }
	  if (!valid) {
	    result.addError({
	      name: 'minimum',
	      argument: schema.minimum,
	      message: "must have a minimum value of " + schema.minimum,
	    });
	  }
	  return result;
	};

	/**
	 * Validates maximum and exclusiveMaximum when the type of the instance value is a number.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.maximum = function validateMaximum (instance, schema, options, ctx) {
	  if (typeof instance !== 'number') {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var valid;
	  if (schema.exclusiveMaximum && schema.exclusiveMaximum === true) {
	    valid = instance < schema.maximum;
	  } else {
	    valid = instance <= schema.maximum;
	  }
	  if (!valid) {
	    result.addError({
	      name: 'maximum',
	      argument: schema.maximum,
	      message: "must have a maximum value of " + schema.maximum,
	    });
	  }
	  return result;
	};

	/**
	 * Validates divisibleBy when the type of the instance value is a number.
	 * Of course, this is susceptible to floating point error since it compares the floating points
	 * and not the JSON byte sequences to arbitrary precision.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.divisibleBy = function validateDivisibleBy (instance, schema, options, ctx) {
	  if (typeof instance !== 'number') {
	    return null;
	  }

	  if (schema.divisibleBy == 0) {
	    throw new SchemaError("divisibleBy cannot be zero");
	  }

	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (instance / schema.divisibleBy % 1) {
	    result.addError({
	      name: 'divisibleBy',
	      argument: schema.divisibleBy,
	      message: "is not divisible by (multiple of) " + JSON.stringify(schema.divisibleBy),
	    });
	  }
	  return result;
	};

	/**
	 * Validates divisibleBy when the type of the instance value is a number.
	 * Of course, this is susceptible to floating point error since it compares the floating points
	 * and not the JSON byte sequences to arbitrary precision.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.multipleOf = function validateMultipleOf (instance, schema, options, ctx) {
	  if (typeof instance !== 'number') {
	    return null;
	  }

	  if (schema.multipleOf == 0) {
	    throw new SchemaError("multipleOf cannot be zero");
	  }

	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (instance / schema.multipleOf % 1) {
	    result.addError({
	      name: 'multipleOf',
	      argument:  schema.multipleOf,
	      message: "is not a multiple of (divisible by) " + JSON.stringify(schema.multipleOf),
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is present.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.required = function validateRequired (instance, schema, options, ctx) {
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (instance === undefined && schema.required === true) {
	    result.addError({
	      name: 'required',
	      message: "is required"
	    });
	  } else if (instance && typeof instance==='object' && Array.isArray(schema.required)) {
	    schema.required.forEach(function(n){
	      if(instance[n]===undefined){
	        result.addError({
	          name: 'required',
	          argument: n,
	          message: "requires property " + JSON.stringify(n),
	        });
	      }
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value matches the regular expression, when the instance value is a string.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.pattern = function validatePattern (instance, schema, options, ctx) {
	  if (typeof instance !== 'string') {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!instance.match(schema.pattern)) {
	    result.addError({
	      name: 'pattern',
	      argument: schema.pattern,
	      message: "does not match pattern " + JSON.stringify(schema.pattern),
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is of a certain defined format or a custom
	 * format.
	 * The following formats are supported for string types:
	 *   - date-time
	 *   - date
	 *   - time
	 *   - ip-address
	 *   - ipv6
	 *   - uri
	 *   - color
	 *   - host-name
	 *   - alpha
	 *   - alpha-numeric
	 *   - utc-millisec
	 * @param instance
	 * @param schema
	 * @param [options]
	 * @param [ctx]
	 * @return {String|null}
	 */
	validators.format = function validateFormat (instance, schema, options, ctx) {
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!result.disableFormat && !helpers.isFormat(instance, schema.format, this)) {
	    result.addError({
	      name: 'format',
	      argument: schema.format,
	      message: "does not conform to the " + JSON.stringify(schema.format) + " format",
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is at least of a certain length, when the instance value is a string.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.minLength = function validateMinLength (instance, schema, options, ctx) {
	  if (!(typeof instance === 'string')) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!(instance.length >= schema.minLength)) {
	    result.addError({
	      name: 'minLength',
	      argument: schema.minLength,
	      message: "does not meet minimum length of " + schema.minLength,
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is at most of a certain length, when the instance value is a string.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.maxLength = function validateMaxLength (instance, schema, options, ctx) {
	  if (!(typeof instance === 'string')) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!(instance.length <= schema.maxLength)) {
	    result.addError({
	      name: 'maxLength',
	      argument: schema.maxLength,
	      message: "does not meet maximum length of " + schema.maxLength,
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether instance contains at least a minimum number of items, when the instance is an Array.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.minItems = function validateMinItems (instance, schema, options, ctx) {
	  if (!Array.isArray(instance)) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!(instance.length >= schema.minItems)) {
	    result.addError({
	      name: 'minItems',
	      argument: schema.minItems,
	      message: "does not meet minimum length of " + schema.minItems,
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether instance contains no more than a maximum number of items, when the instance is an Array.
	 * @param instance
	 * @param schema
	 * @return {String|null}
	 */
	validators.maxItems = function validateMaxItems (instance, schema, options, ctx) {
	  if (!Array.isArray(instance)) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!(instance.length <= schema.maxItems)) {
	    result.addError({
	      name: 'maxItems',
	      argument: schema.maxItems,
	      message: "does not meet maximum length of " + schema.maxItems,
	    });
	  }
	  return result;
	};

	/**
	 * Validates that every item in an instance array is unique, when instance is an array
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {String|null|ValidatorResult}
	 */
	validators.uniqueItems = function validateUniqueItems (instance, schema, options, ctx) {
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!Array.isArray(instance)) {
	    return result;
	  }
	  function testArrays (v, i, a) {
	    for (var j = i + 1; j < a.length; j++) if (helpers.deepCompareStrict(v, a[j])) {
	      return false;
	    }
	    return true;
	  }
	  if (!instance.every(testArrays)) {
	    result.addError({
	      name: 'uniqueItems',
	      message: "contains duplicate item",
	    });
	  }
	  return result;
	};

	/**
	 * Deep compares arrays for duplicates
	 * @param v
	 * @param i
	 * @param a
	 * @private
	 * @return {boolean}
	 */
	function testArrays (v, i, a) {
	  var j, len = a.length;
	  for (j = i + 1, len; j < len; j++) {
	    if (helpers.deepCompareStrict(v, a[j])) {
	      return false;
	    }
	  }
	  return true;
	}

	/**
	 * Validates whether there are no duplicates, when the instance is an Array.
	 * @param instance
	 * @return {String|null}
	 */
	validators.uniqueItems = function validateUniqueItems (instance, schema, options, ctx) {
	  if (!Array.isArray(instance)) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!instance.every(testArrays)) {
	    result.addError({
	      name: 'uniqueItems',
	      message: "contains duplicate item",
	    });
	  }
	  return result;
	};

	/**
	 * Validate for the presence of dependency properties, if the instance is an object.
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {null|ValidatorResult}
	 */
	validators.dependencies = function validateDependencies (instance, schema, options, ctx) {
	  if (!instance || typeof instance != 'object') {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  for (var property in schema.dependencies) {
	    if (instance[property] === undefined) {
	      continue;
	    }
	    var dep = schema.dependencies[property];
	    var childContext = ctx.makeChild(dep, property);
	    if (typeof dep == 'string') {
	      dep = [dep];
	    }
	    if (Array.isArray(dep)) {
	      dep.forEach(function (prop) {
	        if (instance[prop] === undefined) {
	          result.addError({
	            // FIXME there's two different "dependencies" errors here with slightly different outputs
	            // Can we make these the same? Or should we create different error types?
	            name: 'dependencies',
	            argument: childContext.propertyPath,
	            message: "property " + prop + " not found, required by " + childContext.propertyPath,
	          });
	        }
	      });
	    } else {
	      var res = this.validateSchema(instance, dep, options, childContext);
	      if(result.instance !== res.instance) result.instance = res.instance;
	      if (res && res.errors.length) {
	        result.addError({
	          name: 'dependencies',
	          argument: childContext.propertyPath,
	          message: "does not meet dependency required by " + childContext.propertyPath,
	        });
	        result.importErrors(res);
	      }
	    }
	  }
	  return result;
	};

	/**
	 * Validates whether the instance value is one of the enumerated values.
	 *
	 * @param instance
	 * @param schema
	 * @return {ValidatorResult|null}
	 */
	validators['enum'] = function validateEnum (instance, schema, options, ctx) {
	  if (!Array.isArray(schema['enum'])) {
	    throw new SchemaError("enum expects an array", schema);
	  }
	  if (instance === undefined) {
	    return null;
	  }
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  if (!schema['enum'].some(helpers.deepCompareStrict.bind(null, instance))) {
	    result.addError({
	      name: 'enum',
	      argument: schema['enum'],
	      message: "is not one of enum values: " + schema['enum'].join(','),
	    });
	  }
	  return result;
	};

	/**
	 * Validates whether the instance if of a prohibited type.
	 * @param instance
	 * @param schema
	 * @param options
	 * @param ctx
	 * @return {null|ValidatorResult}
	 */
	validators.not = validators.disallow = function validateNot (instance, schema, options, ctx) {
	  var self = this;
	  if(instance===undefined) return null;
	  var result = new ValidatorResult(instance, schema, options, ctx);
	  var notTypes = schema.not || schema.disallow;
	  if(!notTypes) return null;
	  if(!Array.isArray(notTypes)) notTypes=[notTypes];
	  notTypes.forEach(function (type) {
	    if (self.testType(instance, schema, options, ctx, type)) {
	      var schemaId = type && type.id && ('<' + type.id + '>') || type;
	      result.addError({
	        name: 'not',
	        argument: schemaId,
	        message: "is of prohibited type " + schemaId,
	      });
	    }
	  });
	  return result;
	};

	module.exports = attribute;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var uri = __webpack_require__(19);

	var ValidationError = exports.ValidationError = function ValidationError (message, instance, schema, propertyPath, name, argument) {
	  if (propertyPath) {
	    this.property = propertyPath;
	  }
	  if (message) {
	    this.message = message;
	  }
	  if (schema) {
	    if (schema.id) {
	      this.schema = schema.id;
	    } else {
	      this.schema = schema;
	    }
	  }
	  if (instance) {
	    this.instance = instance;
	  }
	  this.name = name;
	  this.argument = argument;
	  this.stack = this.toString();
	};

	ValidationError.prototype.toString = function toString() {
	  return this.property + ' ' + this.message;
	};

	var ValidatorResult = exports.ValidatorResult = function ValidatorResult(instance, schema, options, ctx) {
	  this.instance = instance;
	  this.schema = schema;
	  this.propertyPath = ctx.propertyPath;
	  this.errors = [];
	  this.throwError = options && options.throwError;
	  this.disableFormat = options && options.disableFormat === true;
	};

	ValidatorResult.prototype.addError = function addError(detail) {
	  var err;
	  if (typeof detail == 'string') {
	    err = new ValidationError(detail, this.instance, this.schema, this.propertyPath);
	  } else {
	    if (!detail) throw new Error('Missing error detail');
	    if (!detail.message) throw new Error('Missing error message');
	    if (!detail.name) throw new Error('Missing validator type');
	    err = new ValidationError(detail.message, this.instance, this.schema, this.propertyPath, detail.name, detail.argument);
	  }

	  if (this.throwError) {
	    throw err;
	  }
	  this.errors.push(err);
	  return err;
	};

	ValidatorResult.prototype.importErrors = function importErrors(res) {
	  if (typeof res == 'string' || (res && res.validatorType)) {
	    this.addError(res);
	  } else if (res && res.errors) {
	    Array.prototype.push.apply(this.errors, res.errors);
	  }
	};

	function stringizer (v,i){
	  return i+': '+v.toString()+'\n';
	}
	ValidatorResult.prototype.toString = function toString(res) {
	  return this.errors.map(stringizer).join('');
	};

	Object.defineProperty(ValidatorResult.prototype, "valid", { get: function() {
	  return !this.errors.length;
	} });

	/**
	 * Describes a problem with a Schema which prevents validation of an instance
	 * @name SchemaError
	 * @constructor
	 */
	var SchemaError = exports.SchemaError = function SchemaError (msg, schema) {
	  this.message = msg;
	  this.schema = schema;
	  Error.call(this, msg);
	  Error.captureStackTrace(this, SchemaError);
	};
	SchemaError.prototype = Object.create(Error.prototype,
	  { constructor: {value: SchemaError, enumerable: false}
	  , name: {value: 'SchemaError', enumerable: false}
	  });

	var SchemaContext = exports.SchemaContext = function SchemaContext (schema, options, propertyPath, base, schemas) {
	  this.schema = schema;
	  this.options = options;
	  this.propertyPath = propertyPath;
	  this.base = base;
	  this.schemas = schemas;
	};

	SchemaContext.prototype.resolve = function resolve (target) {
	  return uri.resolve(this.base, target);
	};

	SchemaContext.prototype.makeChild = function makeChild(schema, propertyName){
	  var propertyPath = (propertyName===undefined) ? this.propertyPath : this.propertyPath+makeSuffix(propertyName);
	  var base = uri.resolve(this.base, schema.id||'');
	  var ctx = new SchemaContext(schema, this.options, propertyPath, base, Object.create(this.schemas));
	  if(schema.id && !ctx.schemas[base]){
	    ctx.schemas[base] = schema;
	  }
	  return ctx;
	}

	var FORMAT_REGEXPS = exports.FORMAT_REGEXPS = {
	  'date-time': /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])[tT ](2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])(\.\d+)?([zZ]|[+-]([0-5][0-9]):(60|[0-5][0-9]))$/,
	  'date': /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])$/,
	  'time': /^(2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])$/,

	  'email': /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/,
	  'ip-address': /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
	  'ipv6': /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
	  'uri': /^[a-zA-Z][a-zA-Z0-9+-.]*:[^\s]*$/,

	  'color': /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/,

	  // hostname regex from: http://stackoverflow.com/a/1420225/5628
	  'hostname': /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,
	  'host-name': /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,

	  'alpha': /^[a-zA-Z]+$/,
	  'alphanumeric': /^[a-zA-Z0-9]+$/,
	  'utc-millisec': function (input) {
	    return (typeof input === 'string') && parseFloat(input) === parseInt(input, 10) && !isNaN(input);
	  },
	  'regex': function (input) {
	    var result = true;
	    try {
	      new RegExp(input);
	    } catch (e) {
	      result = false;
	    }
	    return result;
	  },
	  'style': /\s*(.+?):\s*([^;]+);?/g,
	  'phone': /^\+(?:[0-9] ?){6,14}[0-9]$/
	};

	FORMAT_REGEXPS.regexp = FORMAT_REGEXPS.regex;
	FORMAT_REGEXPS.pattern = FORMAT_REGEXPS.regex;
	FORMAT_REGEXPS.ipv4 = FORMAT_REGEXPS['ip-address'];

	exports.isFormat = function isFormat (input, format, validator) {
	  if (typeof input === 'string' && FORMAT_REGEXPS[format] !== undefined) {
	    if (FORMAT_REGEXPS[format] instanceof RegExp) {
	      return FORMAT_REGEXPS[format].test(input);
	    }
	    if (typeof FORMAT_REGEXPS[format] === 'function') {
	      return FORMAT_REGEXPS[format](input);
	    }
	  } else if (validator && validator.customFormats &&
	      typeof validator.customFormats[format] === 'function') {
	    return validator.customFormats[format](input);
	  }
	  return true;
	};

	var makeSuffix = exports.makeSuffix = function makeSuffix (key) {
	  key = key.toString();
	  // This function could be capable of outputting valid a ECMAScript string, but the
	  // resulting code for testing which form to use would be tens of thousands of characters long
	  // That means this will use the name form for some illegal forms
	  if (!key.match(/[.\s\[\]]/) && !key.match(/^[\d]/)) {
	    return '.' + key;
	  }
	  if (key.match(/^\d+$/)) {
	    return '[' + key + ']';
	  }
	  return '[' + JSON.stringify(key) + ']';
	};

	exports.deepCompareStrict = function deepCompareStrict (a, b) {
	  if (typeof a !== typeof b) {
	    return false;
	  }
	  if (a instanceof Array) {
	    if (!(b instanceof Array)) {
	      return false;
	    }
	    if (a.length !== b.length) {
	      return false;
	    }
	    return a.every(function (v, i) {
	      return deepCompareStrict(a[i], b[i]);
	    });
	  }
	  if (typeof a === 'object') {
	    if (!a || !b) {
	      return a === b;
	    }
	    var aKeys = Object.keys(a);
	    var bKeys = Object.keys(b);
	    if (aKeys.length !== bKeys.length) {
	      return false;
	    }
	    return aKeys.every(function (v) {
	      return deepCompareStrict(a[v], b[v]);
	    });
	  }
	  return a === b;
	};

	function deepMerger (target, dst, e, i) {
	  if (typeof e === 'object') {
	    dst[i] = deepMerge(target[i], e)
	  } else {
	    if (target.indexOf(e) === -1) {
	      dst.push(e)
	    }
	  }
	}

	function copyist (src, dst, key) {
	  dst[key] = src[key];
	}

	function copyistWithDeepMerge (target, src, dst, key) {
	  if (typeof src[key] !== 'object' || !src[key]) {
	    dst[key] = src[key];
	  }
	  else {
	    if (!target[key]) {
	      dst[key] = src[key];
	    } else {
	      dst[key] = deepMerge(target[key], src[key])
	    }
	  }
	}

	function deepMerge (target, src) {
	  var array = Array.isArray(src);
	  var dst = array && [] || {};

	  if (array) {
	    target = target || [];
	    dst = dst.concat(target);
	    src.forEach(deepMerger.bind(null, target, dst));
	  } else {
	    if (target && typeof target === 'object') {
	      Object.keys(target).forEach(copyist.bind(null, target, dst));
	    }
	    Object.keys(src).forEach(copyistWithDeepMerge.bind(null, target, src, dst));
	  }

	  return dst;
	};

	module.exports.deepMerge = deepMerge;

	/**
	 * Validates instance against the provided schema
	 * Implements URI+JSON Pointer encoding, e.g. "%7e"="~0"=>"~", "~1"="%2f"=>"/"
	 * @param o
	 * @param s The path to walk o along
	 * @return any
	 */
	exports.objectGetPath = function objectGetPath(o, s) {
	  var parts = s.split('/').slice(1);
	  var k;
	  while (typeof (k=parts.shift()) == 'string') {
	    var n = decodeURIComponent(k.replace(/~0/,'~').replace(/~1/g,'/'));
	    if (!(n in o)) return;
	    o = o[n];
	  }
	  return o;
	};

	function pathEncoder (v) {
	  return '/'+encodeURIComponent(v).replace(/~/g,'%7E');
	}
	/**
	 * Accept an Array of property names and return a JSON Pointer URI fragment
	 * @param Array a
	 * @return {String}
	 */
	exports.encodePath = function encodePointer(a){
		// ~ must be encoded explicitly because hacks
		// the slash is encoded by encodeURIComponent
		return a.map(pathEncoder).join('');
	};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.

	transformPathToArray = transformPathToArray;var _get = __webpack_require__(29);var _get2 = _interopRequireDefault(_get);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function transformPathToArray(property, jsSpec) {
	  if (property.slice(0, 9) === "instance.") {
	    var str = property.slice(9);
	  } else {// eslint-disable-next-line no-redeclare
	    var str = property;
	  }

	  var pathArr = [];

	  str.
	  split(".").
	  map(function (item) {
	    // "key[0]" becomes ["key", "0"]
	    if (item.includes("[")) {
	      var index = parseInt(item.match(/\[(.*)\]/)[1]);
	      var keyName = item.slice(0, item.indexOf("["));
	      return [keyName, index.toString()];
	    } else {
	      return item;
	    }
	  }).
	  reduce(function (a, b) {
	    // flatten!
	    return a.concat(b);
	  }, []).
	  concat([""]) // add an empty item into the array, so we don't get stuck with something in our buffer below
	  .reduce(function (buffer, curr) {
	    var obj = pathArr.length ? (0, _get2.default)(jsSpec, pathArr) : jsSpec;

	    if ((0, _get2.default)(obj, makeAccessArray(buffer, curr))) {
	      if (buffer.length) {
	        pathArr.push(buffer);
	      }
	      if (curr.length) {
	        pathArr.push(curr);
	      }
	      return "";
	    } else {
	      // attach key to buffer
	      return "" + buffer + (buffer.length ? "." : "") + curr;
	    }
	  }, "");

	  if (typeof (0, _get2.default)(jsSpec, pathArr) !== "undefined") {
	    return pathArr;
	  } else {
	    // if our path is not correct (there is no value at the path),
	    // return null
	    return null;
	  }
	}

	function makeAccessArray(buffer, curr) {
	  var arr = [];

	  if (buffer.length) {
	    arr.push(buffer);
	  }

	  if (curr.length) {
	    arr.push(curr);
	  }

	  return arr;
	}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(30);

	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is returned in its place.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : baseGet(object, path);
	  return result === undefined ? defaultValue : result;
	}

	module.exports = get;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var castPath = __webpack_require__(31),
	    toKey = __webpack_require__(72);

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = castPath(path, object);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	module.exports = baseGet;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(14),
	    isKey = __webpack_require__(32),
	    stringToPath = __webpack_require__(34),
	    toString = __webpack_require__(69);

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value, object) {
	  if (isArray(value)) {
	    return value;
	  }
	  return isKey(value, object) ? [value] : stringToPath(toString(value));
	}

	module.exports = castPath;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(14),
	    isSymbol = __webpack_require__(33);

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (isArray(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}

	module.exports = isKey;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(10),
	    isObjectLike = __webpack_require__(13);

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && baseGetTag(value) == symbolTag);
	}

	module.exports = isSymbol;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	var memoizeCapped = __webpack_require__(35);

	/** Used to match property names within property paths. */
	var reLeadingDot = /^\./,
	    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = memoizeCapped(function(string) {
	  var result = [];
	  if (reLeadingDot.test(string)) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	module.exports = stringToPath;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	var memoize = __webpack_require__(36);

	/** Used as the maximum memoize cache size. */
	var MAX_MEMOIZE_SIZE = 500;

	/**
	 * A specialized version of `_.memoize` which clears the memoized function's
	 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
	 *
	 * @private
	 * @param {Function} func The function to have its output memoized.
	 * @returns {Function} Returns the new memoized function.
	 */
	function memoizeCapped(func) {
	  var result = memoize(func, function(key) {
	    if (cache.size === MAX_MEMOIZE_SIZE) {
	      cache.clear();
	    }
	    return key;
	  });

	  var cache = result.cache;
	  return result;
	}

	module.exports = memoizeCapped;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(37);

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoized function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize(func, resolver) {
	  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;

	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result) || cache;
	    return result;
	  };
	  memoized.cache = new (memoize.Cache || MapCache);
	  return memoized;
	}

	// Expose `MapCache`.
	memoize.Cache = MapCache;

	module.exports = memoize;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	var mapCacheClear = __webpack_require__(38),
	    mapCacheDelete = __webpack_require__(63),
	    mapCacheGet = __webpack_require__(66),
	    mapCacheHas = __webpack_require__(67),
	    mapCacheSet = __webpack_require__(68);

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;

	module.exports = MapCache;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	var Hash = __webpack_require__(39),
	    ListCache = __webpack_require__(54),
	    Map = __webpack_require__(62);

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}

	module.exports = mapCacheClear;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	var hashClear = __webpack_require__(40),
	    hashDelete = __webpack_require__(50),
	    hashGet = __webpack_require__(51),
	    hashHas = __webpack_require__(52),
	    hashSet = __webpack_require__(53);

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;

	module.exports = Hash;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(41);

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	  this.size = 0;
	}

	module.exports = hashClear;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(42);

	/* Built-in method references that are verified to be native. */
	var nativeCreate = getNative(Object, 'create');

	module.exports = nativeCreate;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsNative = __webpack_require__(43),
	    getValue = __webpack_require__(49);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}

	module.exports = getNative;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(44),
	    isMasked = __webpack_require__(46),
	    isObject = __webpack_require__(45),
	    toSource = __webpack_require__(48);

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	module.exports = baseIsNative;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(10),
	    isObject = __webpack_require__(45);

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	module.exports = isFunction;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	var coreJsData = __webpack_require__(47);

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	module.exports = isMasked;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	var root = __webpack_require__(6);

	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];

	module.exports = coreJsData;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

	/** Used for built-in method references. */
	var funcProto = Function.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	module.exports = toSource;


/***/ }),
/* 49 */
/***/ (function(module, exports) {

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	module.exports = getValue;


/***/ }),
/* 50 */
/***/ (function(module, exports) {

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}

	module.exports = hashDelete;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(41);

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}

	module.exports = hashGet;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(41);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
	}

	module.exports = hashHas;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(41);

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}

	module.exports = hashSet;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	var listCacheClear = __webpack_require__(55),
	    listCacheDelete = __webpack_require__(56),
	    listCacheGet = __webpack_require__(59),
	    listCacheHas = __webpack_require__(60),
	    listCacheSet = __webpack_require__(61);

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;

	module.exports = ListCache;


/***/ }),
/* 55 */
/***/ (function(module, exports) {

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	  this.size = 0;
	}

	module.exports = listCacheClear;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(57);

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}

	module.exports = listCacheDelete;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(58);

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	module.exports = assocIndexOf;


/***/ }),
/* 58 */
/***/ (function(module, exports) {

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	module.exports = eq;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(57);

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	module.exports = listCacheGet;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(57);

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}

	module.exports = listCacheHas;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(57);

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	module.exports = listCacheSet;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(42),
	    root = __webpack_require__(6);

	/* Built-in method references that are verified to be native. */
	var Map = getNative(root, 'Map');

	module.exports = Map;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(64);

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  var result = getMapData(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}

	module.exports = mapCacheDelete;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	var isKeyable = __webpack_require__(65);

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	module.exports = getMapData;


/***/ }),
/* 65 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	module.exports = isKeyable;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(64);

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}

	module.exports = mapCacheGet;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(64);

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}

	module.exports = mapCacheHas;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(64);

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  var data = getMapData(this, key),
	      size = data.size;

	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}

	module.exports = mapCacheSet;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(70);

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}

	module.exports = toString;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(5),
	    arrayMap = __webpack_require__(71),
	    isArray = __webpack_require__(14),
	    isSymbol = __webpack_require__(33);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isArray(value)) {
	    // Recursively convert values (susceptible to call stack limits).
	    return arrayMap(value, baseToString) + '';
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	module.exports = baseToString;


/***/ }),
/* 71 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	module.exports = arrayMap;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	var isSymbol = __webpack_require__(33);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (typeof value == 'string' || isSymbol(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	module.exports = toKey;


/***/ }),
/* 73 */
/***/ (function(module, exports) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = {
	    "id": "http://json-schema.org/draft-04/schema#",
	    "$schema": "http://json-schema.org/draft-04/schema#",
	    "description": "Core schema meta-schema",
	    "definitions": {
	        "schemaArray": {
	            "type": "array",
	            "minItems": 1,
	            "items": { "$ref": "#" } },

	        "positiveInteger": {
	            "type": "integer",
	            "minimum": 0 },

	        "positiveIntegerDefault0": {
	            "allOf": [{ "$ref": "#/definitions/positiveInteger" }, { "default": 0 }] },

	        "simpleTypes": {
	            "enum": ["array", "boolean", "integer", "null", "number", "object", "string"] },

	        "stringArray": {
	            "type": "array",
	            "items": { "type": "string" },
	            "minItems": 1,
	            "uniqueItems": true } },


	    "type": "object",
	    "properties": {
	        "id": {
	            "type": "string",
	            "format": "uri" },

	        "$schema": {
	            "type": "string",
	            "format": "uri" },

	        "title": {
	            "type": "string" },

	        "description": {
	            "type": "string" },

	        "default": {},
	        "multipleOf": {
	            "type": "number",
	            "minimum": 0,
	            "exclusiveMinimum": true },

	        "maximum": {
	            "type": "number" },

	        "exclusiveMaximum": {
	            "type": "boolean",
	            "default": false },

	        "minimum": {
	            "type": "number" },

	        "exclusiveMinimum": {
	            "type": "boolean",
	            "default": false },

	        "maxLength": { "$ref": "#/definitions/positiveInteger" },
	        "minLength": { "$ref": "#/definitions/positiveIntegerDefault0" },
	        "pattern": {
	            "type": "string",
	            "format": "regex" },

	        "additionalItems": {
	            "anyOf": [
	            { "type": "boolean" },
	            { "$ref": "#" }],

	            "default": {} },

	        "items": {
	            "anyOf": [
	            { "$ref": "#" },
	            { "$ref": "#/definitions/schemaArray" }],

	            "default": {} },

	        "maxItems": { "$ref": "#/definitions/positiveInteger" },
	        "minItems": { "$ref": "#/definitions/positiveIntegerDefault0" },
	        "uniqueItems": {
	            "type": "boolean",
	            "default": false },

	        "maxProperties": { "$ref": "#/definitions/positiveInteger" },
	        "minProperties": { "$ref": "#/definitions/positiveIntegerDefault0" },
	        "required": { "$ref": "#/definitions/stringArray" },
	        "additionalProperties": {
	            "anyOf": [
	            { "type": "boolean" },
	            { "$ref": "#" }],

	            "default": {} },

	        "definitions": {
	            "type": "object",
	            "additionalProperties": { "$ref": "#" },
	            "default": {} },

	        "properties": {
	            "type": "object",
	            "additionalProperties": { "$ref": "#" },
	            "default": {} },

	        "patternProperties": {
	            "type": "object",
	            "additionalProperties": { "$ref": "#" },
	            "default": {} },

	        "dependencies": {
	            "type": "object",
	            "additionalProperties": {
	                "anyOf": [
	                { "$ref": "#" },
	                { "$ref": "#/definitions/stringArray" }] } },



	        "enum": {
	            "type": "array",
	            "minItems": 1,
	            "uniqueItems": true },

	        "type": {
	            "anyOf": [
	            { "$ref": "#/definitions/simpleTypes" },
	            {
	                "type": "array",
	                "items": { "$ref": "#/definitions/simpleTypes" },
	                "minItems": 1,
	                "uniqueItems": true }] },



	        "allOf": { "$ref": "#/definitions/schemaArray" },
	        "anyOf": { "$ref": "#/definitions/schemaArray" },
	        "oneOf": { "$ref": "#/definitions/schemaArray" },
	        "not": { "$ref": "#" } },

	    "dependencies": {
	        "exclusiveMaximum": ["maximum"],
	        "exclusiveMinimum": ["minimum"] },

	    "default": {} };

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.getLineNumberForPathAsync = exports.positionRangeForPathAsync = exports.pathForPositionAsync = undefined;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};exports.









	getLineNumberForPath = getLineNumberForPath;exports.












































































	positionRangeForPath = positionRangeForPath;exports.







































































	pathForPosition = pathForPosition;var _yamlJs = __webpack_require__(75);var _yamlJs2 = _interopRequireDefault(_yamlJs);var _isArray = __webpack_require__(14);var _isArray2 = _interopRequireDefault(_isArray);var _find = __webpack_require__(102);var _find2 = _interopRequireDefault(_find);var _memoize = __webpack_require__(36);var _memoize2 = _interopRequireDefault(_memoize);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var cachedCompose = (0, _memoize2.default)(_yamlJs2.default.compose); // TODO: build a custom cache based on content
	var MAP_TAG = "tag:yaml.org,2002:map";var SEQ_TAG = "tag:yaml.org,2002:seq";function getLineNumberForPath(yaml, path) {// Type check
	  if (typeof yaml !== "string") {throw new TypeError("yaml should be a string");}if (!(0, _isArray2.default)(path)) {throw new TypeError("path should be an array of strings");}var i = 0;var ast = cachedCompose(yaml); // simply walks the tree using current path recursively to the point that
	  // path is empty
	  return find(ast, path);function find(current, path, last) {if (!current) {// something has gone quite wrong
	      // return the last start_mark as a best-effort
	      if (last && last.start_mark) return last.start_mark.line;return 0;}if (path.length && current.tag === MAP_TAG) {for (i = 0; i < current.value.length; i++) {var pair = current.value[i];var key = pair[0];var value = pair[1];if (key.value === path[0]) {return find(value, path.slice(1), current);}if (key.value === path[0].replace(/\[.*/, "")) {// access the array at the index in the path (example: grab the 2 in "tags[2]")
	          var index = parseInt(path[0].match(/\[(.*)\]/)[1]);if (value.value.length === 1 && index !== 0 && !!index) {var nextVal = (0, _find2.default)(value.value[0], { value: index.toString() });} else {// eslint-disable-next-line no-redeclare
	            var nextVal = value.value[index];}return find(nextVal, path.slice(1), value.value);}}}if (path.length && current.tag === SEQ_TAG) {var item = current.value[path[0]];if (item && item.tag) {return find(item, path.slice(1), current.value);}}if (current.tag === MAP_TAG && !Array.isArray(last)) {return current.start_mark.line;} else {return current.start_mark.line + 1;}}} /**
	                                                                                                                                                                                                                                                                                                                                                                                              * Get a position object with given
	                                                                                                                                                                                                                                                                                                                                                                                              * @param  {string}   yaml
	                                                                                                                                                                                                                                                                                                                                                                                              * YAML or JSON string
	                                                                                                                                                                                                                                                                                                                                                                                              * @param  {array}   path
	                                                                                                                                                                                                                                                                                                                                                                                              * an array of stings that constructs a
	                                                                                                                                                                                                                                                                                                                                                                                              * JSON Path similiar to JSON Pointers(RFC 6901). The difference is, each
	                                                                                                                                                                                                                                                                                                                                                                                              * component of path is an item of the array intead of beinf seperated with
	                                                                                                                                                                                                                                                                                                                                                                                              * slash(/) in a string
	                                                                                                                                                                                                                                                                                                                                                                                              */function positionRangeForPath(yaml, path) {// Type check
	  if (typeof yaml !== "string") {throw new TypeError("yaml should be a string");}if (!(0, _isArray2.default)(path)) {throw new TypeError("path should be an array of strings");}var invalidRange = { start: { line: -1, column: -1 }, end: { line: -1, column: -1 } };var i = 0;var ast = cachedCompose(yaml); // simply walks the tree using current path recursively to the point that
	  // path is empty.
	  return find(ast);function find(current) {if (current.tag === MAP_TAG) {for (i = 0; i < current.value.length; i++) {var pair = current.value[i];var key = pair[0];var value = pair[1];if (key.value === path[0]) {path.shift();return find(value);}}}if (current.tag === SEQ_TAG) {var item = current.value[path[0]];if (item && item.tag) {path.shift();return find(item);}} // if path is still not empty we were not able to find the node
	    if (path.length) {return invalidRange;}return { /* jshint camelcase: false */start: { line: current.start_mark.line, column: current.start_mark.column }, end: { line: current.end_mark.line, column: current.end_mark.column } };}} /**
	                                                                                                                                                                                                                                         * Get a JSON Path for position object in the spec
	                                                                                                                                                                                                                                         * @param  {string} yaml
	                                                                                                                                                                                                                                         * YAML or JSON string
	                                                                                                                                                                                                                                         * @param  {object} position
	                                                                                                                                                                                                                                         * position in the YAML or JSON string with `line` and `column` properties.
	                                                                                                                                                                                                                                         * `line` and `column` number are zero indexed
	                                                                                                                                                                                                                                         */function pathForPosition(yaml, position) {// Type check
	  if (typeof yaml !== "string") {throw new TypeError("yaml should be a string");}if ((typeof position === "undefined" ? "undefined" : _typeof(position)) !== "object" || typeof position.line !== "number" || typeof position.column !== "number") {throw new TypeError("position should be an object with line and column" + " properties");}try {var ast = cachedCompose(yaml);} catch (e) {console.error("Error composing AST", e);console.error("Problem area:\n", yaml.split("\n").slice(position.line - 5, position.line + 5).join("\n"));return null;}var path = [];return find(ast); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * recursive find function that finds the node matching the position
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * @param  {object} current - AST object to serach into
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             */function find(current) {// algorythm:
	    // is current a promitive?
	    //   // finish recursion without modifying the path
	    // is current a hash?
	    //   // find a key or value that position is in their range
	    //     // if key is in range, terminate recursion with exisiting path
	    //     // if a value is in range push the corresponding key to the path
	    //     //   andcontinue recursion
	    // is current an array
	    //   // find the item that position is in it"s range and push the index
	    //   //  of the item to the path and continue recursion with that item.
	    var i = 0;

	    if (!current || [MAP_TAG, SEQ_TAG].indexOf(current.tag) === -1) {
	      return path;
	    }

	    if (current.tag === MAP_TAG) {
	      for (i = 0; i < current.value.length; i++) {
	        var pair = current.value[i];
	        var key = pair[0];
	        var value = pair[1];

	        if (isInRange(key)) {
	          return path;
	        } else if (isInRange(value)) {
	          path.push(key.value);
	          return find(value);
	        }
	      }
	    }

	    if (current.tag === SEQ_TAG) {
	      for (i = 0; i < current.value.length; i++) {
	        var item = current.value[i];

	        if (isInRange(item)) {
	          path.push(i.toString());
	          return find(item);
	        }
	      }
	    }

	    return path;

	    /**
	                 * Determines if position is in node"s range
	                 * @param  {object}  node - AST node
	                 * @return {Boolean}      true if position is in node"s range
	                 */
	    function isInRange(node) {
	      /* jshint camelcase: false */

	      // if node is in a single line
	      if (node.start_mark.line === node.end_mark.line) {

	        return position.line === node.start_mark.line &&
	        node.start_mark.column <= position.column &&
	        node.end_mark.column >= position.column;
	      }

	      // if position is in the same line as start_mark
	      if (position.line === node.start_mark.line) {
	        return position.column >= node.start_mark.column;
	      }

	      // if position is in the same line as end_mark
	      if (position.line === node.end_mark.line) {
	        return position.column <= node.end_mark.column;
	      }

	      // if position is between start and end lines return true, otherwise
	      // return false.
	      return node.start_mark.line < position.line &&
	      node.end_mark.line > position.line;
	    }
	  }
	}

	// utility fns


	var pathForPositionAsync = exports.pathForPositionAsync = promisifySyncFn(pathForPosition);
	var positionRangeForPathAsync = exports.positionRangeForPathAsync = promisifySyncFn(positionRangeForPath);
	var getLineNumberForPathAsync = exports.getLineNumberForPathAsync = promisifySyncFn(getLineNumberForPath);

	function promisifySyncFn(fn) {
	  return function () {for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
	    return new Promise(function (resolve) {return resolve(fn.apply(undefined, args));});
	  };
	}

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var composer, constructor, dumper, errors, events, fs, loader, nodes, parser, reader, resolver, scanner, tokens, util;

	  composer = this.composer = __webpack_require__(76);

	  constructor = this.constructor = __webpack_require__(80);

	  dumper = this.dumper = __webpack_require__(90);

	  errors = this.errors = __webpack_require__(78);

	  events = this.events = __webpack_require__(77);

	  loader = this.loader = __webpack_require__(95);

	  nodes = this.nodes = __webpack_require__(79);

	  parser = this.parser = __webpack_require__(99);

	  reader = this.reader = __webpack_require__(96);

	  resolver = this.resolver = __webpack_require__(94);

	  scanner = this.scanner = __webpack_require__(97);

	  tokens = this.tokens = __webpack_require__(98);

	  util = __webpack_require__(85);


	  /*
	  Scan a YAML stream and produce scanning tokens.
	   */

	  this.scan = function(stream, Loader) {
	    var _loader, results;
	    if (Loader == null) {
	      Loader = loader.Loader;
	    }
	    _loader = new Loader(stream);
	    results = [];
	    while (_loader.check_token()) {
	      results.push(_loader.get_token());
	    }
	    return results;
	  };


	  /*
	  Parse a YAML stream and produce parsing events.
	   */

	  this.parse = function(stream, Loader) {
	    var _loader, results;
	    if (Loader == null) {
	      Loader = loader.Loader;
	    }
	    _loader = new Loader(stream);
	    results = [];
	    while (_loader.check_event()) {
	      results.push(_loader.get_event());
	    }
	    return results;
	  };


	  /*
	  Parse the first YAML document in a stream and produce the corresponding
	  representation tree.
	   */

	  this.compose = function(stream, Loader) {
	    var _loader;
	    if (Loader == null) {
	      Loader = loader.Loader;
	    }
	    _loader = new Loader(stream);
	    return _loader.get_single_node();
	  };


	  /*
	  Parse all YAML documents in a stream and produce corresponding representation
	  trees.
	   */

	  this.compose_all = function(stream, Loader) {
	    var _loader, results;
	    if (Loader == null) {
	      Loader = loader.Loader;
	    }
	    _loader = new Loader(stream);
	    results = [];
	    while (_loader.check_node()) {
	      results.push(_loader.get_node());
	    }
	    return results;
	  };


	  /*
	  Parse the first YAML document in a stream and produce the corresponding
	  Javascript object.
	   */

	  this.load = function(stream, Loader) {
	    var _loader;
	    if (Loader == null) {
	      Loader = loader.Loader;
	    }
	    _loader = new Loader(stream);
	    return _loader.get_single_data();
	  };


	  /*
	  Parse all YAML documents in a stream and produce the corresponing Javascript
	  object.
	   */

	  this.load_all = function(stream, Loader) {
	    var _loader, results;
	    if (Loader == null) {
	      Loader = loader.Loader;
	    }
	    _loader = new Loader(stream);
	    results = [];
	    while (_loader.check_data()) {
	      results.push(_loader.get_data());
	    }
	    return results;
	  };


	  /*
	  Emit YAML parsing events into a stream.
	  If stream is falsey, return the produced string instead.
	   */

	  this.emit = function(events, stream, Dumper, options) {
	    var _dumper, dest, event, i, len;
	    if (Dumper == null) {
	      Dumper = dumper.Dumper;
	    }
	    if (options == null) {
	      options = {};
	    }
	    dest = stream || new util.StringStream;
	    _dumper = new Dumper(dest, options);
	    try {
	      for (i = 0, len = events.length; i < len; i++) {
	        event = events[i];
	        _dumper.emit(event);
	      }
	    } finally {
	      _dumper.dispose();
	    }
	    return stream || dest.string;
	  };


	  /*
	  Serialize a representation tree into a YAML stream.
	  If stream is falsey, return the produced string instead.
	   */

	  this.serialize = function(node, stream, Dumper, options) {
	    if (Dumper == null) {
	      Dumper = dumper.Dumper;
	    }
	    if (options == null) {
	      options = {};
	    }
	    return exports.serialize_all([node], stream, Dumper, options);
	  };


	  /*
	  Serialize a sequence of representation tress into a YAML stream.
	  If stream is falsey, return the produced string instead.
	   */

	  this.serialize_all = function(nodes, stream, Dumper, options) {
	    var _dumper, dest, i, len, node;
	    if (Dumper == null) {
	      Dumper = dumper.Dumper;
	    }
	    if (options == null) {
	      options = {};
	    }
	    dest = stream || new util.StringStream;
	    _dumper = new Dumper(dest, options);
	    try {
	      _dumper.open();
	      for (i = 0, len = nodes.length; i < len; i++) {
	        node = nodes[i];
	        _dumper.serialize(node);
	      }
	      _dumper.close();
	    } finally {
	      _dumper.dispose();
	    }
	    return stream || dest.string;
	  };


	  /*
	  Serialize a Javascript object into a YAML stream.
	  If stream is falsey, return the produced string instead.
	   */

	  this.dump = function(data, stream, Dumper, options) {
	    if (Dumper == null) {
	      Dumper = dumper.Dumper;
	    }
	    if (options == null) {
	      options = {};
	    }
	    return exports.dump_all([data], stream, Dumper, options);
	  };


	  /*
	  Serialize a sequence of Javascript objects into a YAML stream.
	  If stream is falsey, return the produced string instead.
	   */

	  this.dump_all = function(documents, stream, Dumper, options) {
	    var _dumper, dest, document, i, len;
	    if (Dumper == null) {
	      Dumper = dumper.Dumper;
	    }
	    if (options == null) {
	      options = {};
	    }
	    dest = stream || new util.StringStream;
	    _dumper = new Dumper(dest, options);
	    try {
	      _dumper.open();
	      for (i = 0, len = documents.length; i < len; i++) {
	        document = documents[i];
	        _dumper.represent(document);
	      }
	      _dumper.close();
	    } finally {
	      _dumper.dispose();
	    }
	    return stream || dest.string;
	  };


	  /*
	  Register .yml and .yaml requires with yaml-js
	   */

	  if ("function" !== "undefined" && __webpack_require__(100) !== null ? (void 0) : void 0) {
	    fs = __webpack_require__(101);
	    (void 0)['.yml'] = (void 0)['.yaml'] = function(module, filename) {
	      return module.exports = exports.load_all(fs.readFileSync(filename, 'utf8'));
	    };
	  }

	}).call(this);


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var MarkedYAMLError, events, nodes,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  events = __webpack_require__(77);

	  MarkedYAMLError = __webpack_require__(78).MarkedYAMLError;

	  nodes = __webpack_require__(79);


	  /*
	  Thrown for errors encountered during composing.
	   */

	  this.ComposerError = (function(superClass) {
	    extend(ComposerError, superClass);

	    function ComposerError() {
	      return ComposerError.__super__.constructor.apply(this, arguments);
	    }

	    return ComposerError;

	  })(MarkedYAMLError);


	  /*
	  The composer class handles the construction of representation trees from events.
	  
	  This uses the methods from {Parser} to process the event stream, and provides a similar stream-like
	  interface to representation trees via {Composer#check_node}, {Composer#get_node}, and
	  {Composer#get_single_node}.
	   */

	  this.Composer = (function() {

	    /*
	    Construct a new `Composer` instance.
	     */
	    function Composer() {
	      this.anchors = {};
	    }


	    /*
	    Checks if a document can be composed from the event stream.
	    
	    So long as the event stream hasn't ended (no [StreamEndEvent]), another document can be composed.
	    
	    @return {Boolean} True if a document can be composed, false otherwise.
	     */

	    Composer.prototype.check_node = function() {
	      if (this.check_event(events.StreamStartEvent)) {
	        this.get_event();
	      }
	      return !this.check_event(events.StreamEndEvent);
	    };


	    /*
	    Compose a document from the remaining event stream.
	    
	    {Composer#check_node} must be called before calling this method.
	    
	    @return {Node} The next document in the stream. Returns `undefined` if the event stream has ended.
	     */

	    Composer.prototype.get_node = function() {
	      if (!this.check_event(events.StreamEndEvent)) {
	        return this.compose_document();
	      }
	    };


	    /*
	    Compose a single document from the entire event stream.
	    
	    @throw {ComposerError} if there's more than one document is in the stream.
	    
	    @return {Node} The single document in the stream.
	     */

	    Composer.prototype.get_single_node = function() {
	      var document, event;
	      this.get_event();
	      document = null;
	      if (!this.check_event(events.StreamEndEvent)) {
	        document = this.compose_document();
	      }
	      if (!this.check_event(events.StreamEndEvent)) {
	        event = this.get_event();
	        throw new exports.ComposerError('expected a single document in the stream', document.start_mark, 'but found another document', event.start_mark);
	      }
	      this.get_event();
	      return document;
	    };


	    /*
	    Compose a document node from the event stream.
	    
	    A 'document' node is any single {Node} subclass.  {DocumentStart} and {DocumentEnd} events delimit
	    the events used for composition.
	    
	    @private
	    
	    @return {Node} The document node.
	     */

	    Composer.prototype.compose_document = function() {
	      var node;
	      this.get_event();
	      node = this.compose_node();
	      this.get_event();
	      this.anchors = {};
	      return node;
	    };


	    /*
	    Compose a node from the event stream.
	    
	    Composes a {ScalarNode}, {SequenceNode}, or {MappingNode} from the event stream, depending on the
	    first event encountered ({ScalarEvent}, {SequenceStartEvent}, or {MappingStartEvent}
	    respectively).
	    
	    @private
	    
	    @param parent {Node} The parent of the new node.
	    @param index {Number} The index of the new node within the parent's children.
	    @throw {ComposerError} if an alias is encountered for an undefined anchor.
	    @throw {ComposerError} if a duplicate anchor is envountered.
	    @return {Node} The composed node.
	     */

	    Composer.prototype.compose_node = function(parent, index) {
	      var anchor, event, node;
	      if (this.check_event(events.AliasEvent)) {
	        event = this.get_event();
	        anchor = event.anchor;
	        if (!(anchor in this.anchors)) {
	          throw new exports.ComposerError(null, null, "found undefined alias " + anchor, event.start_mark);
	        }
	        return this.anchors[anchor];
	      }
	      event = this.peek_event();
	      anchor = event.anchor;
	      if (anchor !== null && anchor in this.anchors) {
	        throw new exports.ComposerError("found duplicate anchor " + anchor + "; first occurence", this.anchors[anchor].start_mark, 'second occurrence', event.start_mark);
	      }
	      this.descend_resolver(parent, index);
	      if (this.check_event(events.ScalarEvent)) {
	        node = this.compose_scalar_node(anchor);
	      } else if (this.check_event(events.SequenceStartEvent)) {
	        node = this.compose_sequence_node(anchor);
	      } else if (this.check_event(events.MappingStartEvent)) {
	        node = this.compose_mapping_node(anchor);
	      }
	      this.ascend_resolver();
	      return node;
	    };


	    /*
	    Compose a {ScalarNode} from the event stream.
	    
	    @private
	    
	    @param anchor {String} The anchor name for the node (if any).
	    @return {ScalarNode} The node composed from a {ScalarEvent}.
	     */

	    Composer.prototype.compose_scalar_node = function(anchor) {
	      var event, node, tag;
	      event = this.get_event();
	      tag = event.tag;
	      if (tag === null || tag === '!') {
	        tag = this.resolve(nodes.ScalarNode, event.value, event.implicit);
	      }
	      node = new nodes.ScalarNode(tag, event.value, event.start_mark, event.end_mark, event.style);
	      if (anchor !== null) {
	        this.anchors[anchor] = node;
	      }
	      return node;
	    };


	    /*
	    Compose a {SequenceNode} from the event stream.
	    
	    The contents of the node are composed from events between a {SequenceStartEvent} and a
	    {SequenceEndEvent}.
	    
	    @private
	    
	    @param anchor {String} The anchor name for the node (if any).
	    @return {SequenceNode} The composed node.
	     */

	    Composer.prototype.compose_sequence_node = function(anchor) {
	      var end_event, index, node, start_event, tag;
	      start_event = this.get_event();
	      tag = start_event.tag;
	      if (tag === null || tag === '!') {
	        tag = this.resolve(nodes.SequenceNode, null, start_event.implicit);
	      }
	      node = new nodes.SequenceNode(tag, [], start_event.start_mark, null, start_event.flow_style);
	      if (anchor !== null) {
	        this.anchors[anchor] = node;
	      }
	      index = 0;
	      while (!this.check_event(events.SequenceEndEvent)) {
	        node.value.push(this.compose_node(node, index));
	        index++;
	      }
	      end_event = this.get_event();
	      node.end_mark = end_event.end_mark;
	      return node;
	    };


	    /*
	    Compose a {MappingNode} from the event stream.
	    
	    The contents of the node are composed from events between a {MappingStartEvent} and a
	    {MappingEndEvent}.
	    
	    @private
	    
	    @param anchor {String} The anchor name for the node (if any).
	    @return {MappingNode} The composed node.
	     */

	    Composer.prototype.compose_mapping_node = function(anchor) {
	      var end_event, item_key, item_value, node, start_event, tag;
	      start_event = this.get_event();
	      tag = start_event.tag;
	      if (tag === null || tag === '!') {
	        tag = this.resolve(nodes.MappingNode, null, start_event.implicit);
	      }
	      node = new nodes.MappingNode(tag, [], start_event.start_mark, null, start_event.flow_style);
	      if (anchor !== null) {
	        this.anchors[anchor] = node;
	      }
	      while (!this.check_event(events.MappingEndEvent)) {
	        item_key = this.compose_node(node);
	        item_value = this.compose_node(node, item_key);
	        node.value.push([item_key, item_value]);
	      }
	      end_event = this.get_event();
	      node.end_mark = end_event.end_mark;
	      return node;
	    };

	    return Composer;

	  })();

	}).call(this);


/***/ }),
/* 77 */
/***/ (function(module, exports) {

	(function() {
	  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  this.Event = (function() {
	    function Event(start_mark, end_mark) {
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	    }

	    return Event;

	  })();

	  this.NodeEvent = (function(superClass) {
	    extend(NodeEvent, superClass);

	    function NodeEvent(anchor, start_mark, end_mark) {
	      this.anchor = anchor;
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	    }

	    return NodeEvent;

	  })(this.Event);

	  this.CollectionStartEvent = (function(superClass) {
	    extend(CollectionStartEvent, superClass);

	    function CollectionStartEvent(anchor, tag, implicit, start_mark, end_mark, flow_style) {
	      this.anchor = anchor;
	      this.tag = tag;
	      this.implicit = implicit;
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	      this.flow_style = flow_style;
	    }

	    return CollectionStartEvent;

	  })(this.NodeEvent);

	  this.CollectionEndEvent = (function(superClass) {
	    extend(CollectionEndEvent, superClass);

	    function CollectionEndEvent() {
	      return CollectionEndEvent.__super__.constructor.apply(this, arguments);
	    }

	    return CollectionEndEvent;

	  })(this.Event);

	  this.StreamStartEvent = (function(superClass) {
	    extend(StreamStartEvent, superClass);

	    function StreamStartEvent(start_mark, end_mark, encoding) {
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	      this.encoding = encoding;
	    }

	    return StreamStartEvent;

	  })(this.Event);

	  this.StreamEndEvent = (function(superClass) {
	    extend(StreamEndEvent, superClass);

	    function StreamEndEvent() {
	      return StreamEndEvent.__super__.constructor.apply(this, arguments);
	    }

	    return StreamEndEvent;

	  })(this.Event);

	  this.DocumentStartEvent = (function(superClass) {
	    extend(DocumentStartEvent, superClass);

	    function DocumentStartEvent(start_mark, end_mark, explicit, version, tags) {
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	      this.explicit = explicit;
	      this.version = version;
	      this.tags = tags;
	    }

	    return DocumentStartEvent;

	  })(this.Event);

	  this.DocumentEndEvent = (function(superClass) {
	    extend(DocumentEndEvent, superClass);

	    function DocumentEndEvent(start_mark, end_mark, explicit) {
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	      this.explicit = explicit;
	    }

	    return DocumentEndEvent;

	  })(this.Event);

	  this.AliasEvent = (function(superClass) {
	    extend(AliasEvent, superClass);

	    function AliasEvent() {
	      return AliasEvent.__super__.constructor.apply(this, arguments);
	    }

	    return AliasEvent;

	  })(this.NodeEvent);

	  this.ScalarEvent = (function(superClass) {
	    extend(ScalarEvent, superClass);

	    function ScalarEvent(anchor, tag, implicit, value, start_mark, end_mark, style) {
	      this.anchor = anchor;
	      this.tag = tag;
	      this.implicit = implicit;
	      this.value = value;
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	      this.style = style;
	    }

	    return ScalarEvent;

	  })(this.NodeEvent);

	  this.SequenceStartEvent = (function(superClass) {
	    extend(SequenceStartEvent, superClass);

	    function SequenceStartEvent() {
	      return SequenceStartEvent.__super__.constructor.apply(this, arguments);
	    }

	    return SequenceStartEvent;

	  })(this.CollectionStartEvent);

	  this.SequenceEndEvent = (function(superClass) {
	    extend(SequenceEndEvent, superClass);

	    function SequenceEndEvent() {
	      return SequenceEndEvent.__super__.constructor.apply(this, arguments);
	    }

	    return SequenceEndEvent;

	  })(this.CollectionEndEvent);

	  this.MappingStartEvent = (function(superClass) {
	    extend(MappingStartEvent, superClass);

	    function MappingStartEvent() {
	      return MappingStartEvent.__super__.constructor.apply(this, arguments);
	    }

	    return MappingStartEvent;

	  })(this.CollectionStartEvent);

	  this.MappingEndEvent = (function(superClass) {
	    extend(MappingEndEvent, superClass);

	    function MappingEndEvent() {
	      return MappingEndEvent.__super__.constructor.apply(this, arguments);
	    }

	    return MappingEndEvent;

	  })(this.CollectionEndEvent);

	}).call(this);


/***/ }),
/* 78 */
/***/ (function(module, exports) {

	(function() {
	  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  this.Mark = (function() {
	    function Mark(line, column, buffer, pointer) {
	      this.line = line;
	      this.column = column;
	      this.buffer = buffer;
	      this.pointer = pointer;
	    }

	    Mark.prototype.get_snippet = function(indent, max_length) {
	      var break_chars, end, head, ref, ref1, start, tail;
	      if (indent == null) {
	        indent = 4;
	      }
	      if (max_length == null) {
	        max_length = 75;
	      }
	      if (this.buffer == null) {
	        return null;
	      }
	      break_chars = '\x00\r\n\x85\u2028\u2029';
	      head = '';
	      start = this.pointer;
	      while (start > 0 && (ref = this.buffer[start - 1], indexOf.call(break_chars, ref) < 0)) {
	        start--;
	        if (this.pointer - start > max_length / 2 - 1) {
	          head = ' ... ';
	          start += 5;
	          break;
	        }
	      }
	      tail = '';
	      end = this.pointer;
	      while (end < this.buffer.length && (ref1 = this.buffer[end], indexOf.call(break_chars, ref1) < 0)) {
	        end++;
	        if (end - this.pointer > max_length / 2 - 1) {
	          tail = ' ... ';
	          end -= 5;
	          break;
	        }
	      }
	      return "" + ((new Array(indent)).join(' ')) + head + this.buffer.slice(start, end) + tail + "\n" + ((new Array(indent + this.pointer - start + head.length)).join(' ')) + "^";
	    };

	    Mark.prototype.toString = function() {
	      var snippet, where;
	      snippet = this.get_snippet();
	      where = "  on line " + (this.line + 1) + ", column " + (this.column + 1);
	      if (snippet) {
	        return where;
	      } else {
	        return where + ":\n" + snippet;
	      }
	    };

	    return Mark;

	  })();

	  this.YAMLError = (function(superClass) {
	    extend(YAMLError, superClass);

	    function YAMLError(message) {
	      this.message = message;
	      YAMLError.__super__.constructor.call(this);
	      this.stack = this.toString() + '\n' + (new Error).stack.split('\n').slice(1).join('\n');
	    }

	    YAMLError.prototype.toString = function() {
	      return this.message;
	    };

	    return YAMLError;

	  })(Error);

	  this.MarkedYAMLError = (function(superClass) {
	    extend(MarkedYAMLError, superClass);

	    function MarkedYAMLError(context, context_mark, problem, problem_mark, note) {
	      this.context = context;
	      this.context_mark = context_mark;
	      this.problem = problem;
	      this.problem_mark = problem_mark;
	      this.note = note;
	      MarkedYAMLError.__super__.constructor.call(this);
	    }

	    MarkedYAMLError.prototype.toString = function() {
	      var lines;
	      lines = [];
	      if (this.context != null) {
	        lines.push(this.context);
	      }
	      if ((this.context_mark != null) && ((this.problem == null) || (this.problem_mark == null) || this.context_mark.line !== this.problem_mark.line || this.context_mark.column !== this.problem_mark.column)) {
	        lines.push(this.context_mark.toString());
	      }
	      if (this.problem != null) {
	        lines.push(this.problem);
	      }
	      if (this.problem_mark != null) {
	        lines.push(this.problem_mark.toString());
	      }
	      if (this.note != null) {
	        lines.push(this.note);
	      }
	      return lines.join('\n');
	    };

	    return MarkedYAMLError;

	  })(this.YAMLError);

	}).call(this);


/***/ }),
/* 79 */
/***/ (function(module, exports) {

	(function() {
	  var unique_id,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  unique_id = 0;

	  this.Node = (function() {
	    function Node(tag, value, start_mark, end_mark) {
	      this.tag = tag;
	      this.value = value;
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	      this.unique_id = "node_" + (unique_id++);
	    }

	    return Node;

	  })();

	  this.ScalarNode = (function(superClass) {
	    extend(ScalarNode, superClass);

	    ScalarNode.prototype.id = 'scalar';

	    function ScalarNode(tag, value, start_mark, end_mark, style) {
	      this.tag = tag;
	      this.value = value;
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	      this.style = style;
	      ScalarNode.__super__.constructor.apply(this, arguments);
	    }

	    return ScalarNode;

	  })(this.Node);

	  this.CollectionNode = (function(superClass) {
	    extend(CollectionNode, superClass);

	    function CollectionNode(tag, value, start_mark, end_mark, flow_style) {
	      this.tag = tag;
	      this.value = value;
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	      this.flow_style = flow_style;
	      CollectionNode.__super__.constructor.apply(this, arguments);
	    }

	    return CollectionNode;

	  })(this.Node);

	  this.SequenceNode = (function(superClass) {
	    extend(SequenceNode, superClass);

	    function SequenceNode() {
	      return SequenceNode.__super__.constructor.apply(this, arguments);
	    }

	    SequenceNode.prototype.id = 'sequence';

	    return SequenceNode;

	  })(this.CollectionNode);

	  this.MappingNode = (function(superClass) {
	    extend(MappingNode, superClass);

	    function MappingNode() {
	      return MappingNode.__super__.constructor.apply(this, arguments);
	    }

	    MappingNode.prototype.id = 'mapping';

	    return MappingNode;

	  })(this.CollectionNode);

	}).call(this);


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {(function() {
	  var MarkedYAMLError, nodes, util,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  MarkedYAMLError = __webpack_require__(78).MarkedYAMLError;

	  nodes = __webpack_require__(79);

	  util = __webpack_require__(85);


	  /*
	  Thrown for errors encountered during construction.
	   */

	  this.ConstructorError = (function(superClass) {
	    extend(ConstructorError, superClass);

	    function ConstructorError() {
	      return ConstructorError.__super__.constructor.apply(this, arguments);
	    }

	    return ConstructorError;

	  })(MarkedYAMLError);


	  /*
	  The constructor class handles the construction of Javascript objects from representation trees
	  ({Node}s).
	  
	  This uses the methods from {Composer} to process the representation stream, and provides a similar
	  stream-like interface to Javascript objects via {BaseConstructor#check_node},
	  {BaseConstructor#get_node}, and {BaseConstructor#get_single_node}.
	   */

	  this.BaseConstructor = (function() {

	    /*
	    @property {Object} A map from a YAML tag to a constructor function for data with that tag.
	    @private
	     */
	    BaseConstructor.prototype.yaml_constructors = {};


	    /*
	    @property {Object} A map from a YAML tag prefix to a constructor function for data with that tag
	                       prefix.
	    @private
	     */

	    BaseConstructor.prototype.yaml_multi_constructors = {};


	    /*
	    Add a constructor function for a specific tag.
	    
	    The constructor will be used to turn {Node Nodes} with the given tag into a Javascript object.
	    
	    @param tag {String} The tag for which the constructor should apply.
	    @param constructor {Function<Node,any>} A function that turns a {Node} with the given tag into a
	      Javascript object.
	    @return {Function<Node,Any>} Returns the supplied `constructor`.
	     */

	    BaseConstructor.add_constructor = function(tag, constructor) {
	      if (!this.prototype.hasOwnProperty('yaml_constructors')) {
	        this.prototype.yaml_constructors = util.extend({}, this.prototype.yaml_constructors);
	      }
	      return this.prototype.yaml_constructors[tag] = constructor;
	    };


	    /*
	    Add a constructor function for a tag prefix.
	    
	    The constructor will be used to turn {Node Nodes} with the given tag prefix into a Javascript
	    object.
	    
	    @param tag_prefix {String} The tag prefix for which the constructor should apply.
	    @param multi_constructor {Function<Node,any>} A function that turns a {Node} with the given tag
	      prefix into a Javascript object.
	    @return {Function<Node,Any>} Returns the supplied `multi_constructor`.
	     */

	    BaseConstructor.add_multi_constructor = function(tag_prefix, multi_constructor) {
	      if (!this.prototype.hasOwnProperty('yaml_multi_constructors')) {
	        this.prototype.yaml_multi_constructors = util.extend({}, this.prototype.yaml_multi_constructors);
	      }
	      return this.prototype.yaml_multi_constructors[tag_prefix] = multi_constructor;
	    };


	    /*
	    Construct a new `Constructor` instance.
	     */

	    function BaseConstructor() {
	      this.constructed_objects = {};
	      this.constructing_nodes = [];
	      this.deferred_constructors = [];
	    }


	    /*
	    Checks if a document can be constructed from the representation stream.
	    
	    So long as the representation stream hasn't ended, another document can be constructed.
	    
	    @return {Boolean} True if a document can be constructed, false otherwise.
	     */

	    BaseConstructor.prototype.check_data = function() {
	      return this.check_node();
	    };


	    /*
	    Construct a document from the remaining representation stream.
	    
	    {Constructor#check_data} must be called before calling this method.
	    
	    @return {any} The next document in the stream. Returns `undefined` if the stream has ended.
	     */

	    BaseConstructor.prototype.get_data = function() {
	      if (this.check_node()) {
	        return this.construct_document(this.get_node());
	      }
	    };


	    /*
	    Construct a single document from the entire representation stream.
	    
	    @throw {ComposerError} if there's more than one document is in the stream.
	    
	    @return {Node} The single document in the stream.
	     */

	    BaseConstructor.prototype.get_single_data = function() {
	      var node;
	      node = this.get_single_node();
	      if (node != null) {
	        return this.construct_document(node);
	      }
	      return null;
	    };


	    /*
	    Construct a document node
	    
	    @private
	     */

	    BaseConstructor.prototype.construct_document = function(node) {
	      var data;
	      data = this.construct_object(node);
	      while (!util.is_empty(this.deferred_constructors)) {
	        this.deferred_constructors.pop()();
	      }
	      return data;
	    };

	    BaseConstructor.prototype.defer = function(f) {
	      return this.deferred_constructors.push(f);
	    };

	    BaseConstructor.prototype.construct_object = function(node) {
	      var constructor, object, ref, tag_prefix, tag_suffix;
	      if (node.unique_id in this.constructed_objects) {
	        return this.constructed_objects[node.unique_id];
	      }
	      if (ref = node.unique_id, indexOf.call(this.constructing_nodes, ref) >= 0) {
	        throw new exports.ConstructorError(null, null, 'found unconstructable recursive node', node.start_mark);
	      }
	      this.constructing_nodes.push(node.unique_id);
	      constructor = null;
	      tag_suffix = null;
	      if (node.tag in this.yaml_constructors) {
	        constructor = this.yaml_constructors[node.tag];
	      } else {
	        for (tag_prefix in this.yaml_multi_constructors) {
	          if (node.tag.indexOf(tag_prefix === 0)) {
	            tag_suffix = node.tag.slice(tag_prefix.length);
	            constructor = this.yaml_multi_constructors[tag_prefix];
	            break;
	          }
	        }
	        if (constructor == null) {
	          if (null in this.yaml_multi_constructors) {
	            tag_suffix = node.tag;
	            constructor = this.yaml_multi_constructors[null];
	          } else if (null in this.yaml_constructors) {
	            constructor = this.yaml_constructors[null];
	          } else if (node instanceof nodes.ScalarNode) {
	            constructor = this.construct_scalar;
	          } else if (node instanceof nodes.SequenceNode) {
	            constructor = this.construct_sequence;
	          } else if (node instanceof nodes.MappingNode) {
	            constructor = this.construct_mapping;
	          }
	        }
	      }
	      object = constructor.call(this, tag_suffix != null ? tag_suffix : node, node);
	      this.constructed_objects[node.unique_id] = object;
	      this.constructing_nodes.pop();
	      return object;
	    };

	    BaseConstructor.prototype.construct_scalar = function(node) {
	      if (!(node instanceof nodes.ScalarNode)) {
	        throw new exports.ConstructorError(null, null, "expected a scalar node but found " + node.id, node.start_mark);
	      }
	      return node.value;
	    };

	    BaseConstructor.prototype.construct_sequence = function(node) {
	      var child, i, len, ref, results;
	      if (!(node instanceof nodes.SequenceNode)) {
	        throw new exports.ConstructorError(null, null, "expected a sequence node but found " + node.id, node.start_mark);
	      }
	      ref = node.value;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        child = ref[i];
	        results.push(this.construct_object(child));
	      }
	      return results;
	    };

	    BaseConstructor.prototype.construct_mapping = function(node) {
	      var i, key, key_node, len, mapping, ref, ref1, value, value_node;
	      if (!(node instanceof nodes.MappingNode)) {
	        throw new ConstructorError(null, null, "expected a mapping node but found " + node.id, node.start_mark);
	      }
	      mapping = {};
	      ref = node.value;
	      for (i = 0, len = ref.length; i < len; i++) {
	        ref1 = ref[i], key_node = ref1[0], value_node = ref1[1];
	        key = this.construct_object(key_node);
	        if (typeof key === 'object') {
	          throw new exports.ConstructorError('while constructing a mapping', node.start_mark, 'found unhashable key', key_node.start_mark);
	        }
	        value = this.construct_object(value_node);
	        mapping[key] = value;
	      }
	      return mapping;
	    };

	    BaseConstructor.prototype.construct_pairs = function(node) {
	      var i, key, key_node, len, pairs, ref, ref1, value, value_node;
	      if (!(node instanceof nodes.MappingNode)) {
	        throw new exports.ConstructorError(null, null, "expected a mapping node but found " + node.id, node.start_mark);
	      }
	      pairs = [];
	      ref = node.value;
	      for (i = 0, len = ref.length; i < len; i++) {
	        ref1 = ref[i], key_node = ref1[0], value_node = ref1[1];
	        key = this.construct_object(key_node);
	        value = this.construct_object(value_node);
	        pairs.push([key, value]);
	      }
	      return pairs;
	    };

	    return BaseConstructor;

	  })();

	  this.Constructor = (function(superClass) {
	    var BOOL_VALUES, TIMESTAMP_PARTS, TIMESTAMP_REGEX;

	    extend(Constructor, superClass);

	    function Constructor() {
	      return Constructor.__super__.constructor.apply(this, arguments);
	    }

	    BOOL_VALUES = {
	      on: true,
	      off: false,
	      "true": true,
	      "false": false,
	      yes: true,
	      no: false
	    };

	    TIMESTAMP_REGEX = /^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:(?:[Tt]|[\x20\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\.([0-9]*))?(?:[\x20\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?)?$/;

	    TIMESTAMP_PARTS = {
	      year: 1,
	      month: 2,
	      day: 3,
	      hour: 4,
	      minute: 5,
	      second: 6,
	      fraction: 7,
	      tz: 8,
	      tz_sign: 9,
	      tz_hour: 10,
	      tz_minute: 11
	    };

	    Constructor.prototype.construct_scalar = function(node) {
	      var i, key_node, len, ref, ref1, value_node;
	      if (node instanceof nodes.MappingNode) {
	        ref = node.value;
	        for (i = 0, len = ref.length; i < len; i++) {
	          ref1 = ref[i], key_node = ref1[0], value_node = ref1[1];
	          if (key_node.tag === 'tag:yaml.org,2002:value') {
	            return this.construct_scalar(value_node);
	          }
	        }
	      }
	      return Constructor.__super__.construct_scalar.call(this, node);
	    };

	    Constructor.prototype.flatten_mapping = function(node) {
	      var i, index, j, key_node, len, len1, merge, ref, ref1, submerge, subnode, value, value_node;
	      merge = [];
	      index = 0;
	      while (index < node.value.length) {
	        ref = node.value[index], key_node = ref[0], value_node = ref[1];
	        if (key_node.tag === 'tag:yaml.org,2002:merge') {
	          node.value.splice(index, 1);
	          if (value_node instanceof nodes.MappingNode) {
	            this.flatten_mapping(value_node);
	            merge = merge.concat(value_node.value);
	          } else if (value_node instanceof nodes.SequenceNode) {
	            submerge = [];
	            ref1 = value_node.value;
	            for (i = 0, len = ref1.length; i < len; i++) {
	              subnode = ref1[i];
	              if (!(subnode instanceof nodes.MappingNode)) {
	                throw new exports.ConstructorError('while constructing a mapping', node.start_mark, "expected a mapping for merging, but found " + subnode.id, subnode.start_mark);
	              }
	              this.flatten_mapping(subnode);
	              submerge.push(subnode.value);
	            }
	            submerge.reverse();
	            for (j = 0, len1 = submerge.length; j < len1; j++) {
	              value = submerge[j];
	              merge = merge.concat(value);
	            }
	          } else {
	            throw new exports.ConstructorError('while constructing a mapping', node.start_mark, "expected a mapping or list of mappings for merging but found " + value_node.id, value_node.start_mark);
	          }
	        } else if (key_node.tag === 'tag:yaml.org,2002:value') {
	          key_node.tag = 'tag:yaml.org,2002:str';
	          index++;
	        } else {
	          index++;
	        }
	      }
	      if (merge.length) {
	        return node.value = merge.concat(node.value);
	      }
	    };

	    Constructor.prototype.construct_mapping = function(node) {
	      if (node instanceof nodes.MappingNode) {
	        this.flatten_mapping(node);
	      }
	      return Constructor.__super__.construct_mapping.call(this, node);
	    };

	    Constructor.prototype.construct_yaml_null = function(node) {
	      this.construct_scalar(node);
	      return null;
	    };

	    Constructor.prototype.construct_yaml_bool = function(node) {
	      var value;
	      value = this.construct_scalar(node);
	      return BOOL_VALUES[value.toLowerCase()];
	    };

	    Constructor.prototype.construct_yaml_int = function(node) {
	      var base, digit, digits, i, len, part, ref, sign, value;
	      value = this.construct_scalar(node);
	      value = value.replace(/_/g, '');
	      sign = value[0] === '-' ? -1 : 1;
	      if (ref = value[0], indexOf.call('+-', ref) >= 0) {
	        value = value.slice(1);
	      }
	      if (value === '0') {
	        return 0;
	      } else if (value.indexOf('0b') === 0) {
	        return sign * parseInt(value.slice(2), 2);
	      } else if (value.indexOf('0x') === 0) {
	        return sign * parseInt(value.slice(2), 16);
	      } else if (value.indexOf('0o') === 0) {
	        return sign * parseInt(value.slice(2), 8);
	      } else if (value[0] === '0') {
	        return sign * parseInt(value, 8);
	      } else if (indexOf.call(value, ':') >= 0) {
	        digits = (function() {
	          var i, len, ref1, results;
	          ref1 = value.split(/:/g);
	          results = [];
	          for (i = 0, len = ref1.length; i < len; i++) {
	            part = ref1[i];
	            results.push(parseInt(part));
	          }
	          return results;
	        })();
	        digits.reverse();
	        base = 1;
	        value = 0;
	        for (i = 0, len = digits.length; i < len; i++) {
	          digit = digits[i];
	          value += digit * base;
	          base *= 60;
	        }
	        return sign * value;
	      } else {
	        return sign * parseInt(value);
	      }
	    };

	    Constructor.prototype.construct_yaml_float = function(node) {
	      var base, digit, digits, i, len, part, ref, sign, value;
	      value = this.construct_scalar(node);
	      value = value.replace(/_/g, '').toLowerCase();
	      sign = value[0] === '-' ? -1 : 1;
	      if (ref = value[0], indexOf.call('+-', ref) >= 0) {
	        value = value.slice(1);
	      }
	      if (value === '.inf') {
	        return sign * 2e308;
	      } else if (value === '.nan') {
	        return 0/0;
	      } else if (indexOf.call(value, ':') >= 0) {
	        digits = (function() {
	          var i, len, ref1, results;
	          ref1 = value.split(/:/g);
	          results = [];
	          for (i = 0, len = ref1.length; i < len; i++) {
	            part = ref1[i];
	            results.push(parseFloat(part));
	          }
	          return results;
	        })();
	        digits.reverse();
	        base = 1;
	        value = 0.0;
	        for (i = 0, len = digits.length; i < len; i++) {
	          digit = digits[i];
	          value += digit * base;
	          base *= 60;
	        }
	        return sign * value;
	      } else {
	        return sign * parseFloat(value);
	      }
	    };

	    Constructor.prototype.construct_yaml_binary = function(node) {
	      var error, value;
	      value = this.construct_scalar(node);
	      try {
	        if (typeof window !== "undefined" && window !== null) {
	          return atob(value);
	        }
	        return new Buffer(value, 'base64').toString('ascii');
	      } catch (error1) {
	        error = error1;
	        throw new exports.ConstructorError(null, null, "failed to decode base64 data: " + error, node.start_mark);
	      }
	    };

	    Constructor.prototype.construct_yaml_timestamp = function(node) {
	      var date, day, fraction, hour, index, key, match, millisecond, minute, month, second, tz_hour, tz_minute, tz_sign, value, values, year;
	      value = this.construct_scalar(node);
	      match = node.value.match(TIMESTAMP_REGEX);
	      values = {};
	      for (key in TIMESTAMP_PARTS) {
	        index = TIMESTAMP_PARTS[key];
	        values[key] = match[index];
	      }
	      year = parseInt(values.year);
	      month = parseInt(values.month) - 1;
	      day = parseInt(values.day);
	      if (!values.hour) {
	        return new Date(Date.UTC(year, month, day));
	      }
	      hour = parseInt(values.hour);
	      minute = parseInt(values.minute);
	      second = parseInt(values.second);
	      millisecond = 0;
	      if (values.fraction) {
	        fraction = values.fraction.slice(0, 6);
	        while (fraction.length < 6) {
	          fraction += '0';
	        }
	        fraction = parseInt(fraction);
	        millisecond = Math.round(fraction / 1000);
	      }
	      if (values.tz_sign) {
	        tz_sign = values.tz_sign === '-' ? 1 : -1;
	        if (tz_hour = parseInt(values.tz_hour)) {
	          hour += tz_sign * tz_hour;
	        }
	        if (tz_minute = parseInt(values.tz_minute)) {
	          minute += tz_sign * tz_minute;
	        }
	      }
	      date = new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));
	      return date;
	    };

	    Constructor.prototype.construct_yaml_pair_list = function(type, node) {
	      var list;
	      list = [];
	      if (!(node instanceof nodes.SequenceNode)) {
	        throw new exports.ConstructorError("while constructing " + type, node.start_mark, "expected a sequence but found " + node.id, node.start_mark);
	      }
	      this.defer((function(_this) {
	        return function() {
	          var i, key, key_node, len, ref, ref1, results, subnode, value, value_node;
	          ref = node.value;
	          results = [];
	          for (i = 0, len = ref.length; i < len; i++) {
	            subnode = ref[i];
	            if (!(subnode instanceof nodes.MappingNode)) {
	              throw new exports.ConstructorError("while constructing " + type, node.start_mark, "expected a mapping of length 1 but found " + subnode.id, subnode.start_mark);
	            }
	            if (subnode.value.length !== 1) {
	              throw new exports.ConstructorError("while constructing " + type, node.start_mark, "expected a mapping of length 1 but found " + subnode.id, subnode.start_mark);
	            }
	            ref1 = subnode.value[0], key_node = ref1[0], value_node = ref1[1];
	            key = _this.construct_object(key_node);
	            value = _this.construct_object(value_node);
	            results.push(list.push([key, value]));
	          }
	          return results;
	        };
	      })(this));
	      return list;
	    };

	    Constructor.prototype.construct_yaml_omap = function(node) {
	      return this.construct_yaml_pair_list('an ordered map', node);
	    };

	    Constructor.prototype.construct_yaml_pairs = function(node) {
	      return this.construct_yaml_pair_list('pairs', node);
	    };

	    Constructor.prototype.construct_yaml_set = function(node) {
	      var data;
	      data = [];
	      this.defer((function(_this) {
	        return function() {
	          var item, results;
	          results = [];
	          for (item in _this.construct_mapping(node)) {
	            results.push(data.push(item));
	          }
	          return results;
	        };
	      })(this));
	      return data;
	    };

	    Constructor.prototype.construct_yaml_str = function(node) {
	      return this.construct_scalar(node);
	    };

	    Constructor.prototype.construct_yaml_seq = function(node) {
	      var data;
	      data = [];
	      this.defer((function(_this) {
	        return function() {
	          var i, item, len, ref, results;
	          ref = _this.construct_sequence(node);
	          results = [];
	          for (i = 0, len = ref.length; i < len; i++) {
	            item = ref[i];
	            results.push(data.push(item));
	          }
	          return results;
	        };
	      })(this));
	      return data;
	    };

	    Constructor.prototype.construct_yaml_map = function(node) {
	      var data;
	      data = {};
	      this.defer((function(_this) {
	        return function() {
	          var key, ref, results, value;
	          ref = _this.construct_mapping(node);
	          results = [];
	          for (key in ref) {
	            value = ref[key];
	            results.push(data[key] = value);
	          }
	          return results;
	        };
	      })(this));
	      return data;
	    };

	    Constructor.prototype.construct_yaml_object = function(node, klass) {
	      var data;
	      data = new klass;
	      this.defer((function(_this) {
	        return function() {
	          var key, ref, results, value;
	          ref = _this.construct_mapping(node, true);
	          results = [];
	          for (key in ref) {
	            value = ref[key];
	            results.push(data[key] = value);
	          }
	          return results;
	        };
	      })(this));
	      return data;
	    };

	    Constructor.prototype.construct_undefined = function(node) {
	      throw new exports.ConstructorError(null, null, "could not determine a constructor for the tag " + node.tag, node.start_mark);
	    };

	    return Constructor;

	  })(this.BaseConstructor);

	  this.Constructor.add_constructor('tag:yaml.org,2002:null', this.Constructor.prototype.construct_yaml_null);

	  this.Constructor.add_constructor('tag:yaml.org,2002:bool', this.Constructor.prototype.construct_yaml_bool);

	  this.Constructor.add_constructor('tag:yaml.org,2002:int', this.Constructor.prototype.construct_yaml_int);

	  this.Constructor.add_constructor('tag:yaml.org,2002:float', this.Constructor.prototype.construct_yaml_float);

	  this.Constructor.add_constructor('tag:yaml.org,2002:binary', this.Constructor.prototype.construct_yaml_binary);

	  this.Constructor.add_constructor('tag:yaml.org,2002:timestamp', this.Constructor.prototype.construct_yaml_timestamp);

	  this.Constructor.add_constructor('tag:yaml.org,2002:omap', this.Constructor.prototype.construct_yaml_omap);

	  this.Constructor.add_constructor('tag:yaml.org,2002:pairs', this.Constructor.prototype.construct_yaml_pairs);

	  this.Constructor.add_constructor('tag:yaml.org,2002:set', this.Constructor.prototype.construct_yaml_set);

	  this.Constructor.add_constructor('tag:yaml.org,2002:str', this.Constructor.prototype.construct_yaml_str);

	  this.Constructor.add_constructor('tag:yaml.org,2002:seq', this.Constructor.prototype.construct_yaml_seq);

	  this.Constructor.add_constructor('tag:yaml.org,2002:map', this.Constructor.prototype.construct_yaml_map);

	  this.Constructor.add_constructor(null, this.Constructor.prototype.construct_undefined);

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(81).Buffer))

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(82)
	var ieee754 = __webpack_require__(83)
	var isArray = __webpack_require__(84)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()

	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192 // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}

	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)

	  var actual = that.write(string, encoding)

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len)
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}

	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8'

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true

	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0

	  if (this === target) return 0

	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)

	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }

	  return len
	}

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0

	  if (!val) val = 0

	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }

	  return this
	}

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 82 */
/***/ (function(module, exports) {

	'use strict'

	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray

	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}

	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63

	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}

	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return b64.length * 3 / 4 - placeHoldersCount(b64)
	}

	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)

	  arr = new Arr(len * 3 / 4 - placeHolders)

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len

	  var L = 0

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }

	  parts.push(output)

	  return parts.join('')
	}


/***/ }),
/* 83 */
/***/ (function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ }),
/* 84 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/*
	A small class to stand-in for a stream when you simply want to write to a string.
	 */

	(function() {
	  var ref, ref1, ref2,
	    slice = [].slice,
	    hasProp = {}.hasOwnProperty;

	  this.StringStream = (function() {
	    function StringStream() {
	      this.string = '';
	    }

	    StringStream.prototype.write = function(chunk) {
	      return this.string += chunk;
	    };

	    return StringStream;

	  })();

	  this.clone = (function(_this) {
	    return function(obj) {
	      return _this.extend({}, obj);
	    };
	  })(this);

	  this.extend = function() {
	    var destination, i, k, len, source, sources, v;
	    destination = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
	    for (i = 0, len = sources.length; i < len; i++) {
	      source = sources[i];
	      for (k in source) {
	        v = source[k];
	        destination[k] = v;
	      }
	    }
	    return destination;
	  };

	  this.is_empty = function(obj) {
	    var key;
	    if (Array.isArray(obj) || typeof obj === 'string') {
	      return obj.length === 0;
	    }
	    for (key in obj) {
	      if (!hasProp.call(obj, key)) continue;
	      return false;
	    }
	    return true;
	  };

	  this.inspect = (ref = (ref1 = (ref2 = __webpack_require__(86)) != null ? ref2.inspect : void 0) != null ? ref1 : global.inspect) != null ? ref : function(a) {
	    return "" + a;
	  };

	  this.pad_left = function(str, char, length) {
	    str = String(str);
	    if (str.length >= length) {
	      return str;
	    } else if (str.length + 1 === length) {
	      return "" + char + str;
	    } else {
	      return "" + (new Array(length - str.length + 1).join(char)) + str;
	    }
	  };

	  this.to_hex = function(num) {
	    if (typeof num === 'string') {
	      num = num.charCodeAt(0);
	    }
	    return num.toString(16);
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = ({"NODE_ENV":null,"WEBPACK_INLINE_STYLES":true}).NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(88);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(89);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(87)))

/***/ }),
/* 87 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 88 */
/***/ (function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ }),
/* 89 */
/***/ (function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var emitter, representer, resolver, serializer, util,
	    slice = [].slice;

	  util = __webpack_require__(85);

	  emitter = __webpack_require__(91);

	  serializer = __webpack_require__(92);

	  representer = __webpack_require__(93);

	  resolver = __webpack_require__(94);

	  this.make_dumper = function(Emitter, Serializer, Representer, Resolver) {
	    var Dumper, components;
	    if (Emitter == null) {
	      Emitter = emitter.Emitter;
	    }
	    if (Serializer == null) {
	      Serializer = serializer.Serializer;
	    }
	    if (Representer == null) {
	      Representer = representer.Representer;
	    }
	    if (Resolver == null) {
	      Resolver = resolver.Resolver;
	    }
	    components = [Emitter, Serializer, Representer, Resolver];
	    return Dumper = (function() {
	      var component;

	      util.extend.apply(util, [Dumper.prototype].concat(slice.call((function() {
	        var i, len, results;
	        results = [];
	        for (i = 0, len = components.length; i < len; i++) {
	          component = components[i];
	          results.push(component.prototype);
	        }
	        return results;
	      })())));

	      function Dumper(stream, options) {
	        var i, len, ref;
	        if (options == null) {
	          options = {};
	        }
	        components[0].call(this, stream, options);
	        ref = components.slice(1);
	        for (i = 0, len = ref.length; i < len; i++) {
	          component = ref[i];
	          component.call(this, options);
	        }
	      }

	      return Dumper;

	    })();
	  };

	  this.Dumper = this.make_dumper();

	}).call(this);


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var ScalarAnalysis, YAMLError, events, util,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  events = __webpack_require__(77);

	  util = __webpack_require__(85);

	  YAMLError = __webpack_require__(78).YAMLError;

	  this.EmitterError = (function(superClass) {
	    extend(EmitterError, superClass);

	    function EmitterError() {
	      return EmitterError.__super__.constructor.apply(this, arguments);
	    }

	    return EmitterError;

	  })(YAMLError);


	  /*
	  Emitter expects events obeying the following grammar:
	  
	  stream   ::= STREAM-START document* STREAM-END
	  document ::= DOCUMENT-START node DOCUMENT-END
	  node     ::= SCALA | sequence | mapping
	  sequence ::= SEQUENCE-START node* SEQUENCE-END
	  mapping  ::= MAPPING-START (node node)* MAPPING-END
	   */

	  this.Emitter = (function() {
	    var C_WHITESPACE, DEFAULT_TAG_PREFIXES, ESCAPE_REPLACEMENTS;

	    C_WHITESPACE = '\0 \t\r\n\x85\u2028\u2029';

	    DEFAULT_TAG_PREFIXES = {
	      '!': '!',
	      'tag:yaml.org,2002:': '!!'
	    };

	    ESCAPE_REPLACEMENTS = {
	      '\0': '0',
	      '\x07': 'a',
	      '\x08': 'b',
	      '\x09': 't',
	      '\x0A': 'n',
	      '\x0B': 'v',
	      '\x0C': 'f',
	      '\x0D': 'r',
	      '\x1B': 'e',
	      '"': '"',
	      '\\': '\\',
	      '\x85': 'N',
	      '\xA0': '_',
	      '\u2028': 'L',
	      '\u2029': 'P'
	    };

	    function Emitter(stream, options) {
	      var ref;
	      this.stream = stream;
	      this.encoding = null;
	      this.states = [];
	      this.state = this.expect_stream_start;
	      this.events = [];
	      this.event = null;
	      this.indents = [];
	      this.indent = null;
	      this.flow_level = 0;
	      this.root_context = false;
	      this.sequence_context = false;
	      this.mapping_context = false;
	      this.simple_key_context = false;
	      this.line = 0;
	      this.column = 0;
	      this.whitespace = true;
	      this.indentation = true;
	      this.open_ended = false;
	      this.canonical = options.canonical, this.allow_unicode = options.allow_unicode;
	      if (this.canonical == null) {
	        this.canonical = false;
	      }
	      if (this.allow_unicode == null) {
	        this.allow_unicode = true;
	      }
	      this.best_indent = 1 < options.indent && options.indent < 10 ? options.indent : 2;
	      this.best_width = options.width > this.indent * 2 ? options.width : 80;
	      this.best_line_break = (ref = options.line_break) === '\r' || ref === '\n' || ref === '\r\n' ? options.line_break : '\n';
	      this.tag_prefixes = null;
	      this.prepared_anchor = null;
	      this.prepared_tag = null;
	      this.analysis = null;
	      this.style = null;
	    }


	    /*
	    Reset the state attributes (to clear self-references)
	     */

	    Emitter.prototype.dispose = function() {
	      this.states = [];
	      return this.state = null;
	    };

	    Emitter.prototype.emit = function(event) {
	      var results;
	      this.events.push(event);
	      results = [];
	      while (!this.need_more_events()) {
	        this.event = this.events.shift();
	        this.state();
	        results.push(this.event = null);
	      }
	      return results;
	    };


	    /*
	    In some cases, we wait for a few next events before emitting.
	     */

	    Emitter.prototype.need_more_events = function() {
	      var event;
	      if (this.events.length === 0) {
	        return true;
	      }
	      event = this.events[0];
	      if (event instanceof events.DocumentStartEvent) {
	        return this.need_events(1);
	      } else if (event instanceof events.SequenceStartEvent) {
	        return this.need_events(2);
	      } else if (event instanceof events.MappingStartEvent) {
	        return this.need_events(3);
	      } else {
	        return false;
	      }
	    };

	    Emitter.prototype.need_events = function(count) {
	      var event, i, len, level, ref;
	      level = 0;
	      ref = this.events.slice(1);
	      for (i = 0, len = ref.length; i < len; i++) {
	        event = ref[i];
	        if (event instanceof events.DocumentStartEvent || event instanceof events.CollectionStartEvent) {
	          level++;
	        } else if (event instanceof events.DocumentEndEvent || event instanceof events.CollectionEndEvent) {
	          level--;
	        } else if (event instanceof events.StreamEndEvent) {
	          level = -1;
	        }
	        if (level < 0) {
	          return false;
	        }
	      }
	      return this.events.length < count + 1;
	    };

	    Emitter.prototype.increase_indent = function(options) {
	      if (options == null) {
	        options = {};
	      }
	      this.indents.push(this.indent);
	      if (this.indent == null) {
	        return this.indent = options.flow ? this.best_indent : 0;
	      } else if (!options.indentless) {
	        return this.indent += this.best_indent;
	      }
	    };

	    Emitter.prototype.expect_stream_start = function() {
	      if (this.event instanceof events.StreamStartEvent) {
	        if (this.event.encoding && !('encoding' in this.stream)) {
	          this.encoding = this.event.encoding;
	        }
	        this.write_stream_start();
	        return this.state = this.expect_first_document_start;
	      } else {
	        return this.error('expected StreamStartEvent, but got', this.event);
	      }
	    };

	    Emitter.prototype.expect_nothing = function() {
	      return this.error('expected nothing, but got', this.event);
	    };

	    Emitter.prototype.expect_first_document_start = function() {
	      return this.expect_document_start(true);
	    };

	    Emitter.prototype.expect_document_start = function(first) {
	      var explicit, handle, i, k, len, prefix, ref;
	      if (first == null) {
	        first = false;
	      }
	      if (this.event instanceof events.DocumentStartEvent) {
	        if ((this.event.version || this.event.tags) && this.open_ended) {
	          this.write_indicator('...', true);
	          this.write_indent();
	        }
	        if (this.event.version) {
	          this.write_version_directive(this.prepare_version(this.event.version));
	        }
	        this.tag_prefixes = util.clone(DEFAULT_TAG_PREFIXES);
	        if (this.event.tags) {
	          ref = ((function() {
	            var ref, results;
	            ref = this.event.tags;
	            results = [];
	            for (k in ref) {
	              if (!hasProp.call(ref, k)) continue;
	              results.push(k);
	            }
	            return results;
	          }).call(this)).sort();
	          for (i = 0, len = ref.length; i < len; i++) {
	            handle = ref[i];
	            prefix = this.event.tags[handle];
	            this.tag_prefixes[prefix] = handle;
	            this.write_tag_directive(this.prepare_tag_handle(handle), this.prepare_tag_prefix(prefix));
	          }
	        }
	        explicit = !first || this.event.explicit || this.canonical || this.event.version || this.event.tags || this.check_empty_document();
	        if (explicit) {
	          this.write_indent();
	          this.write_indicator('---', true);
	          if (this.canonical) {
	            this.write_indent();
	          }
	        }
	        return this.state = this.expect_document_root;
	      } else if (this.event instanceof events.StreamEndEvent) {
	        if (this.open_ended) {
	          this.write_indicator('...', true);
	          this.write_indent();
	        }
	        this.write_stream_end();
	        return this.state = this.expect_nothing;
	      } else {
	        return this.error('expected DocumentStartEvent, but got', this.event);
	      }
	    };

	    Emitter.prototype.expect_document_end = function() {
	      if (this.event instanceof events.DocumentEndEvent) {
	        this.write_indent();
	        if (this.event.explicit) {
	          this.write_indicator('...', true);
	          this.write_indent();
	        }
	        this.flush_stream();
	        return this.state = this.expect_document_start;
	      } else {
	        return this.error('expected DocumentEndEvent, but got', this.event);
	      }
	    };

	    Emitter.prototype.expect_document_root = function() {
	      this.states.push(this.expect_document_end);
	      return this.expect_node({
	        root: true
	      });
	    };

	    Emitter.prototype.expect_node = function(expect) {
	      if (expect == null) {
	        expect = {};
	      }
	      this.root_context = !!expect.root;
	      this.sequence_context = !!expect.sequence;
	      this.mapping_context = !!expect.mapping;
	      this.simple_key_context = !!expect.simple_key;
	      if (this.event instanceof events.AliasEvent) {
	        return this.expect_alias();
	      } else if (this.event instanceof events.ScalarEvent || this.event instanceof events.CollectionStartEvent) {
	        this.process_anchor('&');
	        this.process_tag();
	        if (this.event instanceof events.ScalarEvent) {
	          return this.expect_scalar();
	        } else if (this.event instanceof events.SequenceStartEvent) {
	          if (this.flow_level || this.canonical || this.event.flow_style || this.check_empty_sequence()) {
	            return this.expect_flow_sequence();
	          } else {
	            return this.expect_block_sequence();
	          }
	        } else if (this.event instanceof events.MappingStartEvent) {
	          if (this.flow_level || this.canonical || this.event.flow_style || this.check_empty_mapping()) {
	            return this.expect_flow_mapping();
	          } else {
	            return this.expect_block_mapping();
	          }
	        }
	      } else {
	        return this.error('expected NodeEvent, but got', this.event);
	      }
	    };

	    Emitter.prototype.expect_alias = function() {
	      if (!this.event.anchor) {
	        this.error('anchor is not specified for alias');
	      }
	      this.process_anchor('*');
	      return this.state = this.states.pop();
	    };

	    Emitter.prototype.expect_scalar = function() {
	      this.increase_indent({
	        flow: true
	      });
	      this.process_scalar();
	      this.indent = this.indents.pop();
	      return this.state = this.states.pop();
	    };

	    Emitter.prototype.expect_flow_sequence = function() {
	      this.write_indicator('[', true, {
	        whitespace: true
	      });
	      this.flow_level++;
	      this.increase_indent({
	        flow: true
	      });
	      return this.state = this.expect_first_flow_sequence_item;
	    };

	    Emitter.prototype.expect_first_flow_sequence_item = function() {
	      if (this.event instanceof events.SequenceEndEvent) {
	        this.indent = this.indents.pop();
	        this.flow_level--;
	        this.write_indicator(']', false);
	        return this.state = this.states.pop();
	      } else {
	        if (this.canonical || this.column > this.best_width) {
	          this.write_indent();
	        }
	        this.states.push(this.expect_flow_sequence_item);
	        return this.expect_node({
	          sequence: true
	        });
	      }
	    };

	    Emitter.prototype.expect_flow_sequence_item = function() {
	      if (this.event instanceof events.SequenceEndEvent) {
	        this.indent = this.indents.pop();
	        this.flow_level--;
	        if (this.canonical) {
	          this.write_indicator(',', false);
	          this.write_indent();
	        }
	        this.write_indicator(']', false);
	        return this.state = this.states.pop();
	      } else {
	        this.write_indicator(',', false);
	        if (this.canonical || this.column > this.best_width) {
	          this.write_indent();
	        }
	        this.states.push(this.expect_flow_sequence_item);
	        return this.expect_node({
	          sequence: true
	        });
	      }
	    };

	    Emitter.prototype.expect_flow_mapping = function() {
	      this.write_indicator('{', true, {
	        whitespace: true
	      });
	      this.flow_level++;
	      this.increase_indent({
	        flow: true
	      });
	      return this.state = this.expect_first_flow_mapping_key;
	    };

	    Emitter.prototype.expect_first_flow_mapping_key = function() {
	      if (this.event instanceof events.MappingEndEvent) {
	        this.indent = this.indents.pop();
	        this.flow_level--;
	        this.write_indicator('}', false);
	        return this.state = this.states.pop();
	      } else {
	        if (this.canonical || this.column > this.best_width) {
	          this.write_indent();
	        }
	        if (!this.canonical && this.check_simple_key()) {
	          this.states.push(this.expect_flow_mapping_simple_value);
	          return this.expect_node({
	            mapping: true,
	            simple_key: true
	          });
	        } else {
	          this.write_indicator('?', true);
	          this.states.push(this.expect_flow_mapping_value);
	          return this.expect_node({
	            mapping: true
	          });
	        }
	      }
	    };

	    Emitter.prototype.expect_flow_mapping_key = function() {
	      if (this.event instanceof events.MappingEndEvent) {
	        this.indent = this.indents.pop();
	        this.flow_level--;
	        if (this.canonical) {
	          this.write_indicator(',', false);
	          this.write_indent();
	        }
	        this.write_indicator('}', false);
	        return this.state = this.states.pop();
	      } else {
	        this.write_indicator(',', false);
	        if (this.canonical || this.column > this.best_width) {
	          this.write_indent();
	        }
	        if (!this.canonical && this.check_simple_key()) {
	          this.states.push(this.expect_flow_mapping_simple_value);
	          return this.expect_node({
	            mapping: true,
	            simple_key: true
	          });
	        } else {
	          this.write_indicator('?', true);
	          this.states.push(this.expect_flow_mapping_value);
	          return this.expect_node({
	            mapping: true
	          });
	        }
	      }
	    };

	    Emitter.prototype.expect_flow_mapping_simple_value = function() {
	      this.write_indicator(':', false);
	      this.states.push(this.expect_flow_mapping_key);
	      return this.expect_node({
	        mapping: true
	      });
	    };

	    Emitter.prototype.expect_flow_mapping_value = function() {
	      if (this.canonical || this.column > this.best_width) {
	        this.write_indent();
	      }
	      this.write_indicator(':', true);
	      this.states.push(this.expect_flow_mapping_key);
	      return this.expect_node({
	        mapping: true
	      });
	    };

	    Emitter.prototype.expect_block_sequence = function() {
	      var indentless;
	      indentless = this.mapping_context && !this.indentation;
	      this.increase_indent({
	        indentless: indentless
	      });
	      return this.state = this.expect_first_block_sequence_item;
	    };

	    Emitter.prototype.expect_first_block_sequence_item = function() {
	      return this.expect_block_sequence_item(true);
	    };

	    Emitter.prototype.expect_block_sequence_item = function(first) {
	      if (first == null) {
	        first = false;
	      }
	      if (!first && this.event instanceof events.SequenceEndEvent) {
	        this.indent = this.indents.pop();
	        return this.state = this.states.pop();
	      } else {
	        this.write_indent();
	        this.write_indicator('-', true, {
	          indentation: true
	        });
	        this.states.push(this.expect_block_sequence_item);
	        return this.expect_node({
	          sequence: true
	        });
	      }
	    };

	    Emitter.prototype.expect_block_mapping = function() {
	      this.increase_indent();
	      return this.state = this.expect_first_block_mapping_key;
	    };

	    Emitter.prototype.expect_first_block_mapping_key = function() {
	      return this.expect_block_mapping_key(true);
	    };

	    Emitter.prototype.expect_block_mapping_key = function(first) {
	      if (first == null) {
	        first = false;
	      }
	      if (!first && this.event instanceof events.MappingEndEvent) {
	        this.indent = this.indents.pop();
	        return this.state = this.states.pop();
	      } else {
	        this.write_indent();
	        if (this.check_simple_key()) {
	          this.states.push(this.expect_block_mapping_simple_value);
	          return this.expect_node({
	            mapping: true,
	            simple_key: true
	          });
	        } else {
	          this.write_indicator('?', true, {
	            indentation: true
	          });
	          this.states.push(this.expect_block_mapping_value);
	          return this.expect_node({
	            mapping: true
	          });
	        }
	      }
	    };

	    Emitter.prototype.expect_block_mapping_simple_value = function() {
	      this.write_indicator(':', false);
	      this.states.push(this.expect_block_mapping_key);
	      return this.expect_node({
	        mapping: true
	      });
	    };

	    Emitter.prototype.expect_block_mapping_value = function() {
	      this.write_indent();
	      this.write_indicator(':', true, {
	        indentation: true
	      });
	      this.states.push(this.expect_block_mapping_key);
	      return this.expect_node({
	        mapping: true
	      });
	    };

	    Emitter.prototype.check_empty_document = function() {
	      var event;
	      if (!(this.event instanceof events.DocumentStartEvent) || this.events.length === 0) {
	        return false;
	      }
	      event = this.events[0];
	      return event instanceof events.ScalarEvent && (event.anchor == null) && (event.tag == null) && event.implicit && event.value === '';
	    };

	    Emitter.prototype.check_empty_sequence = function() {
	      return this.event instanceof events.SequenceStartEvent && this.events[0] instanceof events.SequenceEndEvent;
	    };

	    Emitter.prototype.check_empty_mapping = function() {
	      return this.event instanceof events.MappingStartEvent && this.events[0] instanceof events.MappingEndEvent;
	    };

	    Emitter.prototype.check_simple_key = function() {
	      var length;
	      length = 0;
	      if (this.event instanceof events.NodeEvent && (this.event.anchor != null)) {
	        if (this.prepared_anchor == null) {
	          this.prepared_anchor = this.prepare_anchor(this.event.anchor);
	        }
	        length += this.prepared_anchor.length;
	      }
	      if ((this.event.tag != null) && (this.event instanceof events.ScalarEvent || this.event instanceof events.CollectionStartEvent)) {
	        if (this.prepared_tag == null) {
	          this.prepared_tag = this.prepare_tag(this.event.tag);
	        }
	        length += this.prepared_tag.length;
	      }
	      if (this.event instanceof events.ScalarEvent) {
	        if (this.analysis == null) {
	          this.analysis = this.analyze_scalar(this.event.value);
	        }
	        length += this.analysis.scalar.length;
	      }
	      return length < 128 && (this.event instanceof events.AliasEvent || (this.event instanceof events.ScalarEvent && !this.analysis.empty && !this.analysis.multiline) || this.check_empty_sequence() || this.check_empty_mapping());
	    };

	    Emitter.prototype.process_anchor = function(indicator) {
	      if (this.event.anchor == null) {
	        this.prepared_anchor = null;
	        return;
	      }
	      if (this.prepared_anchor == null) {
	        this.prepared_anchor = this.prepare_anchor(this.event.anchor);
	      }
	      if (this.prepared_anchor) {
	        this.write_indicator("" + indicator + this.prepared_anchor, true);
	      }
	      return this.prepared_anchor = null;
	    };

	    Emitter.prototype.process_tag = function() {
	      var tag;
	      tag = this.event.tag;
	      if (this.event instanceof events.ScalarEvent) {
	        if (this.style == null) {
	          this.style = this.choose_scalar_style();
	        }
	        if ((!this.canonical || (tag == null)) && ((this.style === '' && this.event.implicit[0]) || (this.style !== '' && this.event.implicit[1]))) {
	          this.prepared_tag = null;
	          return;
	        }
	        if (this.event.implicit[0] && (tag == null)) {
	          tag = '!';
	          this.prepared_tag = null;
	        }
	      } else if ((!this.canonical || (tag == null)) && this.event.implicit) {
	        this.prepared_tag = null;
	        return;
	      }
	      if (tag == null) {
	        this.error('tag is not specified');
	      }
	      if (this.prepared_tag == null) {
	        this.prepared_tag = this.prepare_tag(tag);
	      }
	      this.write_indicator(this.prepared_tag, true);
	      return this.prepared_tag = null;
	    };

	    Emitter.prototype.process_scalar = function() {
	      var split;
	      if (this.analysis == null) {
	        this.analysis = this.analyze_scalar(this.event.value);
	      }
	      if (this.style == null) {
	        this.style = this.choose_scalar_style();
	      }
	      split = !this.simple_key_context;
	      switch (this.style) {
	        case '"':
	          this.write_double_quoted(this.analysis.scalar, split);
	          break;
	        case "'":
	          this.write_single_quoted(this.analysis.scalar, split);
	          break;
	        case '>':
	          this.write_folded(this.analysis.scalar);
	          break;
	        case '|':
	          this.write_literal(this.analysis.scalar);
	          break;
	        default:
	          this.write_plain(this.analysis.scalar, split);
	      }
	      this.analysis = null;
	      return this.style = null;
	    };

	    Emitter.prototype.choose_scalar_style = function() {
	      var ref;
	      if (this.analysis == null) {
	        this.analysis = this.analyze_scalar(this.event.value);
	      }
	      if (this.event.style === '"' || this.canonical) {
	        return '"';
	      }
	      if (!this.event.style && this.event.implicit[0] && !(this.simple_key_context && (this.analysis.empty || this.analysis.multiline)) && ((this.flow_level && this.analysis.allow_flow_plain) || (!this.flow_level && this.analysis.allow_block_plain))) {
	        return '';
	      }
	      if (this.event.style && (ref = this.event.style, indexOf.call('|>', ref) >= 0) && !this.flow_level && !this.simple_key_context && this.analysis.allow_block) {
	        return this.event.style;
	      }
	      if ((!this.event.style || this.event.style === "'") && this.analysis.allow_single_quoted && !(this.simple_key_context && this.analysis.multiline)) {
	        return "'";
	      }
	      return '"';
	    };

	    Emitter.prototype.prepare_version = function(arg) {
	      var major, minor, version;
	      major = arg[0], minor = arg[1];
	      version = major + "." + minor;
	      if (major === 1) {
	        return version;
	      } else {
	        return this.error('unsupported YAML version', version);
	      }
	    };

	    Emitter.prototype.prepare_tag_handle = function(handle) {
	      var char, i, len, ref;
	      if (!handle) {
	        this.error('tag handle must not be empty');
	      }
	      if (handle[0] !== '!' || handle.slice(-1) !== '!') {
	        this.error("tag handle must start and end with '!':", handle);
	      }
	      ref = handle.slice(1, -1);
	      for (i = 0, len = ref.length; i < len; i++) {
	        char = ref[i];
	        if (!(('0' <= char && char <= '9') || ('A' <= char && char <= 'Z') || ('a' <= char && char <= 'z') || indexOf.call('-_', char) >= 0)) {
	          this.error("invalid character '" + char + "' in the tag handle:", handle);
	        }
	      }
	      return handle;
	    };

	    Emitter.prototype.prepare_tag_prefix = function(prefix) {
	      var char, chunks, end, start;
	      if (!prefix) {
	        this.error('tag prefix must not be empty');
	      }
	      chunks = [];
	      start = 0;
	      end = +(prefix[0] === '!');
	      while (end < prefix.length) {
	        char = prefix[end];
	        if (('0' <= char && char <= '9') || ('A' <= char && char <= 'Z') || ('a' <= char && char <= 'z') || indexOf.call('-;/?!:@&=+$,_.~*\'()[]', char) >= 0) {
	          end++;
	        } else {
	          if (start < end) {
	            chunks.push(prefix.slice(start, end));
	          }
	          start = end = end + 1;
	          chunks.push(char);
	        }
	      }
	      if (start < end) {
	        chunks.push(prefix.slice(start, end));
	      }
	      return chunks.join('');
	    };

	    Emitter.prototype.prepare_tag = function(tag) {
	      var char, chunks, end, handle, i, k, len, prefix, ref, start, suffix, suffix_text;
	      if (!tag) {
	        this.error('tag must not be empty');
	      }
	      if (tag === '!') {
	        return tag;
	      }
	      handle = null;
	      suffix = tag;
	      ref = ((function() {
	        var ref, results;
	        ref = this.tag_prefixes;
	        results = [];
	        for (k in ref) {
	          if (!hasProp.call(ref, k)) continue;
	          results.push(k);
	        }
	        return results;
	      }).call(this)).sort();
	      for (i = 0, len = ref.length; i < len; i++) {
	        prefix = ref[i];
	        if (tag.indexOf(prefix) === 0 && (prefix === '!' || prefix.length < tag.length)) {
	          handle = this.tag_prefixes[prefix];
	          suffix = tag.slice(prefix.length);
	        }
	      }
	      chunks = [];
	      start = end = 0;
	      while (end < suffix.length) {
	        char = suffix[end];
	        if (('0' <= char && char <= '9') || ('A' <= char && char <= 'Z') || ('a' <= char && char <= 'z') || indexOf.call('-;/?!:@&=+$,_.~*\'()[]', char) >= 0 || (char === '!' && handle !== '!')) {
	          end++;
	        } else {
	          if (start < end) {
	            chunks.push(suffix.slice(start, end));
	          }
	          start = end = end + 1;
	          chunks.push(char);
	        }
	      }
	      if (start < end) {
	        chunks.push(suffix.slice(start, end));
	      }
	      suffix_text = chunks.join('');
	      if (handle) {
	        return "" + handle + suffix_text;
	      } else {
	        return "!<" + suffix_text + ">";
	      }
	    };

	    Emitter.prototype.prepare_anchor = function(anchor) {
	      var char, i, len;
	      if (!anchor) {
	        this.error('anchor must not be empty');
	      }
	      for (i = 0, len = anchor.length; i < len; i++) {
	        char = anchor[i];
	        if (!(('0' <= char && char <= '9') || ('A' <= char && char <= 'Z') || ('a' <= char && char <= 'z') || indexOf.call('-_', char) >= 0)) {
	          this.error("invalid character '" + char + "' in the anchor:", anchor);
	        }
	      }
	      return anchor;
	    };

	    Emitter.prototype.analyze_scalar = function(scalar) {
	      var allow_block, allow_block_plain, allow_double_quoted, allow_flow_plain, allow_single_quoted, block_indicators, break_space, char, flow_indicators, followed_by_whitespace, i, index, leading_break, leading_space, len, line_breaks, preceded_by_whitespace, previous_break, previous_space, ref, ref1, space_break, special_characters, trailing_break, trailing_space, unicode_characters;
	      if (!scalar) {
	        new ScalarAnalysis(scalar, true, false, false, true, true, true, false);
	      }
	      block_indicators = false;
	      flow_indicators = false;
	      line_breaks = false;
	      special_characters = false;
	      unicode_characters = false;
	      leading_space = false;
	      leading_break = false;
	      trailing_space = false;
	      trailing_break = false;
	      break_space = false;
	      space_break = false;
	      if (scalar.indexOf('---') === 0 || scalar.indexOf('...') === 0) {
	        block_indicators = true;
	        flow_indicators = true;
	      }
	      preceded_by_whitespace = true;
	      followed_by_whitespace = scalar.length === 1 || (ref = scalar[1], indexOf.call('\0 \t\r\n\x85\u2028\u2029', ref) >= 0);
	      previous_space = false;
	      previous_break = false;
	      index = 0;
	      for (index = i = 0, len = scalar.length; i < len; index = ++i) {
	        char = scalar[index];
	        if (index === 0) {
	          if (indexOf.call('#,[]{}&*!|>\'"%@`', char) >= 0 || (char === '-' && followed_by_whitespace)) {
	            flow_indicators = true;
	            block_indicators = true;
	          } else if (indexOf.call('?:', char) >= 0) {
	            flow_indicators = true;
	            if (followed_by_whitespace) {
	              block_indicators = true;
	            }
	          }
	        } else {
	          if (indexOf.call(',?[]{}', char) >= 0) {
	            flow_indicators = true;
	          } else if (char === ':') {
	            flow_indicators = true;
	            if (followed_by_whitespace) {
	              block_indicators = true;
	            }
	          } else if (char === '#' && preceded_by_whitespace) {
	            flow_indicators = true;
	            block_indicators = true;
	          }
	        }
	        if (indexOf.call('\n\x85\u2028\u2029', char) >= 0) {
	          line_breaks = true;
	        }
	        if (!(char === '\n' || ('\x20' <= char && char <= '\x7e'))) {
	          if (char !== '\uFEFF' && (char === '\x85' || ('\xA0' <= char && char <= '\uD7FF') || ('\uE000' <= char && char <= '\uFFFD'))) {
	            unicode_characters = true;
	            if (!this.allow_unicode) {
	              special_characters = true;
	            }
	          } else {
	            special_characters = true;
	          }
	        }
	        if (char === ' ') {
	          if (index === 0) {
	            leading_space = true;
	          }
	          if (index === scalar.length - 1) {
	            trailing_space = true;
	          }
	          if (previous_break) {
	            break_space = true;
	          }
	          previous_break = false;
	          previous_space = true;
	        } else if (indexOf.call('\n\x85\u2028\u2029', char) >= 0) {
	          if (index === 0) {
	            leading_break = true;
	          }
	          if (index === scalar.length - 1) {
	            trailing_break = true;
	          }
	          if (previous_space) {
	            space_break = true;
	          }
	          previous_break = true;
	          previous_space = false;
	        } else {
	          previous_break = false;
	          previous_space = false;
	        }
	        preceded_by_whitespace = indexOf.call(C_WHITESPACE, char) >= 0;
	        followed_by_whitespace = index + 2 >= scalar.length || (ref1 = scalar[index + 2], indexOf.call(C_WHITESPACE, ref1) >= 0);
	      }
	      allow_flow_plain = true;
	      allow_block_plain = true;
	      allow_single_quoted = true;
	      allow_double_quoted = true;
	      allow_block = true;
	      if (leading_space || leading_break || trailing_space || trailing_break) {
	        allow_flow_plain = allow_block_plain = false;
	      }
	      if (trailing_space) {
	        allow_block = false;
	      }
	      if (break_space) {
	        allow_flow_plain = allow_block_plain = allow_single_quoted = false;
	      }
	      if (space_break || special_characters) {
	        allow_flow_plain = allow_block_plain = allow_single_quoted = allow_block = false;
	      }
	      if (line_breaks) {
	        allow_flow_plain = allow_block_plain = false;
	      }
	      if (flow_indicators) {
	        allow_flow_plain = false;
	      }
	      if (block_indicators) {
	        allow_block_plain = false;
	      }
	      return new ScalarAnalysis(scalar, false, line_breaks, allow_flow_plain, allow_block_plain, allow_single_quoted, allow_double_quoted, allow_block);
	    };


	    /*
	    Write BOM if needed.
	     */

	    Emitter.prototype.write_stream_start = function() {
	      if (this.encoding && this.encoding.indexOf('utf-16') === 0) {
	        return this.stream.write('\uFEFF', this.encoding);
	      }
	    };

	    Emitter.prototype.write_stream_end = function() {
	      return this.flush_stream();
	    };

	    Emitter.prototype.write_indicator = function(indicator, need_whitespace, options) {
	      var data;
	      if (options == null) {
	        options = {};
	      }
	      data = this.whitespace || !need_whitespace ? indicator : ' ' + indicator;
	      this.whitespace = !!options.whitespace;
	      this.indentation && (this.indentation = !!options.indentation);
	      this.column += data.length;
	      this.open_ended = false;
	      return this.stream.write(data, this.encoding);
	    };

	    Emitter.prototype.write_indent = function() {
	      var data, indent, ref;
	      indent = (ref = this.indent) != null ? ref : 0;
	      if (!this.indentation || this.column > indent || (this.column === indent && !this.whitespace)) {
	        this.write_line_break();
	      }
	      if (this.column < indent) {
	        this.whitespace = true;
	        data = new Array(indent - this.column + 1).join(' ');
	        this.column = indent;
	        return this.stream.write(data, this.encoding);
	      }
	    };

	    Emitter.prototype.write_line_break = function(data) {
	      this.whitespace = true;
	      this.indentation = true;
	      this.line += 1;
	      this.column = 0;
	      return this.stream.write(data != null ? data : this.best_line_break, this.encoding);
	    };

	    Emitter.prototype.write_version_directive = function(version_text) {
	      this.stream.write("%YAML " + version_text, this.encoding);
	      return this.write_line_break();
	    };

	    Emitter.prototype.write_tag_directive = function(handle_text, prefix_text) {
	      this.stream.write("%TAG " + handle_text + " " + prefix_text, this.encoding);
	      return this.write_line_break();
	    };

	    Emitter.prototype.write_single_quoted = function(text, split) {
	      var br, breaks, char, data, end, i, len, ref, spaces, start;
	      if (split == null) {
	        split = true;
	      }
	      this.write_indicator("'", true);
	      spaces = false;
	      breaks = false;
	      start = end = 0;
	      while (end <= text.length) {
	        char = text[end];
	        if (spaces) {
	          if ((char == null) || char !== ' ') {
	            if (start + 1 === end && this.column > this.best_width && split && start !== 0 && end !== text.length) {
	              this.write_indent();
	            } else {
	              data = text.slice(start, end);
	              this.column += data.length;
	              this.stream.write(data, this.encoding);
	            }
	            start = end;
	          }
	        } else if (breaks) {
	          if ((char == null) || indexOf.call('\n\x85\u2028\u2029', char) < 0) {
	            if (text[start] === '\n') {
	              this.write_line_break();
	            }
	            ref = text.slice(start, end);
	            for (i = 0, len = ref.length; i < len; i++) {
	              br = ref[i];
	              if (br === '\n') {
	                this.write_line_break();
	              } else {
	                this.write_line_break(br);
	              }
	            }
	            this.write_indent();
	            start = end;
	          }
	        } else if (((char == null) || indexOf.call(' \n\x85\u2028\u2029', char) >= 0 || char === "'") && start < end) {
	          data = text.slice(start, end);
	          this.column += data.length;
	          this.stream.write(data, this.encoding);
	          start = end;
	        }
	        if (char === "'") {
	          this.column += 2;
	          this.stream.write("''", this.encoding);
	          start = end + 1;
	        }
	        if (char != null) {
	          spaces = char === ' ';
	          breaks = indexOf.call('\n\x85\u2028\u2029', char) >= 0;
	        }
	        end++;
	      }
	      return this.write_indicator("'", false);
	    };

	    Emitter.prototype.write_double_quoted = function(text, split) {
	      var char, data, end, start;
	      if (split == null) {
	        split = true;
	      }
	      this.write_indicator('"', true);
	      start = end = 0;
	      while (end <= text.length) {
	        char = text[end];
	        if ((char == null) || indexOf.call('"\\\x85\u2028\u2029\uFEFF', char) >= 0 || !(('\x20' <= char && char <= '\x7E') || (this.allow_unicode && (('\xA0' <= char && char <= '\uD7FF') || ('\uE000' <= char && char <= '\uFFFD'))))) {
	          if (start < end) {
	            data = text.slice(start, end);
	            this.column += data.length;
	            this.stream.write(data, this.encoding);
	            start = end;
	          }
	          if (char != null) {
	            data = char in ESCAPE_REPLACEMENTS ? '\\' + ESCAPE_REPLACEMENTS[char] : char <= '\xFF' ? "\\x" + (util.pad_left(util.to_hex(char), '0', 2)) : char <= '\uFFFF' ? "\\u" + (util.pad_left(util.to_hex(char), '0', 4)) : "\\U" + (util.pad_left(util.to_hex(char), '0', 16));
	            this.column += data.length;
	            this.stream.write(data, this.encoding);
	            start = end + 1;
	          }
	        }
	        if (split && (0 < end && end < text.length - 1) && (char === ' ' || start >= end) && this.column + (end - start) > this.best_width) {
	          data = text.slice(start, end) + "\\";
	          if (start < end) {
	            start = end;
	          }
	          this.column += data.length;
	          this.stream.write(data, this.encoding);
	          this.write_indent();
	          this.whitespace = false;
	          this.indentation = false;
	          if (text[start] === ' ') {
	            data = '\\';
	            this.column += data.length;
	            this.stream.write(data, this.encoding);
	          }
	        }
	        end++;
	      }
	      return this.write_indicator('"', false);
	    };

	    Emitter.prototype.write_folded = function(text) {
	      var br, breaks, char, data, end, hints, i, leading_space, len, ref, results, spaces, start;
	      hints = this.determine_block_hints(text);
	      this.write_indicator(">" + hints, true);
	      if (hints.slice(-1) === '+') {
	        this.open_ended = true;
	      }
	      this.write_line_break();
	      leading_space = true;
	      breaks = true;
	      spaces = false;
	      start = end = 0;
	      results = [];
	      while (end <= text.length) {
	        char = text[end];
	        if (breaks) {
	          if ((char == null) || indexOf.call('\n\x85\u2028\u2029', char) < 0) {
	            if (!leading_space && (char != null) && char !== ' ' && text[start] === '\n') {
	              this.write_line_break();
	            }
	            leading_space = char === ' ';
	            ref = text.slice(start, end);
	            for (i = 0, len = ref.length; i < len; i++) {
	              br = ref[i];
	              if (br === '\n') {
	                this.write_line_break();
	              } else {
	                this.write_line_break(br);
	              }
	            }
	            if (char != null) {
	              this.write_indent();
	            }
	            start = end;
	          }
	        } else if (spaces) {
	          if (char !== ' ') {
	            if (start + 1 === end && this.column > this.best_width) {
	              this.write_indent();
	            } else {
	              data = text.slice(start, end);
	              this.column += data.length;
	              this.stream.write(data, this.encoding);
	            }
	            start = end;
	          }
	        } else if ((char == null) || indexOf.call(' \n\x85\u2028\u2029', char) >= 0) {
	          data = text.slice(start, end);
	          this.column += data.length;
	          this.stream.write(data, this.encoding);
	          if (char == null) {
	            this.write_line_break();
	          }
	          start = end;
	        }
	        if (char != null) {
	          breaks = indexOf.call('\n\x85\u2028\u2029', char) >= 0;
	          spaces = char === ' ';
	        }
	        results.push(end++);
	      }
	      return results;
	    };

	    Emitter.prototype.write_literal = function(text) {
	      var br, breaks, char, data, end, hints, i, len, ref, results, start;
	      hints = this.determine_block_hints(text);
	      this.write_indicator("|" + hints, true);
	      if (hints.slice(-1) === '+') {
	        this.open_ended = true;
	      }
	      this.write_line_break();
	      breaks = true;
	      start = end = 0;
	      results = [];
	      while (end <= text.length) {
	        char = text[end];
	        if (breaks) {
	          if ((char == null) || indexOf.call('\n\x85\u2028\u2029', char) < 0) {
	            ref = text.slice(start, end);
	            for (i = 0, len = ref.length; i < len; i++) {
	              br = ref[i];
	              if (br === '\n') {
	                this.write_line_break();
	              } else {
	                this.write_line_break(br);
	              }
	            }
	            if (char != null) {
	              this.write_indent();
	            }
	            start = end;
	          }
	        } else {
	          if ((char == null) || indexOf.call('\n\x85\u2028\u2029', char) >= 0) {
	            data = text.slice(start, end);
	            this.stream.write(data, this.encoding);
	            if (char == null) {
	              this.write_line_break();
	            }
	            start = end;
	          }
	        }
	        if (char != null) {
	          breaks = indexOf.call('\n\x85\u2028\u2029', char) >= 0;
	        }
	        results.push(end++);
	      }
	      return results;
	    };

	    Emitter.prototype.write_plain = function(text, split) {
	      var br, breaks, char, data, end, i, len, ref, results, spaces, start;
	      if (split == null) {
	        split = true;
	      }
	      if (!text) {
	        return;
	      }
	      if (this.root_context) {
	        this.open_ended = true;
	      }
	      if (!this.whitespace) {
	        data = ' ';
	        this.column += data.length;
	        this.stream.write(data, this.encoding);
	      }
	      this.whitespace = false;
	      this.indentation = false;
	      spaces = false;
	      breaks = false;
	      start = end = 0;
	      results = [];
	      while (end <= text.length) {
	        char = text[end];
	        if (spaces) {
	          if (char !== ' ') {
	            if (start + 1 === end && this.column > this.best_width && split) {
	              this.write_indent();
	              this.whitespace = false;
	              this.indentation = false;
	            } else {
	              data = text.slice(start, end);
	              this.column += data.length;
	              this.stream.write(data, this.encoding);
	            }
	            start = end;
	          }
	        } else if (breaks) {
	          if (indexOf.call('\n\x85\u2028\u2029', char) < 0) {
	            if (text[start] === '\n') {
	              this.write_line_break();
	            }
	            ref = text.slice(start, end);
	            for (i = 0, len = ref.length; i < len; i++) {
	              br = ref[i];
	              if (br === '\n') {
	                this.write_line_break();
	              } else {
	                this.write_line_break(br);
	              }
	            }
	            this.write_indent();
	            this.whitespace = false;
	            this.indentation = false;
	            start = end;
	          }
	        } else {
	          if ((char == null) || indexOf.call(' \n\x85\u2028\u2029', char) >= 0) {
	            data = text.slice(start, end);
	            this.column += data.length;
	            this.stream.write(data, this.encoding);
	            start = end;
	          }
	        }
	        if (char != null) {
	          spaces = char === ' ';
	          breaks = indexOf.call('\n\x85\u2028\u2029', char) >= 0;
	        }
	        results.push(end++);
	      }
	      return results;
	    };

	    Emitter.prototype.determine_block_hints = function(text) {
	      var first, hints, i, last, penultimate;
	      hints = '';
	      first = text[0], i = text.length - 2, penultimate = text[i++], last = text[i++];
	      if (indexOf.call(' \n\x85\u2028\u2029', first) >= 0) {
	        hints += this.best_indent;
	      }
	      if (indexOf.call('\n\x85\u2028\u2029', last) < 0) {
	        hints += '-';
	      } else if (text.length === 1 || indexOf.call('\n\x85\u2028\u2029', penultimate) >= 0) {
	        hints += '+';
	      }
	      return hints;
	    };

	    Emitter.prototype.flush_stream = function() {
	      var base;
	      return typeof (base = this.stream).flush === "function" ? base.flush() : void 0;
	    };


	    /*
	    Helper for common error pattern.
	     */

	    Emitter.prototype.error = function(message, context) {
	      var ref, ref1;
	      if (context) {
	        context = (ref = context != null ? (ref1 = context.constructor) != null ? ref1.name : void 0 : void 0) != null ? ref : util.inspect(context);
	      }
	      throw new exports.EmitterError("" + message + (context ? " " + context : ''));
	    };

	    return Emitter;

	  })();

	  ScalarAnalysis = (function() {
	    function ScalarAnalysis(scalar1, empty, multiline, allow_flow_plain1, allow_block_plain1, allow_single_quoted1, allow_double_quoted1, allow_block1) {
	      this.scalar = scalar1;
	      this.empty = empty;
	      this.multiline = multiline;
	      this.allow_flow_plain = allow_flow_plain1;
	      this.allow_block_plain = allow_block_plain1;
	      this.allow_single_quoted = allow_single_quoted1;
	      this.allow_double_quoted = allow_double_quoted1;
	      this.allow_block = allow_block1;
	    }

	    return ScalarAnalysis;

	  })();

	}).call(this);


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var YAMLError, events, nodes, util,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  events = __webpack_require__(77);

	  nodes = __webpack_require__(79);

	  util = __webpack_require__(85);

	  YAMLError = __webpack_require__(78).YAMLError;

	  this.SerializerError = (function(superClass) {
	    extend(SerializerError, superClass);

	    function SerializerError() {
	      return SerializerError.__super__.constructor.apply(this, arguments);
	    }

	    return SerializerError;

	  })(YAMLError);

	  this.Serializer = (function() {
	    function Serializer(arg) {
	      var ref;
	      ref = arg != null ? arg : {}, this.encoding = ref.encoding, this.explicit_start = ref.explicit_start, this.explicit_end = ref.explicit_end, this.version = ref.version, this.tags = ref.tags;
	      this.serialized_nodes = {};
	      this.anchors = {};
	      this.last_anchor_id = 0;
	      this.closed = null;
	    }

	    Serializer.prototype.open = function() {
	      if (this.closed === null) {
	        this.emit(new events.StreamStartEvent(this.encoding));
	        return this.closed = false;
	      } else if (this.closed) {
	        throw new SerializerError('serializer is closed');
	      } else {
	        throw new SerializerError('serializer is already open');
	      }
	    };

	    Serializer.prototype.close = function() {
	      if (this.closed === null) {
	        throw new SerializerError('serializer is not opened');
	      } else if (!this.closed) {
	        this.emit(new events.StreamEndEvent);
	        return this.closed = true;
	      }
	    };

	    Serializer.prototype.serialize = function(node) {
	      if (this.closed === null) {
	        throw new SerializerError('serializer is not opened');
	      } else if (this.closed) {
	        throw new SerializerError('serializer is closed');
	      }
	      if (node != null) {
	        this.emit(new events.DocumentStartEvent(void 0, void 0, this.explicit_start, this.version, this.tags));
	        this.anchor_node(node);
	        this.serialize_node(node);
	        this.emit(new events.DocumentEndEvent(void 0, void 0, this.explicit_end));
	      }
	      this.serialized_nodes = {};
	      this.anchors = {};
	      return this.last_anchor_id = 0;
	    };

	    Serializer.prototype.anchor_node = function(node) {
	      var base, i, item, j, key, len, len1, name, ref, ref1, ref2, results, results1, value;
	      if (node.unique_id in this.anchors) {
	        return (base = this.anchors)[name = node.unique_id] != null ? base[name] : base[name] = this.generate_anchor(node);
	      } else {
	        this.anchors[node.unique_id] = null;
	        if (node instanceof nodes.SequenceNode) {
	          ref = node.value;
	          results = [];
	          for (i = 0, len = ref.length; i < len; i++) {
	            item = ref[i];
	            results.push(this.anchor_node(item));
	          }
	          return results;
	        } else if (node instanceof nodes.MappingNode) {
	          ref1 = node.value;
	          results1 = [];
	          for (j = 0, len1 = ref1.length; j < len1; j++) {
	            ref2 = ref1[j], key = ref2[0], value = ref2[1];
	            this.anchor_node(key);
	            results1.push(this.anchor_node(value));
	          }
	          return results1;
	        }
	      }
	    };

	    Serializer.prototype.generate_anchor = function(node) {
	      return "id" + (util.pad_left(++this.last_anchor_id, '0', 4));
	    };

	    Serializer.prototype.serialize_node = function(node, parent, index) {
	      var alias, default_tag, detected_tag, i, implicit, item, j, key, len, len1, ref, ref1, ref2, value;
	      alias = this.anchors[node.unique_id];
	      if (node.unique_id in this.serialized_nodes) {
	        return this.emit(new events.AliasEvent(alias));
	      } else {
	        this.serialized_nodes[node.unique_id] = true;
	        this.descend_resolver(parent, index);
	        if (node instanceof nodes.ScalarNode) {
	          detected_tag = this.resolve(nodes.ScalarNode, node.value, [true, false]);
	          default_tag = this.resolve(nodes.ScalarNode, node.value, [false, true]);
	          implicit = [node.tag === detected_tag, node.tag === default_tag];
	          this.emit(new events.ScalarEvent(alias, node.tag, implicit, node.value, void 0, void 0, node.style));
	        } else if (node instanceof nodes.SequenceNode) {
	          implicit = node.tag === this.resolve(nodes.SequenceNode, node.value, true);
	          this.emit(new events.SequenceStartEvent(alias, node.tag, implicit, void 0, void 0, node.flow_style));
	          ref = node.value;
	          for (index = i = 0, len = ref.length; i < len; index = ++i) {
	            item = ref[index];
	            this.serialize_node(item, node, index);
	          }
	          this.emit(new events.SequenceEndEvent);
	        } else if (node instanceof nodes.MappingNode) {
	          implicit = node.tag === this.resolve(nodes.MappingNode, node.value, true);
	          this.emit(new events.MappingStartEvent(alias, node.tag, implicit, void 0, void 0, node.flow_style));
	          ref1 = node.value;
	          for (j = 0, len1 = ref1.length; j < len1; j++) {
	            ref2 = ref1[j], key = ref2[0], value = ref2[1];
	            this.serialize_node(key, node, null);
	            this.serialize_node(value, node, key);
	          }
	          this.emit(new events.MappingEndEvent);
	        }
	        return this.ascend_resolver();
	      }
	    };

	    return Serializer;

	  })();

	}).call(this);


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var YAMLError, nodes,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  nodes = __webpack_require__(79);

	  YAMLError = __webpack_require__(78).YAMLError;

	  this.RepresenterError = (function(superClass) {
	    extend(RepresenterError, superClass);

	    function RepresenterError() {
	      return RepresenterError.__super__.constructor.apply(this, arguments);
	    }

	    return RepresenterError;

	  })(YAMLError);

	  this.BaseRepresenter = (function() {
	    BaseRepresenter.prototype.yaml_representers_types = [];

	    BaseRepresenter.prototype.yaml_representers_handlers = [];

	    BaseRepresenter.prototype.yaml_multi_representers_types = [];

	    BaseRepresenter.prototype.yaml_multi_representers_handlers = [];

	    BaseRepresenter.add_representer = function(data_type, handler) {
	      if (!this.prototype.hasOwnProperty('yaml_representers_types')) {
	        this.prototype.yaml_representers_types = [].concat(this.prototype.yaml_representers_types);
	      }
	      if (!this.prototype.hasOwnProperty('yaml_representers_handlers')) {
	        this.prototype.yaml_representers_handlers = [].concat(this.prototype.yaml_representers_handlers);
	      }
	      this.prototype.yaml_representers_types.push(data_type);
	      return this.prototype.yaml_representers_handlers.push(handler);
	    };

	    BaseRepresenter.add_multi_representer = function(data_type, handler) {
	      if (!this.prototype.hasOwnProperty('yaml_multi_representers_types')) {
	        this.prototype.yaml_multi_representers_types = [].concat(this.prototype.yaml_multi_representers_types);
	      }
	      if (!this.prototype.hasOwnProperty('yaml_multi_representers_handlers')) {
	        this.prototype.yaml_multi_representers_handlers = [].concat(this.prototype.yaml_multi_representers_handlers);
	      }
	      this.prototype.yaml_multi_representers_types.push(data_type);
	      return this.prototype.yaml_multi_representers_handlers.push(handler);
	    };

	    function BaseRepresenter(arg) {
	      var ref;
	      ref = arg != null ? arg : {}, this.default_style = ref.default_style, this.default_flow_style = ref.default_flow_style;
	      this.represented_objects = {};
	      this.object_keeper = [];
	      this.alias_key = null;
	    }

	    BaseRepresenter.prototype.represent = function(data) {
	      var node;
	      node = this.represent_data(data);
	      this.serialize(node);
	      this.represented_objects = {};
	      this.object_keeper = [];
	      return this.alias_key = null;
	    };

	    BaseRepresenter.prototype.represent_data = function(data) {
	      var data_type, i, j, len, ref, representer, type;
	      if (this.ignore_aliases(data)) {
	        this.alias_key = null;
	      } else if ((i = this.object_keeper.indexOf(data)) !== -1) {
	        this.alias_key = i;
	        if (this.alias_key in this.represented_objects) {
	          return this.represented_objects[this.alias_key];
	        }
	      } else {
	        this.alias_key = this.object_keeper.length;
	        this.object_keeper.push(data);
	      }
	      representer = null;
	      data_type = data === null ? 'null' : typeof data;
	      if (data_type === 'object') {
	        data_type = data.constructor;
	      }
	      if ((i = this.yaml_representers_types.lastIndexOf(data_type)) !== -1) {
	        representer = this.yaml_representers_handlers[i];
	      }
	      if (representer == null) {
	        ref = this.yaml_multi_representers_types;
	        for (i = j = 0, len = ref.length; j < len; i = ++j) {
	          type = ref[i];
	          if (!(data instanceof type)) {
	            continue;
	          }
	          representer = this.yaml_multi_representers_handlers[i];
	          break;
	        }
	      }
	      if (representer == null) {
	        if ((i = this.yaml_multi_representers_types.lastIndexOf(void 0)) !== -1) {
	          representer = this.yaml_multi_representers_handlers[i];
	        } else if ((i = this.yaml_representers_types.lastIndexOf(void 0)) !== -1) {
	          representer = this.yaml_representers_handlers[i];
	        }
	      }
	      if (representer != null) {
	        return representer.call(this, data);
	      } else {
	        return new nodes.ScalarNode(null, "" + data);
	      }
	    };

	    BaseRepresenter.prototype.represent_scalar = function(tag, value, style) {
	      var node;
	      if (style == null) {
	        style = this.default_style;
	      }
	      node = new nodes.ScalarNode(tag, value, null, null, style);
	      if (this.alias_key != null) {
	        this.represented_objects[this.alias_key] = node;
	      }
	      return node;
	    };

	    BaseRepresenter.prototype.represent_sequence = function(tag, sequence, flow_style) {
	      var best_style, item, j, len, node, node_item, ref, value;
	      value = [];
	      node = new nodes.SequenceNode(tag, value, null, null, flow_style);
	      if (this.alias_key != null) {
	        this.represented_objects[this.alias_key] = node;
	      }
	      best_style = true;
	      for (j = 0, len = sequence.length; j < len; j++) {
	        item = sequence[j];
	        node_item = this.represent_data(item);
	        if (!(node_item instanceof nodes.ScalarNode || node_item.style)) {
	          best_style = false;
	        }
	        value.push(node_item);
	      }
	      if (flow_style == null) {
	        node.flow_style = (ref = this.default_flow_style) != null ? ref : best_style;
	      }
	      return node;
	    };

	    BaseRepresenter.prototype.represent_mapping = function(tag, mapping, flow_style) {
	      var best_style, item_key, item_value, node, node_key, node_value, ref, value;
	      value = [];
	      node = new nodes.MappingNode(tag, value, flow_style);
	      if (this.alias_key) {
	        this.represented_objects[this.alias_key] = node;
	      }
	      best_style = true;
	      for (item_key in mapping) {
	        if (!hasProp.call(mapping, item_key)) continue;
	        item_value = mapping[item_key];
	        node_key = this.represent_data(item_key);
	        node_value = this.represent_data(item_value);
	        if (!(node_key instanceof nodes.ScalarNode || node_key.style)) {
	          best_style = false;
	        }
	        if (!(node_value instanceof nodes.ScalarNode || node_value.style)) {
	          best_style = false;
	        }
	        value.push([node_key, node_value]);
	      }
	      if (!flow_style) {
	        node.flow_style = (ref = this.default_flow_style) != null ? ref : best_style;
	      }
	      return node;
	    };

	    BaseRepresenter.prototype.ignore_aliases = function(data) {
	      return false;
	    };

	    return BaseRepresenter;

	  })();

	  this.Representer = (function(superClass) {
	    extend(Representer, superClass);

	    function Representer() {
	      return Representer.__super__.constructor.apply(this, arguments);
	    }

	    Representer.prototype.represent_boolean = function(data) {
	      return this.represent_scalar('tag:yaml.org,2002:bool', (data ? 'true' : 'false'));
	    };

	    Representer.prototype.represent_null = function(data) {
	      return this.represent_scalar('tag:yaml.org,2002:null', 'null');
	    };

	    Representer.prototype.represent_number = function(data) {
	      var tag, value;
	      tag = "tag:yaml.org,2002:" + (data % 1 === 0 ? 'int' : 'float');
	      value = data !== data ? '.nan' : data === 2e308 ? '.inf' : data === -2e308 ? '-.inf' : data.toString();
	      return this.represent_scalar(tag, value);
	    };

	    Representer.prototype.represent_string = function(data) {
	      return this.represent_scalar('tag:yaml.org,2002:str', data);
	    };

	    Representer.prototype.represent_array = function(data) {
	      return this.represent_sequence('tag:yaml.org,2002:seq', data);
	    };

	    Representer.prototype.represent_date = function(data) {
	      return this.represent_scalar('tag:yaml.org,2002:timestamp', data.toISOString());
	    };

	    Representer.prototype.represent_object = function(data) {
	      return this.represent_mapping('tag:yaml.org,2002:map', data);
	    };

	    Representer.prototype.represent_undefined = function(data) {
	      throw new exports.RepresenterError("cannot represent an onbject: " + data);
	    };

	    Representer.prototype.ignore_aliases = function(data) {
	      var ref;
	      if (data == null) {
	        return true;
	      }
	      if ((ref = typeof data) === 'boolean' || ref === 'number' || ref === 'string') {
	        return true;
	      }
	      return false;
	    };

	    return Representer;

	  })(this.BaseRepresenter);

	  this.Representer.add_representer('boolean', this.Representer.prototype.represent_boolean);

	  this.Representer.add_representer('null', this.Representer.prototype.represent_null);

	  this.Representer.add_representer('number', this.Representer.prototype.represent_number);

	  this.Representer.add_representer('string', this.Representer.prototype.represent_string);

	  this.Representer.add_representer(Array, this.Representer.prototype.represent_array);

	  this.Representer.add_representer(Date, this.Representer.prototype.represent_date);

	  this.Representer.add_representer(Object, this.Representer.prototype.represent_object);

	  this.Representer.add_representer(null, this.Representer.prototype.represent_undefined);

	}).call(this);


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var YAMLError, nodes, util,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  nodes = __webpack_require__(79);

	  util = __webpack_require__(85);

	  YAMLError = __webpack_require__(78).YAMLError;

	  this.ResolverError = (function(superClass) {
	    extend(ResolverError, superClass);

	    function ResolverError() {
	      return ResolverError.__super__.constructor.apply(this, arguments);
	    }

	    return ResolverError;

	  })(YAMLError);

	  this.BaseResolver = (function() {
	    var DEFAULT_MAPPING_TAG, DEFAULT_SCALAR_TAG, DEFAULT_SEQUENCE_TAG;

	    DEFAULT_SCALAR_TAG = 'tag:yaml.org,2002:str';

	    DEFAULT_SEQUENCE_TAG = 'tag:yaml.org,2002:seq';

	    DEFAULT_MAPPING_TAG = 'tag:yaml.org,2002:map';

	    BaseResolver.prototype.yaml_implicit_resolvers = {};

	    BaseResolver.prototype.yaml_path_resolvers = {};

	    BaseResolver.add_implicit_resolver = function(tag, regexp, first) {
	      var base, char, i, len, results;
	      if (first == null) {
	        first = [null];
	      }
	      if (!this.prototype.hasOwnProperty('yaml_implicit_resolvers')) {
	        this.prototype.yaml_implicit_resolvers = util.extend({}, this.prototype.yaml_implicit_resolvers);
	      }
	      results = [];
	      for (i = 0, len = first.length; i < len; i++) {
	        char = first[i];
	        results.push(((base = this.prototype.yaml_implicit_resolvers)[char] != null ? base[char] : base[char] = []).push([tag, regexp]));
	      }
	      return results;
	    };

	    function BaseResolver() {
	      this.resolver_exact_paths = [];
	      this.resolver_prefix_paths = [];
	    }

	    BaseResolver.prototype.descend_resolver = function(current_node, current_index) {
	      var depth, exact_paths, i, j, kind, len, len1, path, prefix_paths, ref, ref1, ref2, ref3;
	      if (util.is_empty(this.yaml_path_resolvers)) {
	        return;
	      }
	      exact_paths = {};
	      prefix_paths = [];
	      if (current_node) {
	        depth = this.resolver_prefix_paths.length;
	        ref = this.resolver_prefix_paths.slice(-1)[0];
	        for (i = 0, len = ref.length; i < len; i++) {
	          ref1 = ref[i], path = ref1[0], kind = ref1[1];
	          if (this.check_resolver_prefix(depth, path, kind, current_node, current_index)) {
	            if (path.length > depth) {
	              prefix_paths.push([path, kind]);
	            } else {
	              exact_paths[kind] = this.yaml_path_resolvers[path][kind];
	            }
	          }
	        }
	      } else {
	        ref2 = this.yaml_path_resolvers;
	        for (j = 0, len1 = ref2.length; j < len1; j++) {
	          ref3 = ref2[j], path = ref3[0], kind = ref3[1];
	          if (!path) {
	            exact_paths[kind] = this.yaml_path_resolvers[path][kind];
	          } else {
	            prefix_paths.push([path, kind]);
	          }
	        }
	      }
	      this.resolver_exact_paths.push(exact_paths);
	      return this.resolver_prefix_paths.push(prefix_paths);
	    };

	    BaseResolver.prototype.ascend_resolver = function() {
	      if (util.is_empty(this.yaml_path_resolvers)) {
	        return;
	      }
	      this.resolver_exact_paths.pop();
	      return this.resolver_prefix_paths.pop();
	    };

	    BaseResolver.prototype.check_resolver_prefix = function(depth, path, kind, current_node, current_index) {
	      var index_check, node_check, ref;
	      ref = path[depth - 1], node_check = ref[0], index_check = ref[1];
	      if (typeof node_check === 'string') {
	        if (current_node.tag !== node_check) {
	          return;
	        }
	      } else if (node_check !== null) {
	        if (!(current_node instanceof node_check)) {
	          return;
	        }
	      }
	      if (index_check === true && current_index !== null) {
	        return;
	      }
	      if ((index_check === false || index_check === null) && current_index === null) {
	        return;
	      }
	      if (typeof index_check === 'string') {
	        if (!(current_index instanceof nodes.ScalarNode) && index_check === current_index.value) {
	          return;
	        }
	      } else if (typeof index_check === 'number') {
	        if (index_check !== current_index) {
	          return;
	        }
	      }
	      return true;
	    };

	    BaseResolver.prototype.resolve = function(kind, value, implicit) {
	      var empty, exact_paths, i, k, len, ref, ref1, ref2, ref3, regexp, resolvers, tag;
	      if (kind === nodes.ScalarNode && implicit[0]) {
	        if (value === '') {
	          resolvers = (ref = this.yaml_implicit_resolvers['']) != null ? ref : [];
	        } else {
	          resolvers = (ref1 = this.yaml_implicit_resolvers[value[0]]) != null ? ref1 : [];
	        }
	        resolvers = resolvers.concat((ref2 = this.yaml_implicit_resolvers[null]) != null ? ref2 : []);
	        for (i = 0, len = resolvers.length; i < len; i++) {
	          ref3 = resolvers[i], tag = ref3[0], regexp = ref3[1];
	          if (value.match(regexp)) {
	            return tag;
	          }
	        }
	        implicit = implicit[1];
	      }
	      empty = true;
	      for (k in this.yaml_path_resolvers) {
	        if ({}[k] == null) {
	          empty = false;
	        }
	      }
	      if (!empty) {
	        exact_paths = this.resolver_exact_paths.slice(-1)[0];
	        if (indexOf.call(exact_paths, kind) >= 0) {
	          return exact_paths[kind];
	        }
	        if (indexOf.call(exact_paths, null) >= 0) {
	          return exact_paths[null];
	        }
	      }
	      if (kind === nodes.ScalarNode) {
	        return DEFAULT_SCALAR_TAG;
	      }
	      if (kind === nodes.SequenceNode) {
	        return DEFAULT_SEQUENCE_TAG;
	      }
	      if (kind === nodes.MappingNode) {
	        return DEFAULT_MAPPING_TAG;
	      }
	    };

	    return BaseResolver;

	  })();

	  this.Resolver = (function(superClass) {
	    extend(Resolver, superClass);

	    function Resolver() {
	      return Resolver.__super__.constructor.apply(this, arguments);
	    }

	    return Resolver;

	  })(this.BaseResolver);

	  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:bool', /^(?:yes|Yes|YES|true|True|TRUE|on|On|ON|no|No|NO|false|False|FALSE|off|Off|OFF)$/, 'yYnNtTfFoO');

	  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:float', /^(?:[-+]?(?:[0-9][0-9_]*)\.[0-9_]*(?:[eE][-+][0-9]+)?|\.[0-9_]+(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*|[-+]?\.(?:inf|Inf|INF)|\.(?:nan|NaN|NAN))$/, '-+0123456789.');

	  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:int', /^(?:[-+]?0b[01_]+|[-+]?0[0-7_]+|[-+]?(?:0|[1-9][0-9_]*)|[-+]?0x[0-9a-fA-F_]+|[-+]?0o[0-7_]+|[-+]?[1-9][0-9_]*(?::[0-5]?[0-9])+)$/, '-+0123456789');

	  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:merge', /^(?:<<)$/, '<');

	  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:null', /^(?:~|null|Null|NULL|)$/, ['~', 'n', 'N', '']);

	  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:timestamp', /^(?:[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]|[0-9][0-9][0-9][0-9]-[0-9][0-9]?-[0-9][0-9]?(?:[Tt]|[\x20\t]+)[0-9][0-9]?:[0-9][0-9]:[0-9][0-9](?:\.[0-9]*)?(?:[\x20\t]*(?:Z|[-+][0-9][0-9]?(?::[0-9][0-9])?))?)$/, '0123456789');

	  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:value', /^(?:=)$/, '=');

	  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:yaml', /^(?:!|&|\*)$/, '!&*');

	}).call(this);


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var composer, constructor, parser, reader, resolver, scanner, util,
	    slice = [].slice;

	  util = __webpack_require__(85);

	  reader = __webpack_require__(96);

	  scanner = __webpack_require__(97);

	  parser = __webpack_require__(99);

	  composer = __webpack_require__(76);

	  resolver = __webpack_require__(94);

	  constructor = __webpack_require__(80);

	  this.make_loader = function(Reader, Scanner, Parser, Composer, Resolver, Constructor) {
	    var Loader, components;
	    if (Reader == null) {
	      Reader = reader.Reader;
	    }
	    if (Scanner == null) {
	      Scanner = scanner.Scanner;
	    }
	    if (Parser == null) {
	      Parser = parser.Parser;
	    }
	    if (Composer == null) {
	      Composer = composer.Composer;
	    }
	    if (Resolver == null) {
	      Resolver = resolver.Resolver;
	    }
	    if (Constructor == null) {
	      Constructor = constructor.Constructor;
	    }
	    components = [Reader, Scanner, Parser, Composer, Resolver, Constructor];
	    return Loader = (function() {
	      var component;

	      util.extend.apply(util, [Loader.prototype].concat(slice.call((function() {
	        var i, len, results;
	        results = [];
	        for (i = 0, len = components.length; i < len; i++) {
	          component = components[i];
	          results.push(component.prototype);
	        }
	        return results;
	      })())));

	      function Loader(stream) {
	        var i, len, ref;
	        components[0].call(this, stream);
	        ref = components.slice(1);
	        for (i = 0, len = ref.length; i < len; i++) {
	          component = ref[i];
	          component.call(this);
	        }
	      }

	      return Loader;

	    })();
	  };

	  this.Loader = this.make_loader();

	}).call(this);


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var Mark, YAMLError, ref,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  ref = __webpack_require__(78), Mark = ref.Mark, YAMLError = ref.YAMLError;

	  this.ReaderError = (function(superClass) {
	    extend(ReaderError, superClass);

	    function ReaderError(position1, character1, reason) {
	      this.position = position1;
	      this.character = character1;
	      this.reason = reason;
	      ReaderError.__super__.constructor.call(this);
	    }

	    ReaderError.prototype.toString = function() {
	      return "unacceptable character #" + (this.character.charCodeAt(0).toString(16)) + ": " + this.reason + "\n  position " + this.position;
	    };

	    return ReaderError;

	  })(YAMLError);


	  /*
	  Reader:
	    checks if characters are within the allowed range
	    add '\x00' to the end
	   */

	  this.Reader = (function() {
	    var NON_PRINTABLE;

	    NON_PRINTABLE = /[^\x09\x0A\x0D\x20-\x7E\x85\xA0-\uFFFD]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;

	    function Reader(string) {
	      this.string = string;
	      this.line = 0;
	      this.column = 0;
	      this.index = 0;
	      this.check_printable();
	      this.string += '\x00';
	    }

	    Reader.prototype.peek = function(index) {
	      if (index == null) {
	        index = 0;
	      }
	      return this.string[this.index + index];
	    };

	    Reader.prototype.prefix = function(length) {
	      if (length == null) {
	        length = 1;
	      }
	      return this.string.slice(this.index, this.index + length);
	    };

	    Reader.prototype.forward = function(length) {
	      var char, results;
	      if (length == null) {
	        length = 1;
	      }
	      results = [];
	      while (length) {
	        char = this.string[this.index];
	        this.index++;
	        if (indexOf.call('\n\x85\u2082\u2029', char) >= 0 || (char === '\r' && this.string[this.index] !== '\n')) {
	          this.line++;
	          this.column = 0;
	        } else {
	          this.column++;
	        }
	        results.push(length--);
	      }
	      return results;
	    };

	    Reader.prototype.get_mark = function() {
	      return new Mark(this.line, this.column, this.string, this.index);
	    };

	    Reader.prototype.check_printable = function() {
	      var character, match, position;
	      match = NON_PRINTABLE.exec(this.string);
	      if (match) {
	        character = match[0];
	        position = (this.string.length - this.index) + match.index;
	        throw new exports.ReaderError(position, character, 'special characters are not allowed');
	      }
	    };

	    return Reader;

	  })();

	}).call(this);


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var MarkedYAMLError, SimpleKey, tokens, util,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty,
	    slice = [].slice,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  MarkedYAMLError = __webpack_require__(78).MarkedYAMLError;

	  tokens = __webpack_require__(98);

	  util = __webpack_require__(85);


	  /*
	  The Scanner throws these.
	   */

	  this.ScannerError = (function(superClass) {
	    extend(ScannerError, superClass);

	    function ScannerError() {
	      return ScannerError.__super__.constructor.apply(this, arguments);
	    }

	    return ScannerError;

	  })(MarkedYAMLError);


	  /*
	  Represents a possible simple key.
	   */

	  SimpleKey = (function() {
	    function SimpleKey(token_number1, required1, index, line, column1, mark1) {
	      this.token_number = token_number1;
	      this.required = required1;
	      this.index = index;
	      this.line = line;
	      this.column = column1;
	      this.mark = mark1;
	    }

	    return SimpleKey;

	  })();


	  /*
	  The Scanner class deals with converting a YAML stream into a token stream.
	   */

	  this.Scanner = (function() {
	    var C_LB, C_NUMBERS, C_WS, ESCAPE_CODES, ESCAPE_REPLACEMENTS;

	    C_LB = '\r\n\x85\u2028\u2029';

	    C_WS = '\t ';

	    C_NUMBERS = '0123456789';

	    ESCAPE_REPLACEMENTS = {
	      '0': '\x00',
	      'a': '\x07',
	      'b': '\x08',
	      't': '\x09',
	      '\t': '\x09',
	      'n': '\x0A',
	      'v': '\x0B',
	      'f': '\x0C',
	      'r': '\x0D',
	      'e': '\x1B',
	      ' ': '\x20',
	      '"': '"',
	      '\\': '\\',
	      'N': '\x85',
	      '_': '\xA0',
	      'L': '\u2028',
	      'P': '\u2029'
	    };

	    ESCAPE_CODES = {
	      'x': 2,
	      'u': 4,
	      'U': 8
	    };


	    /*
	    Initialise the Scanner
	     */

	    function Scanner() {
	      this.done = false;
	      this.flow_level = 0;
	      this.tokens = [];
	      this.fetch_stream_start();
	      this.tokens_taken = 0;
	      this.indent = -1;
	      this.indents = [];
	      this.allow_simple_key = true;
	      this.possible_simple_keys = {};
	    }


	    /*
	    Check if the next token is one of the given types.
	     */

	    Scanner.prototype.check_token = function() {
	      var choice, choices, i, len;
	      choices = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	      while (this.need_more_tokens()) {
	        this.fetch_more_tokens();
	      }
	      if (this.tokens.length !== 0) {
	        if (choices.length === 0) {
	          return true;
	        }
	        for (i = 0, len = choices.length; i < len; i++) {
	          choice = choices[i];
	          if (this.tokens[0] instanceof choice) {
	            return true;
	          }
	        }
	      }
	      return false;
	    };


	    /*
	    Return the next token, but do not delete it from the queue.
	     */

	    Scanner.prototype.peek_token = function() {
	      while (this.need_more_tokens()) {
	        this.fetch_more_tokens();
	      }
	      if (this.tokens.length !== 0) {
	        return this.tokens[0];
	      }
	    };


	    /*
	    Return the next token, and remove it from the queue.
	     */

	    Scanner.prototype.get_token = function() {
	      while (this.need_more_tokens()) {
	        this.fetch_more_tokens();
	      }
	      if (this.tokens.length !== 0) {
	        this.tokens_taken++;
	        return this.tokens.shift();
	      }
	    };

	    Scanner.prototype.need_more_tokens = function() {
	      if (this.done) {
	        return false;
	      }
	      if (this.tokens.length === 0) {
	        return true;
	      }
	      this.stale_possible_simple_keys();
	      if (this.next_possible_simple_key() === this.tokens_taken) {
	        return true;
	      }
	      return false;
	    };

	    Scanner.prototype.fetch_more_tokens = function() {
	      var char;
	      this.scan_to_next_token();
	      this.stale_possible_simple_keys();
	      this.unwind_indent(this.column);
	      char = this.peek();
	      if (char === '\x00') {
	        return this.fetch_stream_end();
	      }
	      if (char === '%' && this.check_directive()) {
	        return this.fetch_directive();
	      }
	      if (char === '-' && this.check_document_start()) {
	        return this.fetch_document_start();
	      }
	      if (char === '.' && this.check_document_end()) {
	        return this.fetch_document_end();
	      }
	      if (char === '[') {
	        return this.fetch_flow_sequence_start();
	      }
	      if (char === '{') {
	        return this.fetch_flow_mapping_start();
	      }
	      if (char === ']') {
	        return this.fetch_flow_sequence_end();
	      }
	      if (char === '}') {
	        return this.fetch_flow_mapping_end();
	      }
	      if (char === ',') {
	        return this.fetch_flow_entry();
	      }
	      if (char === '-' && this.check_block_entry()) {
	        return this.fetch_block_entry();
	      }
	      if (char === '?' && this.check_key()) {
	        return this.fetch_key();
	      }
	      if (char === ':' && this.check_value()) {
	        return this.fetch_value();
	      }
	      if (char === '*') {
	        return this.fetch_alias();
	      }
	      if (char === '&') {
	        return this.fetch_anchor();
	      }
	      if (char === '!') {
	        return this.fetch_tag();
	      }
	      if (char === '|' && this.flow_level === 0) {
	        return this.fetch_literal();
	      }
	      if (char === '>' && this.flow_level === 0) {
	        return this.fetch_folded();
	      }
	      if (char === '\'') {
	        return this.fetch_single();
	      }
	      if (char === '"') {
	        return this.fetch_double();
	      }
	      if (this.check_plain()) {
	        return this.fetch_plain();
	      }
	      throw new exports.ScannerError('while scanning for the next token', null, "found character " + char + " that cannot start any token", this.get_mark());
	    };


	    /*
	    Return the number of the nearest possible simple key.
	     */

	    Scanner.prototype.next_possible_simple_key = function() {
	      var key, level, min_token_number, ref;
	      min_token_number = null;
	      ref = this.possible_simple_keys;
	      for (level in ref) {
	        if (!hasProp.call(ref, level)) continue;
	        key = ref[level];
	        if (min_token_number === null || key.token_number < min_token_number) {
	          min_token_number = key.token_number;
	        }
	      }
	      return min_token_number;
	    };


	    /*
	    Remove entries that are no longer possible simple keys.  According to the
	    YAML spec, simple keys:
	      should be limited to a single line
	      should be no longer than 1024 characters
	    Disabling this procedure will allow simple keys of any length and height
	    (may cause problems if indentation is broken though).
	     */

	    Scanner.prototype.stale_possible_simple_keys = function() {
	      var key, level, ref, results;
	      ref = this.possible_simple_keys;
	      results = [];
	      for (level in ref) {
	        if (!hasProp.call(ref, level)) continue;
	        key = ref[level];
	        if (key.line === this.line && this.index - key.index <= 1024) {
	          continue;
	        }
	        if (!key.required) {
	          results.push(delete this.possible_simple_keys[level]);
	        } else {
	          throw new exports.ScannerError('while scanning a simple key', key.mark, 'could not find expected \':\'', this.get_mark());
	        }
	      }
	      return results;
	    };


	    /*
	    The next token may start a simple key.  We check if it's possible and save
	    its position.  This function is called for ALIAS, ANCHOR, TAG,
	    SCALAR (flow),'[' and '{'.
	     */

	    Scanner.prototype.save_possible_simple_key = function() {
	      var required, token_number;
	      required = this.flow_level === 0 && this.indent === this.column;
	      if (required && !this.allow_simple_key) {
	        throw new Error('logic failure');
	      }
	      if (!this.allow_simple_key) {
	        return;
	      }
	      this.remove_possible_simple_key();
	      token_number = this.tokens_taken + this.tokens.length;
	      return this.possible_simple_keys[this.flow_level] = new SimpleKey(token_number, required, this.index, this.line, this.column, this.get_mark());
	    };


	    /*
	    Remove the saved possible simple key at the current flow level.
	     */

	    Scanner.prototype.remove_possible_simple_key = function() {
	      var key;
	      if (!(key = this.possible_simple_keys[this.flow_level])) {
	        return;
	      }
	      if (!key.required) {
	        return delete this.possible_simple_keys[this.flow_level];
	      } else {
	        throw new exports.ScannerError('while scanning a simple key', key.mark, 'could not find expected \':\'', this.get_mark());
	      }
	    };


	    /*
	    In flow context, tokens should respect indentation.
	    Actually the condition should be `self.indent >= column` according to
	    the spec. But this condition will prohibit intuitively correct
	    constructions such as
	      key : {
	      }
	     */

	    Scanner.prototype.unwind_indent = function(column) {
	      var mark, results;
	      if (this.flow_level !== 0) {
	        return;
	      }
	      results = [];
	      while (this.indent > column) {
	        mark = this.get_mark();
	        this.indent = this.indents.pop();
	        results.push(this.tokens.push(new tokens.BlockEndToken(mark, mark)));
	      }
	      return results;
	    };


	    /*
	    Check if we need to increase indentation.
	     */

	    Scanner.prototype.add_indent = function(column) {
	      if (!(column > this.indent)) {
	        return false;
	      }
	      this.indents.push(this.indent);
	      this.indent = column;
	      return true;
	    };

	    Scanner.prototype.fetch_stream_start = function() {
	      var mark;
	      mark = this.get_mark();
	      return this.tokens.push(new tokens.StreamStartToken(mark, mark, this.encoding));
	    };

	    Scanner.prototype.fetch_stream_end = function() {
	      var mark;
	      this.unwind_indent(-1);
	      this.remove_possible_simple_key();
	      this.allow_possible_simple_key = false;
	      this.possible_simple_keys = {};
	      mark = this.get_mark();
	      this.tokens.push(new tokens.StreamEndToken(mark, mark));
	      return this.done = true;
	    };

	    Scanner.prototype.fetch_directive = function() {
	      this.unwind_indent(-1);
	      this.remove_possible_simple_key();
	      this.allow_simple_key = false;
	      return this.tokens.push(this.scan_directive());
	    };

	    Scanner.prototype.fetch_document_start = function() {
	      return this.fetch_document_indicator(tokens.DocumentStartToken);
	    };

	    Scanner.prototype.fetch_document_end = function() {
	      return this.fetch_document_indicator(tokens.DocumentEndToken);
	    };

	    Scanner.prototype.fetch_document_indicator = function(TokenClass) {
	      var start_mark;
	      this.unwind_indent(-1);
	      this.remove_possible_simple_key();
	      this.allow_simple_key = false;
	      start_mark = this.get_mark();
	      this.forward(3);
	      return this.tokens.push(new TokenClass(start_mark, this.get_mark()));
	    };

	    Scanner.prototype.fetch_flow_sequence_start = function() {
	      return this.fetch_flow_collection_start(tokens.FlowSequenceStartToken);
	    };

	    Scanner.prototype.fetch_flow_mapping_start = function() {
	      return this.fetch_flow_collection_start(tokens.FlowMappingStartToken);
	    };

	    Scanner.prototype.fetch_flow_collection_start = function(TokenClass) {
	      var start_mark;
	      this.save_possible_simple_key();
	      this.flow_level++;
	      this.allow_simple_key = true;
	      start_mark = this.get_mark();
	      this.forward();
	      return this.tokens.push(new TokenClass(start_mark, this.get_mark()));
	    };

	    Scanner.prototype.fetch_flow_sequence_end = function() {
	      return this.fetch_flow_collection_end(tokens.FlowSequenceEndToken);
	    };

	    Scanner.prototype.fetch_flow_mapping_end = function() {
	      return this.fetch_flow_collection_end(tokens.FlowMappingEndToken);
	    };

	    Scanner.prototype.fetch_flow_collection_end = function(TokenClass) {
	      var start_mark;
	      this.remove_possible_simple_key();
	      this.flow_level--;
	      this.allow_simple_key = false;
	      start_mark = this.get_mark();
	      this.forward();
	      return this.tokens.push(new TokenClass(start_mark, this.get_mark()));
	    };

	    Scanner.prototype.fetch_flow_entry = function() {
	      var start_mark;
	      this.allow_simple_key = true;
	      this.remove_possible_simple_key();
	      start_mark = this.get_mark();
	      this.forward();
	      return this.tokens.push(new tokens.FlowEntryToken(start_mark, this.get_mark()));
	    };

	    Scanner.prototype.fetch_block_entry = function() {
	      var mark, start_mark;
	      if (this.flow_level === 0) {
	        if (!this.allow_simple_key) {
	          throw new exports.ScannerError(null, null, 'sequence entries are not allowed here', this.get_mark());
	        }
	        if (this.add_indent(this.column)) {
	          mark = this.get_mark();
	          this.tokens.push(new tokens.BlockSequenceStartToken(mark, mark));
	        }
	      }
	      this.allow_simple_key = true;
	      this.remove_possible_simple_key();
	      start_mark = this.get_mark();
	      this.forward();
	      return this.tokens.push(new tokens.BlockEntryToken(start_mark, this.get_mark()));
	    };

	    Scanner.prototype.fetch_key = function() {
	      var mark, start_mark;
	      if (this.flow_level === 0) {
	        if (!this.allow_simple_key) {
	          throw new exports.ScannerError(null, null, 'mapping keys are not allowed here', this.get_mark());
	        }
	        if (this.add_indent(this.column)) {
	          mark = this.get_mark();
	          this.tokens.push(new tokens.BlockMappingStartToken(mark, mark));
	        }
	      }
	      this.allow_simple_key = !this.flow_level;
	      this.remove_possible_simple_key();
	      start_mark = this.get_mark();
	      this.forward();
	      return this.tokens.push(new tokens.KeyToken(start_mark, this.get_mark()));
	    };

	    Scanner.prototype.fetch_value = function() {
	      var key, mark, start_mark;
	      if (key = this.possible_simple_keys[this.flow_level]) {
	        delete this.possible_simple_keys[this.flow_level];
	        this.tokens.splice(key.token_number - this.tokens_taken, 0, new tokens.KeyToken(key.mark, key.mark));
	        if (this.flow_level === 0) {
	          if (this.add_indent(key.column)) {
	            this.tokens.splice(key.token_number - this.tokens_taken, 0, new tokens.BlockMappingStartToken(key.mark, key.mark));
	          }
	        }
	        this.allow_simple_key = false;
	      } else {
	        if (this.flow_level === 0) {
	          if (!this.allow_simple_key) {
	            throw new exports.ScannerError(null, null, 'mapping values are not allowed here', this.get_mark());
	          }
	          if (this.add_indent(this.column)) {
	            mark = this.get_mark();
	            this.tokens.push(new tokens.BlockMappingStartToken(mark, mark));
	          }
	        }
	        this.allow_simple_key = !this.flow_level;
	        this.remove_possible_simple_key();
	      }
	      start_mark = this.get_mark();
	      this.forward();
	      return this.tokens.push(new tokens.ValueToken(start_mark, this.get_mark()));
	    };

	    Scanner.prototype.fetch_alias = function() {
	      this.save_possible_simple_key();
	      this.allow_simple_key = false;
	      return this.tokens.push(this.scan_anchor(tokens.AliasToken));
	    };

	    Scanner.prototype.fetch_anchor = function() {
	      this.save_possible_simple_key();
	      this.allow_simple_key = false;
	      return this.tokens.push(this.scan_anchor(tokens.AnchorToken));
	    };

	    Scanner.prototype.fetch_tag = function() {
	      this.save_possible_simple_key();
	      this.allow_simple_key = false;
	      return this.tokens.push(this.scan_tag());
	    };

	    Scanner.prototype.fetch_literal = function() {
	      return this.fetch_block_scalar('|');
	    };

	    Scanner.prototype.fetch_folded = function() {
	      return this.fetch_block_scalar('>');
	    };

	    Scanner.prototype.fetch_block_scalar = function(style) {
	      this.allow_simple_key = true;
	      this.remove_possible_simple_key();
	      return this.tokens.push(this.scan_block_scalar(style));
	    };

	    Scanner.prototype.fetch_single = function() {
	      return this.fetch_flow_scalar('\'');
	    };

	    Scanner.prototype.fetch_double = function() {
	      return this.fetch_flow_scalar('"');
	    };

	    Scanner.prototype.fetch_flow_scalar = function(style) {
	      this.save_possible_simple_key();
	      this.allow_simple_key = false;
	      return this.tokens.push(this.scan_flow_scalar(style));
	    };

	    Scanner.prototype.fetch_plain = function() {
	      this.save_possible_simple_key();
	      this.allow_simple_key = false;
	      return this.tokens.push(this.scan_plain());
	    };


	    /*
	    DIRECTIVE: ^ '%'
	     */

	    Scanner.prototype.check_directive = function() {
	      if (this.column === 0) {
	        return true;
	      }
	      return false;
	    };


	    /*
	    DOCUMENT-START: ^ '---' (' '|'\n')
	     */

	    Scanner.prototype.check_document_start = function() {
	      var ref;
	      if (this.column === 0 && this.prefix(3) === '---' && (ref = this.peek(3), indexOf.call(C_LB + C_WS + '\x00', ref) >= 0)) {
	        return true;
	      }
	      return false;
	    };


	    /*
	    DOCUMENT-END: ^ '...' (' '|'\n')
	     */

	    Scanner.prototype.check_document_end = function() {
	      var ref;
	      if (this.column === 0 && this.prefix(3) === '...' && (ref = this.peek(3), indexOf.call(C_LB + C_WS + '\x00', ref) >= 0)) {
	        return true;
	      }
	      return false;
	    };


	    /*
	    BLOCK-ENTRY: '-' (' '|'\n')
	     */

	    Scanner.prototype.check_block_entry = function() {
	      var ref;
	      return ref = this.peek(1), indexOf.call(C_LB + C_WS + '\x00', ref) >= 0;
	    };


	    /*
	    KEY (flow context):  '?'
	    KEY (block context): '?' (' '|'\n')
	     */

	    Scanner.prototype.check_key = function() {
	      var ref;
	      if (this.flow_level !== 0) {
	        return true;
	      }
	      return ref = this.peek(1), indexOf.call(C_LB + C_WS + '\x00', ref) >= 0;
	    };


	    /*
	    VALUE (flow context):  ':'
	    VALUE (block context): ':' (' '|'\n')
	     */

	    Scanner.prototype.check_value = function() {
	      var ref;
	      if (this.flow_level !== 0) {
	        return true;
	      }
	      return ref = this.peek(1), indexOf.call(C_LB + C_WS + '\x00', ref) >= 0;
	    };


	    /*
	    A plain scalar may start with any non-space character except:
	      '-', '?', ':', ',', '[', ']', '{', '}',
	      '#', '&', '*', '!', '|', '>', '\'', '"',
	      '%', '@', '`'.
	    
	    It may also start with
	      '-', '?', ':'
	    if it is followed by a non-space character.
	    
	    Note that we limit the last rule to the block context (except the '-'
	    character) because we want the flow context to be space independent.
	     */

	    Scanner.prototype.check_plain = function() {
	      var char, ref;
	      char = this.peek();
	      return indexOf.call(C_LB + C_WS + '\x00-?:,[]{}#&*!|>\'"%@`', char) < 0 || ((ref = this.peek(1), indexOf.call(C_LB + C_WS + '\x00', ref) < 0) && (char === '-' || (this.flow_level === 0 && indexOf.call('?:', char) >= 0)));
	    };


	    /*
	    We ignore spaces, line breaks and comments.
	    If we find a line break in the block context, we set the flag
	    `allow_simple_key` on.
	    The byte order mark is stripped if it's the first character in the stream.
	    We do not yet support BOM inside the stream as the specification requires.
	    Any such mark will be considered as a part of the document.
	    
	    TODO: We need to make tab handling rules more sane.  A good rule is
	      Tabs cannot precede tokens BLOCK-SEQUENCE-START, BLOCK-MAPPING-START,
	      BLOCK-END, KEY (block context), VALUE (block context), BLOCK-ENTRY
	    So the tab checking code is
	      @allow_simple_key = off if <TAB>
	    We also need to add the check for `allow_simple_key is on` to
	    `unwind_indent` before issuing BLOCK-END.  Scanners for block, flow and
	    plain scalars need to be modified.
	     */

	    Scanner.prototype.scan_to_next_token = function() {
	      var found, ref, results;
	      if (this.index === 0 && this.peek() === '\uFEFF') {
	        this.forward();
	      }
	      found = false;
	      results = [];
	      while (!found) {
	        while (this.peek() === ' ') {
	          this.forward();
	        }
	        if (this.peek() === '#') {
	          while (ref = this.peek(), indexOf.call(C_LB + '\x00', ref) < 0) {
	            this.forward();
	          }
	        }
	        if (this.scan_line_break()) {
	          if (this.flow_level === 0) {
	            results.push(this.allow_simple_key = true);
	          } else {
	            results.push(void 0);
	          }
	        } else {
	          results.push(found = true);
	        }
	      }
	      return results;
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_directive = function() {
	      var end_mark, name, ref, start_mark, value;
	      start_mark = this.get_mark();
	      this.forward();
	      name = this.scan_directive_name(start_mark);
	      value = null;
	      if (name === 'YAML') {
	        value = this.scan_yaml_directive_value(start_mark);
	        end_mark = this.get_mark();
	      } else if (name === 'TAG') {
	        value = this.scan_tag_directive_value(start_mark);
	        end_mark = this.get_mark();
	      } else {
	        end_mark = this.get_mark();
	        while (ref = this.peek(), indexOf.call(C_LB + '\x00', ref) < 0) {
	          this.forward();
	        }
	      }
	      this.scan_directive_ignored_line(start_mark);
	      return new tokens.DirectiveToken(name, value, start_mark, end_mark);
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_directive_name = function(start_mark) {
	      var char, length, value;
	      length = 0;
	      char = this.peek(length);
	      while (('0' <= char && char <= '9') || ('A' <= char && char <= 'Z') || ('a' <= char && char <= 'z') || indexOf.call('-_', char) >= 0) {
	        length++;
	        char = this.peek(length);
	      }
	      if (length === 0) {
	        throw new exports.ScannerError('while scanning a directive', start_mark, "expected alphanumeric or numeric character but found " + char, this.get_mark());
	      }
	      value = this.prefix(length);
	      this.forward(length);
	      char = this.peek();
	      if (indexOf.call(C_LB + '\x00 ', char) < 0) {
	        throw new exports.ScannerError('while scanning a directive', start_mark, "expected alphanumeric or numeric character but found " + char, this.get_mark());
	      }
	      return value;
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_yaml_directive_value = function(start_mark) {
	      var major, minor, ref;
	      while (this.peek() === ' ') {
	        this.forward();
	      }
	      major = this.scan_yaml_directive_number(start_mark);
	      if (this.peek() !== '.') {
	        throw new exports.ScannerError('while scanning a directive', start_mark, "expected a digit or '.' but found " + (this.peek()), this.get_mark());
	      }
	      this.forward();
	      minor = this.scan_yaml_directive_number(start_mark);
	      if (ref = this.peek(), indexOf.call(C_LB + '\x00 ', ref) < 0) {
	        throw new exports.ScannerError('while scanning a directive', start_mark, "expected a digit or ' ' but found " + (this.peek()), this.get_mark());
	      }
	      return [major, minor];
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_yaml_directive_number = function(start_mark) {
	      var char, length, ref, value;
	      char = this.peek();
	      if (!(('0' <= char && char <= '9'))) {
	        throw new exports.ScannerError('while scanning a directive', start_mark, "expected a digit but found " + char, this.get_mark());
	      }
	      length = 0;
	      while (('0' <= (ref = this.peek(length)) && ref <= '9')) {
	        length++;
	      }
	      value = parseInt(this.prefix(length));
	      this.forward(length);
	      return value;
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_tag_directive_value = function(start_mark) {
	      var handle, prefix;
	      while (this.peek() === ' ') {
	        this.forward();
	      }
	      handle = this.scan_tag_directive_handle(start_mark);
	      while (this.peek() === ' ') {
	        this.forward();
	      }
	      prefix = this.scan_tag_directive_prefix(start_mark);
	      return [handle, prefix];
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_tag_directive_handle = function(start_mark) {
	      var char, value;
	      value = this.scan_tag_handle('directive', start_mark);
	      char = this.peek();
	      if (char !== ' ') {
	        throw new exports.ScannerError('while scanning a directive', start_mark, "expected ' ' but found " + char, this.get_mark());
	      }
	      return value;
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_tag_directive_prefix = function(start_mark) {
	      var char, value;
	      value = this.scan_tag_uri('directive', start_mark);
	      char = this.peek();
	      if (indexOf.call(C_LB + '\x00 ', char) < 0) {
	        throw new exports.ScannerError('while scanning a directive', start_mark, "expected ' ' but found " + char, this.get_mark());
	      }
	      return value;
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_directive_ignored_line = function(start_mark) {
	      var char, ref;
	      while (this.peek() === ' ') {
	        this.forward();
	      }
	      if (this.peek() === '#') {
	        while (ref = this.peek(), indexOf.call(C_LB + '\x00', ref) < 0) {
	          this.forward();
	        }
	      }
	      char = this.peek();
	      if (indexOf.call(C_LB + '\x00', char) < 0) {
	        throw new exports.ScannerError('while scanning a directive', start_mark, "expected a comment or a line break but found " + char, this.get_mark());
	      }
	      return this.scan_line_break();
	    };


	    /*
	    The specification does not restrict characters for anchors and aliases.
	    This may lead to problems, for instance, the document:
	      [ *alias, value ]
	    can be interpteted in two ways, as
	      [ "value" ]
	    and
	      [ *alias , "value" ]
	    Therefore we restrict aliases to numbers and ASCII letters.
	     */

	    Scanner.prototype.scan_anchor = function(TokenClass) {
	      var char, indicator, length, name, start_mark, value;
	      start_mark = this.get_mark();
	      indicator = this.peek();
	      if (indicator === '*') {
	        name = 'alias';
	      } else {
	        name = 'anchor';
	      }
	      this.forward();
	      length = 0;
	      char = this.peek(length);
	      while (('0' <= char && char <= '9') || ('A' <= char && char <= 'Z') || ('a' <= char && char <= 'z') || indexOf.call('-_', char) >= 0) {
	        length++;
	        char = this.peek(length);
	      }
	      if (length === 0) {
	        throw new exports.ScannerError("while scanning an " + name, start_mark, "expected alphabetic or numeric character but found '" + char + "'", this.get_mark());
	      }
	      value = this.prefix(length);
	      this.forward(length);
	      char = this.peek();
	      if (indexOf.call(C_LB + C_WS + '\x00' + '?:,]}%@`', char) < 0) {
	        throw new exports.ScannerError("while scanning an " + name, start_mark, "expected alphabetic or numeric character but found '" + char + "'", this.get_mark());
	      }
	      return new TokenClass(value, start_mark, this.get_mark());
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_tag = function() {
	      var char, handle, length, start_mark, suffix, use_handle;
	      start_mark = this.get_mark();
	      char = this.peek(1);
	      if (char === '<') {
	        handle = null;
	        this.forward(2);
	        suffix = this.scan_tag_uri('tag', start_mark);
	        if (this.peek() !== '>') {
	          throw new exports.ScannerError('while parsing a tag', start_mark, "expected '>' but found " + (this.peek()), this.get_mark());
	        }
	        this.forward();
	      } else if (indexOf.call(C_LB + C_WS + '\x00', char) >= 0) {
	        handle = null;
	        suffix = '!';
	        this.forward();
	      } else {
	        length = 1;
	        use_handle = false;
	        while (indexOf.call(C_LB + '\x00 ', char) < 0) {
	          if (char === '!') {
	            use_handle = true;
	            break;
	          }
	          length++;
	          char = this.peek(length);
	        }
	        if (use_handle) {
	          handle = this.scan_tag_handle('tag', start_mark);
	        } else {
	          handle = '!';
	          this.forward();
	        }
	        suffix = this.scan_tag_uri('tag', start_mark);
	      }
	      char = this.peek();
	      if (indexOf.call(C_LB + '\x00 ', char) < 0) {
	        throw new exports.ScannerError('while scanning a tag', start_mark, "expected ' ' but found " + char, this.get_mark());
	      }
	      return new tokens.TagToken([handle, suffix], start_mark, this.get_mark());
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_block_scalar = function(style) {
	      var breaks, chomping, chunks, end_mark, folded, increment, indent, leading_non_space, length, line_break, max_indent, min_indent, ref, ref1, ref2, ref3, ref4, ref5, ref6, start_mark;
	      folded = style === '>';
	      chunks = [];
	      start_mark = this.get_mark();
	      this.forward();
	      ref = this.scan_block_scalar_indicators(start_mark), chomping = ref[0], increment = ref[1];
	      this.scan_block_scalar_ignored_line(start_mark);
	      min_indent = this.indent + 1;
	      if (min_indent < 1) {
	        min_indent = 1;
	      }
	      if (increment == null) {
	        ref1 = this.scan_block_scalar_indentation(), breaks = ref1[0], max_indent = ref1[1], end_mark = ref1[2];
	        indent = Math.max(min_indent, max_indent);
	      } else {
	        indent = min_indent + increment - 1;
	        ref2 = this.scan_block_scalar_breaks(indent), breaks = ref2[0], end_mark = ref2[1];
	      }
	      line_break = '';
	      while (this.column === indent && this.peek() !== '\x00') {
	        chunks = chunks.concat(breaks);
	        leading_non_space = (ref3 = this.peek(), indexOf.call(' \t', ref3) < 0);
	        length = 0;
	        while (ref4 = this.peek(length), indexOf.call(C_LB + '\x00', ref4) < 0) {
	          length++;
	        }
	        chunks.push(this.prefix(length));
	        this.forward(length);
	        line_break = this.scan_line_break();
	        ref5 = this.scan_block_scalar_breaks(indent), breaks = ref5[0], end_mark = ref5[1];
	        if (this.column === indent && this.peek() !== '\x00') {
	          if (folded && line_break === '\n' && leading_non_space && (ref6 = this.peek(), indexOf.call(' \t', ref6) < 0)) {
	            if (util.is_empty(breaks)) {
	              chunks.push(' ');
	            }
	          } else {
	            chunks.push(line_break);
	          }
	        } else {
	          break;
	        }
	      }
	      if (chomping !== false) {
	        chunks.push(line_break);
	      }
	      if (chomping === true) {
	        chunks = chunks.concat(breaks);
	      }
	      return new tokens.ScalarToken(chunks.join(''), false, start_mark, end_mark, style);
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_block_scalar_indicators = function(start_mark) {
	      var char, chomping, increment;
	      chomping = null;
	      increment = null;
	      char = this.peek();
	      if (indexOf.call('+-', char) >= 0) {
	        chomping = char === '+';
	        this.forward();
	        char = this.peek();
	        if (indexOf.call(C_NUMBERS, char) >= 0) {
	          increment = parseInt(char);
	          if (increment === 0) {
	            throw new exports.ScannerError('while scanning a block scalar', start_mark, 'expected indentation indicator in the range 1-9 but found 0', this.get_mark());
	          }
	          this.forward();
	        }
	      } else if (indexOf.call(C_NUMBERS, char) >= 0) {
	        increment = parseInt(char);
	        if (increment === 0) {
	          throw new exports.ScannerError('while scanning a block scalar', start_mark, 'expected indentation indicator in the range 1-9 but found 0', this.get_mark());
	        }
	        this.forward();
	        char = this.peek();
	        if (indexOf.call('+-', char) >= 0) {
	          chomping = char === '+';
	          this.forward();
	        }
	      }
	      char = this.peek();
	      if (indexOf.call(C_LB + '\x00 ', char) < 0) {
	        throw new exports.ScannerError('while scanning a block scalar', start_mark, "expected chomping or indentation indicators, but found " + char, this.get_mark());
	      }
	      return [chomping, increment];
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_block_scalar_ignored_line = function(start_mark) {
	      var char, ref;
	      while (this.peek() === ' ') {
	        this.forward();
	      }
	      if (this.peek() === '#') {
	        while (ref = this.peek(), indexOf.call(C_LB + '\x00', ref) < 0) {
	          this.forward();
	        }
	      }
	      char = this.peek();
	      if (indexOf.call(C_LB + '\x00', char) < 0) {
	        throw new exports.ScannerError('while scanning a block scalar', start_mark, "expected a comment or a line break but found " + char, this.get_mark());
	      }
	      return this.scan_line_break();
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_block_scalar_indentation = function() {
	      var chunks, end_mark, max_indent, ref;
	      chunks = [];
	      max_indent = 0;
	      end_mark = this.get_mark();
	      while (ref = this.peek(), indexOf.call(C_LB + ' ', ref) >= 0) {
	        if (this.peek() !== ' ') {
	          chunks.push(this.scan_line_break());
	          end_mark = this.get_mark();
	        } else {
	          this.forward();
	          if (this.column > max_indent) {
	            max_indent = this.column;
	          }
	        }
	      }
	      return [chunks, max_indent, end_mark];
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_block_scalar_breaks = function(indent) {
	      var chunks, end_mark, ref;
	      chunks = [];
	      end_mark = this.get_mark();
	      while (this.column < indent && this.peek() === ' ') {
	        this.forward();
	      }
	      while (ref = this.peek(), indexOf.call(C_LB, ref) >= 0) {
	        chunks.push(this.scan_line_break());
	        end_mark = this.get_mark();
	        while (this.column < indent && this.peek() === ' ') {
	          this.forward();
	        }
	      }
	      return [chunks, end_mark];
	    };


	    /*
	    See the specification for details.
	    Note that we loose indentation rules for quoted scalars. Quoted scalars
	    don't need to adhere indentation because " and ' clearly mark the beginning
	    and the end of them. Therefore we are less restrictive than the
	    specification requires. We only need to check that document separators are
	    not included in scalars.
	     */

	    Scanner.prototype.scan_flow_scalar = function(style) {
	      var chunks, double, quote, start_mark;
	      double = style === '"';
	      chunks = [];
	      start_mark = this.get_mark();
	      quote = this.peek();
	      this.forward();
	      chunks = chunks.concat(this.scan_flow_scalar_non_spaces(double, start_mark));
	      while (this.peek() !== quote) {
	        chunks = chunks.concat(this.scan_flow_scalar_spaces(double, start_mark));
	        chunks = chunks.concat(this.scan_flow_scalar_non_spaces(double, start_mark));
	      }
	      this.forward();
	      return new tokens.ScalarToken(chunks.join(''), false, start_mark, this.get_mark(), style);
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_flow_scalar_non_spaces = function(double, start_mark) {
	      var char, chunks, code, i, k, length, ref, ref1, ref2;
	      chunks = [];
	      while (true) {
	        length = 0;
	        while (ref = this.peek(length), indexOf.call(C_LB + C_WS + '\'"\\\x00', ref) < 0) {
	          length++;
	        }
	        if (length !== 0) {
	          chunks.push(this.prefix(length));
	          this.forward(length);
	        }
	        char = this.peek();
	        if (!double && char === '\'' && this.peek(1) === '\'') {
	          chunks.push('\'');
	          this.forward(2);
	        } else if ((double && char === '\'') || (!double && indexOf.call('"\\', char) >= 0)) {
	          chunks.push(char);
	          this.forward();
	        } else if (double && char === '\\') {
	          this.forward();
	          char = this.peek();
	          if (char in ESCAPE_REPLACEMENTS) {
	            chunks.push(ESCAPE_REPLACEMENTS[char]);
	            this.forward();
	          } else if (char in ESCAPE_CODES) {
	            length = ESCAPE_CODES[char];
	            this.forward();
	            for (k = i = 0, ref1 = length; 0 <= ref1 ? i < ref1 : i > ref1; k = 0 <= ref1 ? ++i : --i) {
	              if (ref2 = this.peek(k), indexOf.call(C_NUMBERS + "ABCDEFabcdef", ref2) < 0) {
	                throw new exports.ScannerError('while scanning a double-quoted scalar', start_mark, "expected escape sequence of " + length + " hexadecimal numbers, but found " + (this.peek(k)), this.get_mark());
	              }
	            }
	            code = parseInt(this.prefix(length), 16);
	            chunks.push(String.fromCharCode(code));
	            this.forward(length);
	          } else if (indexOf.call(C_LB, char) >= 0) {
	            this.scan_line_break();
	            chunks = chunks.concat(this.scan_flow_scalar_breaks(double, start_mark));
	          } else {
	            throw new exports.ScannerError('while scanning a double-quoted scalar', start_mark, "found unknown escape character " + char, this.get_mark());
	          }
	        } else {
	          return chunks;
	        }
	      }
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_flow_scalar_spaces = function(double, start_mark) {
	      var breaks, char, chunks, length, line_break, ref, whitespaces;
	      chunks = [];
	      length = 0;
	      while (ref = this.peek(length), indexOf.call(C_WS, ref) >= 0) {
	        length++;
	      }
	      whitespaces = this.prefix(length);
	      this.forward(length);
	      char = this.peek();
	      if (char === '\x00') {
	        throw new exports.ScannerError('while scanning a quoted scalar', start_mark, 'found unexpected end of stream', this.get_mark());
	      }
	      if (indexOf.call(C_LB, char) >= 0) {
	        line_break = this.scan_line_break();
	        breaks = this.scan_flow_scalar_breaks(double, start_mark);
	        if (line_break !== '\n') {
	          chunks.push(line_break);
	        } else if (breaks.length === 0) {
	          chunks.push(' ');
	        }
	        chunks = chunks.concat(breaks);
	      } else {
	        chunks.push(whitespaces);
	      }
	      return chunks;
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_flow_scalar_breaks = function(double, start_mark) {
	      var chunks, prefix, ref, ref1, ref2;
	      chunks = [];
	      while (true) {
	        prefix = this.prefix(3);
	        if (prefix === '---' || prefix === '...' && (ref = this.peek(3), indexOf.call(C_LB + C_WS + '\x00', ref) >= 0)) {
	          throw new exports.ScannerError('while scanning a quoted scalar', start_mark, 'found unexpected document separator', this.get_mark());
	        }
	        while (ref1 = this.peek(), indexOf.call(C_WS, ref1) >= 0) {
	          this.forward();
	        }
	        if (ref2 = this.peek(), indexOf.call(C_LB, ref2) >= 0) {
	          chunks.push(this.scan_line_break());
	        } else {
	          return chunks;
	        }
	      }
	    };


	    /*
	    See the specification for details.
	    We add an additional restriction for the flow context:
	      plain scalars in the flow context cannot contain ',', ':' and '?'.
	    We also keep track of the `allow_simple_key` flag here.
	    Indentation rules are loosed for the flow context.
	     */

	    Scanner.prototype.scan_plain = function() {
	      var char, chunks, end_mark, indent, length, ref, ref1, spaces, start_mark;
	      chunks = [];
	      start_mark = end_mark = this.get_mark();
	      indent = this.indent + 1;
	      spaces = [];
	      while (true) {
	        length = 0;
	        if (this.peek() === '#') {
	          break;
	        }
	        while (true) {
	          char = this.peek(length);
	          if (indexOf.call(C_LB + C_WS + '\x00', char) >= 0 || (this.flow_level === 0 && char === ':' && (ref = this.peek(length + 1), indexOf.call(C_LB + C_WS + '\x00', ref) >= 0)) || (this.flow_level !== 0 && indexOf.call(',:?[]{}', char) >= 0)) {
	            break;
	          }
	          length++;
	        }
	        if (this.flow_level !== 0 && char === ':' && (ref1 = this.peek(length + 1), indexOf.call(C_LB + C_WS + '\x00,[]{}', ref1) < 0)) {
	          this.forward(length);
	          throw new exports.ScannerError('while scanning a plain scalar', start_mark, 'found unexpected \':\'', this.get_mark(), 'Please check http://pyyaml.org/wiki/YAMLColonInFlowContext');
	        }
	        if (length === 0) {
	          break;
	        }
	        this.allow_simple_key = false;
	        chunks = chunks.concat(spaces);
	        chunks.push(this.prefix(length));
	        this.forward(length);
	        end_mark = this.get_mark();
	        spaces = this.scan_plain_spaces(indent, start_mark);
	        if ((spaces == null) || spaces.length === 0 || this.peek() === '#' || (this.flow_level === 0 && this.column < indent)) {
	          break;
	        }
	      }
	      return new tokens.ScalarToken(chunks.join(''), true, start_mark, end_mark);
	    };


	    /*
	    See the specification for details.
	    The specification is really confusing about tabs in plain scalars.
	    We just forbid them completely. Do not use tabs in YAML!
	     */

	    Scanner.prototype.scan_plain_spaces = function(indent, start_mark) {
	      var breaks, char, chunks, length, line_break, prefix, ref, ref1, ref2, ref3, whitespaces;
	      chunks = [];
	      length = 0;
	      while (ref = this.peek(length), indexOf.call(' ', ref) >= 0) {
	        length++;
	      }
	      whitespaces = this.prefix(length);
	      this.forward(length);
	      char = this.peek();
	      if (indexOf.call(C_LB, char) >= 0) {
	        line_break = this.scan_line_break();
	        this.allow_simple_key = true;
	        prefix = this.prefix(3);
	        if (prefix === '---' || prefix === '...' && (ref1 = this.peek(3), indexOf.call(C_LB + C_WS + '\x00', ref1) >= 0)) {
	          return;
	        }
	        breaks = [];
	        while (ref3 = this.peek(), indexOf.call(C_LB + ' ', ref3) >= 0) {
	          if (this.peek() === ' ') {
	            this.forward();
	          } else {
	            breaks.push(this.scan_line_break());
	            prefix = this.prefix(3);
	            if (prefix === '---' || prefix === '...' && (ref2 = this.peek(3), indexOf.call(C_LB + C_WS + '\x00', ref2) >= 0)) {
	              return;
	            }
	          }
	        }
	        if (line_break !== '\n') {
	          chunks.push(line_break);
	        } else if (breaks.length === 0) {
	          chunks.push(' ');
	        }
	        chunks = chunks.concat(breaks);
	      } else if (whitespaces) {
	        chunks.push(whitespaces);
	      }
	      return chunks;
	    };


	    /*
	    See the specification for details.
	    For some strange reasons, the specification does not allow '_' in tag
	    handles. I have allowed it anyway.
	     */

	    Scanner.prototype.scan_tag_handle = function(name, start_mark) {
	      var char, length, value;
	      char = this.peek();
	      if (char !== '!') {
	        throw new exports.ScannerError("while scanning a " + name, start_mark, "expected '!' but found " + char, this.get_mark());
	      }
	      length = 1;
	      char = this.peek(length);
	      if (char !== ' ') {
	        while (('0' <= char && char <= '9') || ('A' <= char && char <= 'Z') || ('a' <= char && char <= 'z') || indexOf.call('-_', char) >= 0) {
	          length++;
	          char = this.peek(length);
	        }
	        if (char !== '!') {
	          this.forward(length);
	          throw new exports.ScannerError("while scanning a " + name, start_mark, "expected '!' but found " + char, this.get_mark());
	        }
	        length++;
	      }
	      value = this.prefix(length);
	      this.forward(length);
	      return value;
	    };


	    /*
	    See the specification for details.
	    Note: we do not check if URI is well-formed.
	     */

	    Scanner.prototype.scan_tag_uri = function(name, start_mark) {
	      var char, chunks, length;
	      chunks = [];
	      length = 0;
	      char = this.peek(length);
	      while (('0' <= char && char <= '9') || ('A' <= char && char <= 'Z') || ('a' <= char && char <= 'z') || indexOf.call('-;/?:@&=+$,_.!~*\'()[]%', char) >= 0) {
	        if (char === '%') {
	          chunks.push(this.prefix(length));
	          this.forward(length);
	          length = 0;
	          chunks.push(this.scan_uri_escapes(name, start_mark));
	        } else {
	          length++;
	        }
	        char = this.peek(length);
	      }
	      if (length !== 0) {
	        chunks.push(this.prefix(length));
	        this.forward(length);
	        length = 0;
	      }
	      if (chunks.length === 0) {
	        throw new exports.ScannerError("while parsing a " + name, start_mark, "expected URI but found " + char, this.get_mark());
	      }
	      return chunks.join('');
	    };


	    /*
	    See the specification for details.
	     */

	    Scanner.prototype.scan_uri_escapes = function(name, start_mark) {
	      var bytes, i, k, mark;
	      bytes = [];
	      mark = this.get_mark();
	      while (this.peek() === '%') {
	        this.forward();
	        for (k = i = 0; i <= 2; k = ++i) {
	          throw new exports.ScannerError("while scanning a " + name, start_mark, "expected URI escape sequence of 2 hexadecimal numbers but found " + (this.peek(k)), this.get_mark());
	        }
	        bytes.push(String.fromCharCode(parseInt(this.prefix(2), 16)));
	        this.forward(2);
	      }
	      return bytes.join('');
	    };


	    /*
	    Transforms:
	      '\r\n'      :   '\n'
	      '\r'        :   '\n'
	      '\n'        :   '\n'
	      '\x85'      :   '\n'
	      '\u2028'    :   '\u2028'
	      '\u2029     :   '\u2029'
	      default     :   ''
	     */

	    Scanner.prototype.scan_line_break = function() {
	      var char;
	      char = this.peek();
	      if (indexOf.call('\r\n\x85', char) >= 0) {
	        if (this.prefix(2) === '\r\n') {
	          this.forward(2);
	        } else {
	          this.forward();
	        }
	        return '\n';
	      } else if (indexOf.call('\u2028\u2029', char) >= 0) {
	        this.forward();
	        return char;
	      }
	      return '';
	    };

	    return Scanner;

	  })();

	}).call(this);


/***/ }),
/* 98 */
/***/ (function(module, exports) {

	(function() {
	  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  this.Token = (function() {
	    function Token(start_mark, end_mark) {
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	    }

	    return Token;

	  })();

	  this.DirectiveToken = (function(superClass) {
	    extend(DirectiveToken, superClass);

	    DirectiveToken.prototype.id = '<directive>';

	    function DirectiveToken(name, value, start_mark, end_mark) {
	      this.name = name;
	      this.value = value;
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	    }

	    return DirectiveToken;

	  })(this.Token);

	  this.DocumentStartToken = (function(superClass) {
	    extend(DocumentStartToken, superClass);

	    function DocumentStartToken() {
	      return DocumentStartToken.__super__.constructor.apply(this, arguments);
	    }

	    DocumentStartToken.prototype.id = '<document start>';

	    return DocumentStartToken;

	  })(this.Token);

	  this.DocumentEndToken = (function(superClass) {
	    extend(DocumentEndToken, superClass);

	    function DocumentEndToken() {
	      return DocumentEndToken.__super__.constructor.apply(this, arguments);
	    }

	    DocumentEndToken.prototype.id = '<document end>';

	    return DocumentEndToken;

	  })(this.Token);

	  this.StreamStartToken = (function(superClass) {
	    extend(StreamStartToken, superClass);

	    StreamStartToken.prototype.id = '<stream start>';

	    function StreamStartToken(start_mark, end_mark, encoding) {
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	      this.encoding = encoding;
	    }

	    return StreamStartToken;

	  })(this.Token);

	  this.StreamEndToken = (function(superClass) {
	    extend(StreamEndToken, superClass);

	    function StreamEndToken() {
	      return StreamEndToken.__super__.constructor.apply(this, arguments);
	    }

	    StreamEndToken.prototype.id = '<stream end>';

	    return StreamEndToken;

	  })(this.Token);

	  this.BlockSequenceStartToken = (function(superClass) {
	    extend(BlockSequenceStartToken, superClass);

	    function BlockSequenceStartToken() {
	      return BlockSequenceStartToken.__super__.constructor.apply(this, arguments);
	    }

	    BlockSequenceStartToken.prototype.id = '<block sequence start>';

	    return BlockSequenceStartToken;

	  })(this.Token);

	  this.BlockMappingStartToken = (function(superClass) {
	    extend(BlockMappingStartToken, superClass);

	    function BlockMappingStartToken() {
	      return BlockMappingStartToken.__super__.constructor.apply(this, arguments);
	    }

	    BlockMappingStartToken.prototype.id = '<block mapping end>';

	    return BlockMappingStartToken;

	  })(this.Token);

	  this.BlockEndToken = (function(superClass) {
	    extend(BlockEndToken, superClass);

	    function BlockEndToken() {
	      return BlockEndToken.__super__.constructor.apply(this, arguments);
	    }

	    BlockEndToken.prototype.id = '<block end>';

	    return BlockEndToken;

	  })(this.Token);

	  this.FlowSequenceStartToken = (function(superClass) {
	    extend(FlowSequenceStartToken, superClass);

	    function FlowSequenceStartToken() {
	      return FlowSequenceStartToken.__super__.constructor.apply(this, arguments);
	    }

	    FlowSequenceStartToken.prototype.id = '[';

	    return FlowSequenceStartToken;

	  })(this.Token);

	  this.FlowMappingStartToken = (function(superClass) {
	    extend(FlowMappingStartToken, superClass);

	    function FlowMappingStartToken() {
	      return FlowMappingStartToken.__super__.constructor.apply(this, arguments);
	    }

	    FlowMappingStartToken.prototype.id = '{';

	    return FlowMappingStartToken;

	  })(this.Token);

	  this.FlowSequenceEndToken = (function(superClass) {
	    extend(FlowSequenceEndToken, superClass);

	    function FlowSequenceEndToken() {
	      return FlowSequenceEndToken.__super__.constructor.apply(this, arguments);
	    }

	    FlowSequenceEndToken.prototype.id = ']';

	    return FlowSequenceEndToken;

	  })(this.Token);

	  this.FlowMappingEndToken = (function(superClass) {
	    extend(FlowMappingEndToken, superClass);

	    function FlowMappingEndToken() {
	      return FlowMappingEndToken.__super__.constructor.apply(this, arguments);
	    }

	    FlowMappingEndToken.prototype.id = '}';

	    return FlowMappingEndToken;

	  })(this.Token);

	  this.KeyToken = (function(superClass) {
	    extend(KeyToken, superClass);

	    function KeyToken() {
	      return KeyToken.__super__.constructor.apply(this, arguments);
	    }

	    KeyToken.prototype.id = '?';

	    return KeyToken;

	  })(this.Token);

	  this.ValueToken = (function(superClass) {
	    extend(ValueToken, superClass);

	    function ValueToken() {
	      return ValueToken.__super__.constructor.apply(this, arguments);
	    }

	    ValueToken.prototype.id = ':';

	    return ValueToken;

	  })(this.Token);

	  this.BlockEntryToken = (function(superClass) {
	    extend(BlockEntryToken, superClass);

	    function BlockEntryToken() {
	      return BlockEntryToken.__super__.constructor.apply(this, arguments);
	    }

	    BlockEntryToken.prototype.id = '-';

	    return BlockEntryToken;

	  })(this.Token);

	  this.FlowEntryToken = (function(superClass) {
	    extend(FlowEntryToken, superClass);

	    function FlowEntryToken() {
	      return FlowEntryToken.__super__.constructor.apply(this, arguments);
	    }

	    FlowEntryToken.prototype.id = ',';

	    return FlowEntryToken;

	  })(this.Token);

	  this.AliasToken = (function(superClass) {
	    extend(AliasToken, superClass);

	    AliasToken.prototype.id = '<alias>';

	    function AliasToken(value, start_mark, end_mark) {
	      this.value = value;
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	    }

	    return AliasToken;

	  })(this.Token);

	  this.AnchorToken = (function(superClass) {
	    extend(AnchorToken, superClass);

	    AnchorToken.prototype.id = '<anchor>';

	    function AnchorToken(value, start_mark, end_mark) {
	      this.value = value;
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	    }

	    return AnchorToken;

	  })(this.Token);

	  this.TagToken = (function(superClass) {
	    extend(TagToken, superClass);

	    TagToken.prototype.id = '<tag>';

	    function TagToken(value, start_mark, end_mark) {
	      this.value = value;
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	    }

	    return TagToken;

	  })(this.Token);

	  this.ScalarToken = (function(superClass) {
	    extend(ScalarToken, superClass);

	    ScalarToken.prototype.id = '<scalar>';

	    function ScalarToken(value, plain, start_mark, end_mark, style) {
	      this.value = value;
	      this.plain = plain;
	      this.start_mark = start_mark;
	      this.end_mark = end_mark;
	      this.style = style;
	    }

	    return ScalarToken;

	  })(this.Token);

	}).call(this);


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var MarkedYAMLError, events, tokens,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty,
	    slice = [].slice;

	  events = __webpack_require__(77);

	  MarkedYAMLError = __webpack_require__(78).MarkedYAMLError;

	  tokens = __webpack_require__(98);

	  this.ParserError = (function(superClass) {
	    extend(ParserError, superClass);

	    function ParserError() {
	      return ParserError.__super__.constructor.apply(this, arguments);
	    }

	    return ParserError;

	  })(MarkedYAMLError);

	  this.Parser = (function() {
	    var DEFAULT_TAGS;

	    DEFAULT_TAGS = {
	      '!': '!',
	      '!!': 'tag:yaml.org,2002:'
	    };

	    function Parser() {
	      this.current_event = null;
	      this.yaml_version = null;
	      this.tag_handles = {};
	      this.states = [];
	      this.marks = [];
	      this.state = 'parse_stream_start';
	    }


	    /*
	    Reset the state attributes.
	     */

	    Parser.prototype.dispose = function() {
	      this.states = [];
	      return this.state = null;
	    };


	    /*
	    Check the type of the next event.
	     */

	    Parser.prototype.check_event = function() {
	      var choice, choices, i, len;
	      choices = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	      if (this.current_event === null) {
	        if (this.state != null) {
	          this.current_event = this[this.state]();
	        }
	      }
	      if (this.current_event !== null) {
	        if (choices.length === 0) {
	          return true;
	        }
	        for (i = 0, len = choices.length; i < len; i++) {
	          choice = choices[i];
	          if (this.current_event instanceof choice) {
	            return true;
	          }
	        }
	      }
	      return false;
	    };


	    /*
	    Get the next event.
	     */

	    Parser.prototype.peek_event = function() {
	      if (this.current_event === null && (this.state != null)) {
	        this.current_event = this[this.state]();
	      }
	      return this.current_event;
	    };


	    /*
	    Get the event and proceed further.
	     */

	    Parser.prototype.get_event = function() {
	      var event;
	      if (this.current_event === null && (this.state != null)) {
	        this.current_event = this[this.state]();
	      }
	      event = this.current_event;
	      this.current_event = null;
	      return event;
	    };


	    /*
	    Parse the stream start.
	     */

	    Parser.prototype.parse_stream_start = function() {
	      var event, token;
	      token = this.get_token();
	      event = new events.StreamStartEvent(token.start_mark, token.end_mark);
	      this.state = 'parse_implicit_document_start';
	      return event;
	    };


	    /*
	    Parse an implicit document.
	     */

	    Parser.prototype.parse_implicit_document_start = function() {
	      var end_mark, event, start_mark, token;
	      if (!this.check_token(tokens.DirectiveToken, tokens.DocumentStartToken, tokens.StreamEndToken)) {
	        this.tag_handles = DEFAULT_TAGS;
	        token = this.peek_token();
	        start_mark = end_mark = token.start_mark;
	        event = new events.DocumentStartEvent(start_mark, end_mark, false);
	        this.states.push('parse_document_end');
	        this.state = 'parse_block_node';
	        return event;
	      } else {
	        return this.parse_document_start();
	      }
	    };


	    /*
	    Parse an explicit document.
	     */

	    Parser.prototype.parse_document_start = function() {
	      var end_mark, event, ref, start_mark, tags, token, version;
	      while (this.check_token(tokens.DocumentEndToken)) {
	        this.get_token();
	      }
	      if (!this.check_token(tokens.StreamEndToken)) {
	        start_mark = this.peek_token().start_mark;
	        ref = this.process_directives(), version = ref[0], tags = ref[1];
	        if (!this.check_token(tokens.DocumentStartToken)) {
	          throw new exports.ParserError("expected '<document start>', but found " + (this.peek_token().id), this.peek_token().start_mark);
	        }
	        token = this.get_token();
	        end_mark = token.end_mark;
	        event = new events.DocumentStartEvent(start_mark, end_mark, true, version, tags);
	        this.states.push('parse_document_end');
	        this.state = 'parse_document_content';
	      } else {
	        token = this.get_token();
	        event = new events.StreamEndEvent(token.start_mark, token.end_mark);
	        if (this.states.length !== 0) {
	          throw new Error('assertion error, states should be empty');
	        }
	        if (this.marks.length !== 0) {
	          throw new Error('assertion error, marks should be empty');
	        }
	        this.state = null;
	      }
	      return event;
	    };


	    /*
	    Parse the document end.
	     */

	    Parser.prototype.parse_document_end = function() {
	      var end_mark, event, explicit, start_mark, token;
	      token = this.peek_token();
	      start_mark = end_mark = token.start_mark;
	      explicit = false;
	      if (this.check_token(tokens.DocumentEndToken)) {
	        token = this.get_token();
	        end_mark = token.end_mark;
	        explicit = true;
	      }
	      event = new events.DocumentEndEvent(start_mark, end_mark, explicit);
	      this.state = 'parse_document_start';
	      return event;
	    };

	    Parser.prototype.parse_document_content = function() {
	      var event;
	      if (this.check_token(tokens.DirectiveToken, tokens.DocumentStartToken, tokens.DocumentEndToken, tokens.StreamEndToken)) {
	        event = this.process_empty_scalar(this.peek_token().start_mark);
	        this.state = this.states.pop();
	        return event;
	      } else {
	        return this.parse_block_node();
	      }
	    };

	    Parser.prototype.process_directives = function() {
	      var handle, major, minor, prefix, ref, ref1, ref2, tag_handles_copy, token, value;
	      this.yaml_version = null;
	      this.tag_handles = {};
	      while (this.check_token(tokens.DirectiveToken)) {
	        token = this.get_token();
	        if (token.name === 'YAML') {
	          if (this.yaml_version !== null) {
	            throw new exports.ParserError(null, null, 'found duplicate YAML directive', token.start_mark);
	          }
	          ref = token.value, major = ref[0], minor = ref[1];
	          if (major !== 1) {
	            throw new exports.ParserError(null, null, 'found incompatible YAML document (version 1.* is required)', token.start_mark);
	          }
	          this.yaml_version = token.value;
	        } else if (token.name === 'TAG') {
	          ref1 = token.value, handle = ref1[0], prefix = ref1[1];
	          if (handle in this.tag_handles) {
	            throw new exports.ParserError(null, null, "duplicate tag handle " + handle, token.start_mark);
	          }
	          this.tag_handles[handle] = prefix;
	        }
	      }
	      tag_handles_copy = null;
	      ref2 = this.tag_handles;
	      for (handle in ref2) {
	        if (!hasProp.call(ref2, handle)) continue;
	        prefix = ref2[handle];
	        if (tag_handles_copy == null) {
	          tag_handles_copy = {};
	        }
	        tag_handles_copy[handle] = prefix;
	      }
	      value = [this.yaml_version, tag_handles_copy];
	      for (handle in DEFAULT_TAGS) {
	        if (!hasProp.call(DEFAULT_TAGS, handle)) continue;
	        prefix = DEFAULT_TAGS[handle];
	        if (!(prefix in this.tag_handles)) {
	          this.tag_handles[handle] = prefix;
	        }
	      }
	      return value;
	    };

	    Parser.prototype.parse_block_node = function() {
	      return this.parse_node(true);
	    };

	    Parser.prototype.parse_flow_node = function() {
	      return this.parse_node();
	    };

	    Parser.prototype.parse_block_node_or_indentless_sequence = function() {
	      return this.parse_node(true, true);
	    };

	    Parser.prototype.parse_node = function(block, indentless_sequence) {
	      var anchor, end_mark, event, handle, implicit, node, start_mark, suffix, tag, tag_mark, token;
	      if (block == null) {
	        block = false;
	      }
	      if (indentless_sequence == null) {
	        indentless_sequence = false;
	      }
	      if (this.check_token(tokens.AliasToken)) {
	        token = this.get_token();
	        event = new events.AliasEvent(token.value, token.start_mark, token.end_mark);
	        this.state = this.states.pop();
	      } else {
	        anchor = null;
	        tag = null;
	        start_mark = end_mark = tag_mark = null;
	        if (this.check_token(tokens.AnchorToken)) {
	          token = this.get_token();
	          start_mark = token.start_mark;
	          end_mark = token.end_mark;
	          anchor = token.value;
	          if (this.check_token(tokens.TagToken)) {
	            token = this.get_token();
	            tag_mark = token.start_mark;
	            end_mark = token.end_mark;
	            tag = token.value;
	          }
	        } else if (this.check_token(tokens.TagToken)) {
	          token = this.get_token();
	          start_mark = tag_mark = token.start_mark;
	          end_mark = token.end_mark;
	          tag = token.value;
	          if (this.check_token(tokens.AnchorToken)) {
	            token = this.get_token();
	            end_mark = token.end_mark;
	            anchor = token.value;
	          }
	        }
	        if (tag !== null) {
	          handle = tag[0], suffix = tag[1];
	          if (handle !== null) {
	            if (!(handle in this.tag_handles)) {
	              throw new exports.ParserError('while parsing a node', start_mark, "found undefined tag handle " + handle, tag_mark);
	            }
	            tag = this.tag_handles[handle] + suffix;
	          } else {
	            tag = suffix;
	          }
	        }
	        if (start_mark === null) {
	          start_mark = end_mark = this.peek_token().start_mark;
	        }
	        event = null;
	        implicit = tag === null || tag === '!';
	        if (indentless_sequence && this.check_token(tokens.BlockEntryToken)) {
	          end_mark = this.peek_token().end_mark;
	          event = new events.SequenceStartEvent(anchor, tag, implicit, start_mark, end_mark);
	          this.state = 'parse_indentless_sequence_entry';
	        } else {
	          if (this.check_token(tokens.ScalarToken)) {
	            token = this.get_token();
	            end_mark = token.end_mark;
	            if ((token.plain && tag === null) || tag === '!') {
	              implicit = [true, false];
	            } else if (tag === null) {
	              implicit = [false, true];
	            } else {
	              implicit = [false, false];
	            }
	            event = new events.ScalarEvent(anchor, tag, implicit, token.value, start_mark, end_mark, token.style);
	            this.state = this.states.pop();
	          } else if (this.check_token(tokens.FlowSequenceStartToken)) {
	            end_mark = this.peek_token().end_mark;
	            event = new events.SequenceStartEvent(anchor, tag, implicit, start_mark, end_mark, true);
	            this.state = 'parse_flow_sequence_first_entry';
	          } else if (this.check_token(tokens.FlowMappingStartToken)) {
	            end_mark = this.peek_token().end_mark;
	            event = new events.MappingStartEvent(anchor, tag, implicit, start_mark, end_mark, true);
	            this.state = 'parse_flow_mapping_first_key';
	          } else if (block && this.check_token(tokens.BlockSequenceStartToken)) {
	            end_mark = this.peek_token().end_mark;
	            event = new events.SequenceStartEvent(anchor, tag, implicit, start_mark, end_mark, false);
	            this.state = 'parse_block_sequence_first_entry';
	          } else if (block && this.check_token(tokens.BlockMappingStartToken)) {
	            end_mark = this.peek_token().end_mark;
	            event = new events.MappingStartEvent(anchor, tag, implicit, start_mark, end_mark, false);
	            this.state = 'parse_block_mapping_first_key';
	          } else if (anchor !== null || tag !== null) {
	            event = new events.ScalarEvent(anchor, tag, [implicit, false], '', start_mark, end_mark);
	            this.state = this.states.pop();
	          } else {
	            if (block) {
	              node = 'block';
	            } else {
	              node = 'flow';
	            }
	            token = this.peek_token();
	            throw new exports.ParserError("while parsing a " + node + " node", start_mark, "expected the node content, but found " + token.id, token.start_mark);
	          }
	        }
	      }
	      return event;
	    };

	    Parser.prototype.parse_block_sequence_first_entry = function() {
	      var token;
	      token = this.get_token();
	      this.marks.push(token.start_mark);
	      return this.parse_block_sequence_entry();
	    };

	    Parser.prototype.parse_block_sequence_entry = function() {
	      var event, token;
	      if (this.check_token(tokens.BlockEntryToken)) {
	        token = this.get_token();
	        if (!this.check_token(tokens.BlockEntryToken, tokens.BlockEndToken)) {
	          this.states.push('parse_block_sequence_entry');
	          return this.parse_block_node();
	        } else {
	          this.state = 'parse_block_sequence_entry';
	          return this.process_empty_scalar(token.end_mark);
	        }
	      }
	      if (!this.check_token(tokens.BlockEndToken)) {
	        token = this.peek_token();
	        throw new exports.ParserError('while parsing a block collection', this.marks.slice(-1)[0], "expected <block end>, but found " + token.id, token.start_mark);
	      }
	      token = this.get_token();
	      event = new events.SequenceEndEvent(token.start_mark, token.end_mark);
	      this.state = this.states.pop();
	      this.marks.pop();
	      return event;
	    };

	    Parser.prototype.parse_indentless_sequence_entry = function() {
	      var event, token;
	      if (this.check_token(tokens.BlockEntryToken)) {
	        token = this.get_token();
	        if (!this.check_token(tokens.BlockEntryToken, tokens.KeyToken, tokens.ValueToken, tokens.BlockEndToken)) {
	          this.states.push('parse_indentless_sequence_entry');
	          return this.parse_block_node();
	        } else {
	          this.state = 'parse_indentless_sequence_entry';
	          return this.process_empty_scalar(token.end_mark);
	        }
	      }
	      token = this.peek_token();
	      event = new events.SequenceEndEvent(token.start_mark, token.start_mark);
	      this.state = this.states.pop();
	      return event;
	    };

	    Parser.prototype.parse_block_mapping_first_key = function() {
	      var token;
	      token = this.get_token();
	      this.marks.push(token.start_mark);
	      return this.parse_block_mapping_key();
	    };

	    Parser.prototype.parse_block_mapping_key = function() {
	      var event, token;
	      if (this.check_token(tokens.KeyToken)) {
	        token = this.get_token();
	        if (!this.check_token(tokens.KeyToken, tokens.ValueToken, tokens.BlockEndToken)) {
	          this.states.push('parse_block_mapping_value');
	          return this.parse_block_node_or_indentless_sequence();
	        } else {
	          this.state = 'parse_block_mapping_value';
	          return this.process_empty_scalar(token.end_mark);
	        }
	      }
	      if (!this.check_token(tokens.BlockEndToken)) {
	        token = this.peek_token();
	        throw new exports.ParserError('while parsing a block mapping', this.marks.slice(-1)[0], "expected <block end>, but found " + token.id, token.start_mark);
	      }
	      token = this.get_token();
	      event = new events.MappingEndEvent(token.start_mark, token.end_mark);
	      this.state = this.states.pop();
	      this.marks.pop();
	      return event;
	    };

	    Parser.prototype.parse_block_mapping_value = function() {
	      var token;
	      if (this.check_token(tokens.ValueToken)) {
	        token = this.get_token();
	        if (!this.check_token(tokens.KeyToken, tokens.ValueToken, tokens.BlockEndToken)) {
	          this.states.push('parse_block_mapping_key');
	          return this.parse_block_node_or_indentless_sequence();
	        } else {
	          this.state = 'parse_block_mapping_key';
	          return this.process_empty_scalar(token.end_mark);
	        }
	      } else {
	        this.state = 'parse_block_mapping_key';
	        token = this.peek_token();
	        return this.process_empty_scalar(token.start_mark);
	      }
	    };

	    Parser.prototype.parse_flow_sequence_first_entry = function() {
	      var token;
	      token = this.get_token();
	      this.marks.push(token.start_mark);
	      return this.parse_flow_sequence_entry(true);
	    };

	    Parser.prototype.parse_flow_sequence_entry = function(first) {
	      var event, token;
	      if (first == null) {
	        first = false;
	      }
	      if (!this.check_token(tokens.FlowSequenceEndToken)) {
	        if (!first) {
	          if (this.check_token(tokens.FlowEntryToken)) {
	            this.get_token();
	          } else {
	            token = this.peek_token();
	            throw new exports.ParserError('while parsing a flow sequence', this.marks.slice(-1)[0], "expected ',' or ']', but got " + token.id, token.start_mark);
	          }
	        }
	        if (this.check_token(tokens.KeyToken)) {
	          token = this.peek_token();
	          event = new events.MappingStartEvent(null, null, true, token.start_mark, token.end_mark, true);
	          this.state = 'parse_flow_sequence_entry_mapping_key';
	          return event;
	        } else if (!this.check_token(tokens.FlowSequenceEndToken)) {
	          this.states.push('parse_flow_sequence_entry');
	          return this.parse_flow_node();
	        }
	      }
	      token = this.get_token();
	      event = new events.SequenceEndEvent(token.start_mark, token.end_mark);
	      this.state = this.states.pop();
	      this.marks.pop();
	      return event;
	    };

	    Parser.prototype.parse_flow_sequence_entry_mapping_key = function() {
	      var token;
	      token = this.get_token();
	      if (!this.check_token(tokens.ValueToken, tokens.FlowEntryToken, tokens.FlowSequenceEndToken)) {
	        this.states.push('parse_flow_sequence_entry_mapping_value');
	        return this.parse_flow_node();
	      } else {
	        this.state = 'parse_flow_sequence_entry_mapping_value';
	        return this.process_empty_scalar(token.end_mark);
	      }
	    };

	    Parser.prototype.parse_flow_sequence_entry_mapping_value = function() {
	      var token;
	      if (this.check_token(tokens.ValueToken)) {
	        token = this.get_token();
	        if (!this.check_token(tokens.FlowEntryToken, tokens.FlowSequenceEndToken)) {
	          this.states.push('parse_flow_sequence_entry_mapping_end');
	          return this.parse_flow_node();
	        } else {
	          this.state = 'parse_flow_sequence_entry_mapping_end';
	          return this.process_empty_scalar(token.end_mark);
	        }
	      } else {
	        this.state = 'parse_flow_sequence_entry_mapping_end';
	        token = this.peek_token();
	        return this.process_empty_scalar(token.start_mark);
	      }
	    };

	    Parser.prototype.parse_flow_sequence_entry_mapping_end = function() {
	      var token;
	      this.state = 'parse_flow_sequence_entry';
	      token = this.peek_token();
	      return new events.MappingEndEvent(token.start_mark, token.start_mark);
	    };

	    Parser.prototype.parse_flow_mapping_first_key = function() {
	      var token;
	      token = this.get_token();
	      this.marks.push(token.start_mark);
	      return this.parse_flow_mapping_key(true);
	    };

	    Parser.prototype.parse_flow_mapping_key = function(first) {
	      var event, token;
	      if (first == null) {
	        first = false;
	      }
	      if (!this.check_token(tokens.FlowMappingEndToken)) {
	        if (!first) {
	          if (this.check_token(tokens.FlowEntryToken)) {
	            this.get_token();
	          } else {
	            token = this.peek_token();
	            throw new exports.ParserError('while parsing a flow mapping', this.marks.slice(-1)[0], "expected ',' or '}', but got " + token.id, token.start_mark);
	          }
	        }
	        if (this.check_token(tokens.KeyToken)) {
	          token = this.get_token();
	          if (!this.check_token(tokens.ValueToken, tokens.FlowEntryToken, tokens.FlowMappingEndToken)) {
	            this.states.push('parse_flow_mapping_value');
	            return this.parse_flow_node();
	          } else {
	            this.state = 'parse_flow_mapping_value';
	            return this.process_empty_scalar(token.end_mark);
	          }
	        } else if (!this.check_token(tokens.FlowMappingEndToken)) {
	          this.states.push('parse_flow_mapping_empty_value');
	          return this.parse_flow_node();
	        }
	      }
	      token = this.get_token();
	      event = new events.MappingEndEvent(token.start_mark, token.end_mark);
	      this.state = this.states.pop();
	      this.marks.pop();
	      return event;
	    };

	    Parser.prototype.parse_flow_mapping_value = function() {
	      var token;
	      if (this.check_token(tokens.ValueToken)) {
	        token = this.get_token();
	        if (!this.check_token(tokens.FlowEntryToken, tokens.FlowMappingEndToken)) {
	          this.states.push('parse_flow_mapping_key');
	          return this.parse_flow_node();
	        } else {
	          this.state = 'parse_flow_mapping_key';
	          return this.process_empty_scalar(token.end_mark);
	        }
	      } else {
	        this.state = 'parse_flow_mapping_key';
	        token = this.peek_token();
	        return this.process_empty_scalar(token.start_mark);
	      }
	    };

	    Parser.prototype.parse_flow_mapping_empty_value = function() {
	      this.state = 'parse_flow_mapping_key';
	      return this.process_empty_scalar(this.peek_token().start_mark);
	    };

	    Parser.prototype.process_empty_scalar = function(mark) {
	      return new events.ScalarEvent(null, null, [true, false], '', mark, mark);
	    };

	    return Parser;

	  })();

	}).call(this);


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	var map = {
		"./composer": 76,
		"./composer.js": 76,
		"./constructor": 80,
		"./constructor.js": 80,
		"./dumper": 90,
		"./dumper.js": 90,
		"./emitter": 91,
		"./emitter.js": 91,
		"./errors": 78,
		"./errors.js": 78,
		"./events": 77,
		"./events.js": 77,
		"./loader": 95,
		"./loader.js": 95,
		"./nodes": 79,
		"./nodes.js": 79,
		"./parser": 99,
		"./parser.js": 99,
		"./reader": 96,
		"./reader.js": 96,
		"./representer": 93,
		"./representer.js": 93,
		"./resolver": 94,
		"./resolver.js": 94,
		"./scanner": 97,
		"./scanner.js": 97,
		"./serializer": 92,
		"./serializer.js": 92,
		"./tokens": 98,
		"./tokens.js": 98,
		"./util": 85,
		"./util.js": 85,
		"./yaml": 75,
		"./yaml.js": 75
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 100;


/***/ }),
/* 101 */
/***/ (function(module, exports) {

	

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	var createFind = __webpack_require__(103),
	    findIndex = __webpack_require__(163);

	/**
	 * Iterates over elements of `collection`, returning the first element
	 * `predicate` returns truthy for. The predicate is invoked with three
	 * arguments: (value, index|key, collection).
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to inspect.
	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
	 * @param {number} [fromIndex=0] The index to search from.
	 * @returns {*} Returns the matched element, else `undefined`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'age': 36, 'active': true },
	 *   { 'user': 'fred',    'age': 40, 'active': false },
	 *   { 'user': 'pebbles', 'age': 1,  'active': true }
	 * ];
	 *
	 * _.find(users, function(o) { return o.age < 40; });
	 * // => object for 'barney'
	 *
	 * // The `_.matches` iteratee shorthand.
	 * _.find(users, { 'age': 1, 'active': true });
	 * // => object for 'pebbles'
	 *
	 * // The `_.matchesProperty` iteratee shorthand.
	 * _.find(users, ['active', false]);
	 * // => object for 'fred'
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.find(users, 'active');
	 * // => object for 'barney'
	 */
	var find = createFind(findIndex);

	module.exports = find;


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIteratee = __webpack_require__(104),
	    isArrayLike = __webpack_require__(146),
	    keys = __webpack_require__(131);

	/**
	 * Creates a `_.find` or `_.findLast` function.
	 *
	 * @private
	 * @param {Function} findIndexFunc The function to find the collection index.
	 * @returns {Function} Returns the new find function.
	 */
	function createFind(findIndexFunc) {
	  return function(collection, predicate, fromIndex) {
	    var iterable = Object(collection);
	    if (!isArrayLike(collection)) {
	      var iteratee = baseIteratee(predicate, 3);
	      collection = keys(collection);
	      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
	    }
	    var index = findIndexFunc(collection, predicate, fromIndex);
	    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
	  };
	}

	module.exports = createFind;


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(105),
	    baseMatchesProperty = __webpack_require__(155),
	    identity = __webpack_require__(159),
	    isArray = __webpack_require__(14),
	    property = __webpack_require__(160);

	/**
	 * The base implementation of `_.iteratee`.
	 *
	 * @private
	 * @param {*} [value=_.identity] The value to convert to an iteratee.
	 * @returns {Function} Returns the iteratee.
	 */
	function baseIteratee(value) {
	  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
	  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
	  if (typeof value == 'function') {
	    return value;
	  }
	  if (value == null) {
	    return identity;
	  }
	  if (typeof value == 'object') {
	    return isArray(value)
	      ? baseMatchesProperty(value[0], value[1])
	      : baseMatches(value);
	  }
	  return property(value);
	}

	module.exports = baseIteratee;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(106),
	    getMatchData = __webpack_require__(152),
	    matchesStrictComparable = __webpack_require__(154);

	/**
	 * The base implementation of `_.matches` which doesn't clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatches(source) {
	  var matchData = getMatchData(source);
	  if (matchData.length == 1 && matchData[0][2]) {
	    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
	  }
	  return function(object) {
	    return object === source || baseIsMatch(object, source, matchData);
	  };
	}

	module.exports = baseMatches;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(107),
	    baseIsEqual = __webpack_require__(113);

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1,
	    COMPARE_UNORDERED_FLAG = 2;

	/**
	 * The base implementation of `_.isMatch` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Object} source The object of property values to match.
	 * @param {Array} matchData The property names, values, and compare flags to match.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, source, matchData, customizer) {
	  var index = matchData.length,
	      length = index,
	      noCustomizer = !customizer;

	  if (object == null) {
	    return !length;
	  }
	  object = Object(object);
	  while (index--) {
	    var data = matchData[index];
	    if ((noCustomizer && data[2])
	          ? data[1] !== object[data[0]]
	          : !(data[0] in object)
	        ) {
	      return false;
	    }
	  }
	  while (++index < length) {
	    data = matchData[index];
	    var key = data[0],
	        objValue = object[key],
	        srcValue = data[1];

	    if (noCustomizer && data[2]) {
	      if (objValue === undefined && !(key in object)) {
	        return false;
	      }
	    } else {
	      var stack = new Stack;
	      if (customizer) {
	        var result = customizer(objValue, srcValue, key, object, source, stack);
	      }
	      if (!(result === undefined
	            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
	            : result
	          )) {
	        return false;
	      }
	    }
	  }
	  return true;
	}

	module.exports = baseIsMatch;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(54),
	    stackClear = __webpack_require__(108),
	    stackDelete = __webpack_require__(109),
	    stackGet = __webpack_require__(110),
	    stackHas = __webpack_require__(111),
	    stackSet = __webpack_require__(112);

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  var data = this.__data__ = new ListCache(entries);
	  this.size = data.size;
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;

	module.exports = Stack;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(54);

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new ListCache;
	  this.size = 0;
	}

	module.exports = stackClear;


/***/ }),
/* 109 */
/***/ (function(module, exports) {

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  var data = this.__data__,
	      result = data['delete'](key);

	  this.size = data.size;
	  return result;
	}

	module.exports = stackDelete;


/***/ }),
/* 110 */
/***/ (function(module, exports) {

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}

	module.exports = stackGet;


/***/ }),
/* 111 */
/***/ (function(module, exports) {

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}

	module.exports = stackHas;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(54),
	    Map = __webpack_require__(62),
	    MapCache = __webpack_require__(37);

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var data = this.__data__;
	  if (data instanceof ListCache) {
	    var pairs = data.__data__;
	    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      this.size = ++data.size;
	      return this;
	    }
	    data = this.__data__ = new MapCache(pairs);
	  }
	  data.set(key, value);
	  this.size = data.size;
	  return this;
	}

	module.exports = stackSet;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(114),
	    isObjectLike = __webpack_require__(13);

	/**
	 * The base implementation of `_.isEqual` which supports partial comparisons
	 * and tracks traversed objects.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {boolean} bitmask The bitmask flags.
	 *  1 - Unordered comparison
	 *  2 - Partial comparison
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, bitmask, customizer, stack) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
	}

	module.exports = baseIsEqual;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(107),
	    equalArrays = __webpack_require__(115),
	    equalByTag = __webpack_require__(121),
	    equalObjects = __webpack_require__(125),
	    getTag = __webpack_require__(147),
	    isArray = __webpack_require__(14),
	    isBuffer = __webpack_require__(134),
	    isTypedArray = __webpack_require__(137);

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = objIsArr ? arrayTag : getTag(object),
	      othTag = othIsArr ? arrayTag : getTag(other);

	  objTag = objTag == argsTag ? objectTag : objTag;
	  othTag = othTag == argsTag ? objectTag : othTag;

	  var objIsObj = objTag == objectTag,
	      othIsObj = othTag == objectTag,
	      isSameTag = objTag == othTag;

	  if (isSameTag && isBuffer(object)) {
	    if (!isBuffer(other)) {
	      return false;
	    }
	    objIsArr = true;
	    objIsObj = false;
	  }
	  if (isSameTag && !objIsObj) {
	    stack || (stack = new Stack);
	    return (objIsArr || isTypedArray(object))
	      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
	      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
	  }
	  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      var objUnwrapped = objIsWrapped ? object.value() : object,
	          othUnwrapped = othIsWrapped ? other.value() : other;

	      stack || (stack = new Stack);
	      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  stack || (stack = new Stack);
	  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
	}

	module.exports = baseIsEqualDeep;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

	var SetCache = __webpack_require__(116),
	    arraySome = __webpack_require__(119),
	    cacheHas = __webpack_require__(120);

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1,
	    COMPARE_UNORDERED_FLAG = 2;

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `array` and `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(array);
	  if (stacked && stack.get(other)) {
	    return stacked == other;
	  }
	  var index = -1,
	      result = true,
	      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

	  stack.set(array, other);
	  stack.set(other, array);

	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, arrValue, index, other, array, stack)
	        : customizer(arrValue, othValue, index, array, other, stack);
	    }
	    if (compared !== undefined) {
	      if (compared) {
	        continue;
	      }
	      result = false;
	      break;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (seen) {
	      if (!arraySome(other, function(othValue, othIndex) {
	            if (!cacheHas(seen, othIndex) &&
	                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
	              return seen.push(othIndex);
	            }
	          })) {
	        result = false;
	        break;
	      }
	    } else if (!(
	          arrValue === othValue ||
	            equalFunc(arrValue, othValue, bitmask, customizer, stack)
	        )) {
	      result = false;
	      break;
	    }
	  }
	  stack['delete'](array);
	  stack['delete'](other);
	  return result;
	}

	module.exports = equalArrays;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(37),
	    setCacheAdd = __webpack_require__(117),
	    setCacheHas = __webpack_require__(118);

	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values == null ? 0 : values.length;

	  this.__data__ = new MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;

	module.exports = SetCache;


/***/ }),
/* 117 */
/***/ (function(module, exports) {

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED);
	  return this;
	}

	module.exports = setCacheAdd;


/***/ }),
/* 118 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}

	module.exports = setCacheHas;


/***/ }),
/* 119 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `_.some` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	module.exports = arraySome;


/***/ }),
/* 120 */
/***/ (function(module, exports) {

	/**
	 * Checks if a `cache` value for `key` exists.
	 *
	 * @private
	 * @param {Object} cache The cache to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function cacheHas(cache, key) {
	  return cache.has(key);
	}

	module.exports = cacheHas;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(5),
	    Uint8Array = __webpack_require__(122),
	    eq = __webpack_require__(58),
	    equalArrays = __webpack_require__(115),
	    mapToArray = __webpack_require__(123),
	    setToArray = __webpack_require__(124);

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1,
	    COMPARE_UNORDERED_FLAG = 2;

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]';

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
	  switch (tag) {
	    case dataViewTag:
	      if ((object.byteLength != other.byteLength) ||
	          (object.byteOffset != other.byteOffset)) {
	        return false;
	      }
	      object = object.buffer;
	      other = other.buffer;

	    case arrayBufferTag:
	      if ((object.byteLength != other.byteLength) ||
	          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
	        return false;
	      }
	      return true;

	    case boolTag:
	    case dateTag:
	    case numberTag:
	      // Coerce booleans to `1` or `0` and dates to milliseconds.
	      // Invalid dates are coerced to `NaN`.
	      return eq(+object, +other);

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings, primitives and objects,
	      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
	      // for more details.
	      return object == (other + '');

	    case mapTag:
	      var convert = mapToArray;

	    case setTag:
	      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
	      convert || (convert = setToArray);

	      if (object.size != other.size && !isPartial) {
	        return false;
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(object);
	      if (stacked) {
	        return stacked == other;
	      }
	      bitmask |= COMPARE_UNORDERED_FLAG;

	      // Recursively compare objects (susceptible to call stack limits).
	      stack.set(object, other);
	      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
	      stack['delete'](object);
	      return result;

	    case symbolTag:
	      if (symbolValueOf) {
	        return symbolValueOf.call(object) == symbolValueOf.call(other);
	      }
	  }
	  return false;
	}

	module.exports = equalByTag;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

	var root = __webpack_require__(6);

	/** Built-in value references. */
	var Uint8Array = root.Uint8Array;

	module.exports = Uint8Array;


/***/ }),
/* 123 */
/***/ (function(module, exports) {

	/**
	 * Converts `map` to its key-value pairs.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the key-value pairs.
	 */
	function mapToArray(map) {
	  var index = -1,
	      result = Array(map.size);

	  map.forEach(function(value, key) {
	    result[++index] = [key, value];
	  });
	  return result;
	}

	module.exports = mapToArray;


/***/ }),
/* 124 */
/***/ (function(module, exports) {

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}

	module.exports = setToArray;


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

	var getAllKeys = __webpack_require__(126);

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
	      objProps = getAllKeys(object),
	      objLength = objProps.length,
	      othProps = getAllKeys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isPartial) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
	      return false;
	    }
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(object);
	  if (stacked && stack.get(other)) {
	    return stacked == other;
	  }
	  var result = true;
	  stack.set(object, other);
	  stack.set(other, object);

	  var skipCtor = isPartial;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, objValue, key, other, object, stack)
	        : customizer(objValue, othValue, key, object, other, stack);
	    }
	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(compared === undefined
	          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
	          : compared
	        )) {
	      result = false;
	      break;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (result && !skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      result = false;
	    }
	  }
	  stack['delete'](object);
	  stack['delete'](other);
	  return result;
	}

	module.exports = equalObjects;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetAllKeys = __webpack_require__(127),
	    getSymbols = __webpack_require__(128),
	    keys = __webpack_require__(131);

	/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeys(object) {
	  return baseGetAllKeys(object, keys, getSymbols);
	}

	module.exports = getAllKeys;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayPush = __webpack_require__(2),
	    isArray = __webpack_require__(14);

	/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	  var result = keysFunc(object);
	  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
	}

	module.exports = baseGetAllKeys;


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayFilter = __webpack_require__(129),
	    stubArray = __webpack_require__(130);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
	  if (object == null) {
	    return [];
	  }
	  object = Object(object);
	  return arrayFilter(nativeGetSymbols(object), function(symbol) {
	    return propertyIsEnumerable.call(object, symbol);
	  });
	};

	module.exports = getSymbols;


/***/ }),
/* 129 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `_.filter` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function arrayFilter(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      resIndex = 0,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (predicate(value, index, array)) {
	      result[resIndex++] = value;
	    }
	  }
	  return result;
	}

	module.exports = arrayFilter;


/***/ }),
/* 130 */
/***/ (function(module, exports) {

	/**
	 * This method returns a new empty array.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {Array} Returns the new empty array.
	 * @example
	 *
	 * var arrays = _.times(2, _.stubArray);
	 *
	 * console.log(arrays);
	 * // => [[], []]
	 *
	 * console.log(arrays[0] === arrays[1]);
	 * // => false
	 */
	function stubArray() {
	  return [];
	}

	module.exports = stubArray;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayLikeKeys = __webpack_require__(132),
	    baseKeys = __webpack_require__(142),
	    isArrayLike = __webpack_require__(146);

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}

	module.exports = keys;


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

	var baseTimes = __webpack_require__(133),
	    isArguments = __webpack_require__(8),
	    isArray = __webpack_require__(14),
	    isBuffer = __webpack_require__(134),
	    isIndex = __webpack_require__(136),
	    isTypedArray = __webpack_require__(137);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  var isArr = isArray(value),
	      isArg = !isArr && isArguments(value),
	      isBuff = !isArr && !isArg && isBuffer(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? baseTimes(value.length, String) : [],
	      length = result.length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           isIndex(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = arrayLikeKeys;


/***/ }),
/* 133 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	module.exports = baseTimes;


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(6),
	    stubFalse = __webpack_require__(135);

	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse;

	module.exports = isBuffer;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)(module)))

/***/ }),
/* 135 */
/***/ (function(module, exports) {

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}

	module.exports = stubFalse;


/***/ }),
/* 136 */
/***/ (function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}

	module.exports = isIndex;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsTypedArray = __webpack_require__(138),
	    baseUnary = __webpack_require__(140),
	    nodeUtil = __webpack_require__(141);

	/* Node.js helper references. */
	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

	module.exports = isTypedArray;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(10),
	    isLength = __webpack_require__(139),
	    isObjectLike = __webpack_require__(13);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	typedArrayTags[errorTag] = typedArrayTags[funcTag] =
	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	typedArrayTags[setTag] = typedArrayTags[stringTag] =
	typedArrayTags[weakMapTag] = false;

	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike(value) &&
	    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
	}

	module.exports = baseIsTypedArray;


/***/ }),
/* 139 */
/***/ (function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	module.exports = isLength;


/***/ }),
/* 140 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	module.exports = baseUnary;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(7);

	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());

	module.exports = nodeUtil;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)(module)))

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

	var isPrototype = __webpack_require__(143),
	    nativeKeys = __webpack_require__(144);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!isPrototype(object)) {
	    return nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = baseKeys;


/***/ }),
/* 143 */
/***/ (function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

	  return value === proto;
	}

	module.exports = isPrototype;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(145);

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = overArg(Object.keys, Object);

	module.exports = nativeKeys;


/***/ }),
/* 145 */
/***/ (function(module, exports) {

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	module.exports = overArg;


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(44),
	    isLength = __webpack_require__(139);

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}

	module.exports = isArrayLike;


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

	var DataView = __webpack_require__(148),
	    Map = __webpack_require__(62),
	    Promise = __webpack_require__(149),
	    Set = __webpack_require__(150),
	    WeakMap = __webpack_require__(151),
	    baseGetTag = __webpack_require__(10),
	    toSource = __webpack_require__(48);

	/** `Object#toString` result references. */
	var mapTag = '[object Map]',
	    objectTag = '[object Object]',
	    promiseTag = '[object Promise]',
	    setTag = '[object Set]',
	    weakMapTag = '[object WeakMap]';

	var dataViewTag = '[object DataView]';

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView),
	    mapCtorString = toSource(Map),
	    promiseCtorString = toSource(Promise),
	    setCtorString = toSource(Set),
	    weakMapCtorString = toSource(WeakMap);

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = baseGetTag;

	// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	    (Map && getTag(new Map) != mapTag) ||
	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
	    (Set && getTag(new Set) != setTag) ||
	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
	  getTag = function(value) {
	    var result = baseGetTag(value),
	        Ctor = result == objectTag ? value.constructor : undefined,
	        ctorString = Ctor ? toSource(Ctor) : '';

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag;
	        case mapCtorString: return mapTag;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag;
	        case weakMapCtorString: return weakMapTag;
	      }
	    }
	    return result;
	  };
	}

	module.exports = getTag;


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(42),
	    root = __webpack_require__(6);

	/* Built-in method references that are verified to be native. */
	var DataView = getNative(root, 'DataView');

	module.exports = DataView;


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(42),
	    root = __webpack_require__(6);

	/* Built-in method references that are verified to be native. */
	var Promise = getNative(root, 'Promise');

	module.exports = Promise;


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(42),
	    root = __webpack_require__(6);

	/* Built-in method references that are verified to be native. */
	var Set = getNative(root, 'Set');

	module.exports = Set;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(42),
	    root = __webpack_require__(6);

	/* Built-in method references that are verified to be native. */
	var WeakMap = getNative(root, 'WeakMap');

	module.exports = WeakMap;


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

	var isStrictComparable = __webpack_require__(153),
	    keys = __webpack_require__(131);

	/**
	 * Gets the property names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = keys(object),
	      length = result.length;

	  while (length--) {
	    var key = result[length],
	        value = object[key];

	    result[length] = [key, value, isStrictComparable(value)];
	  }
	  return result;
	}

	module.exports = getMatchData;


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(45);

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject(value);
	}

	module.exports = isStrictComparable;


/***/ }),
/* 154 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `matchesProperty` for source values suitable
	 * for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function matchesStrictComparable(key, srcValue) {
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    return object[key] === srcValue &&
	      (srcValue !== undefined || (key in Object(object)));
	  };
	}

	module.exports = matchesStrictComparable;


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(113),
	    get = __webpack_require__(29),
	    hasIn = __webpack_require__(156),
	    isKey = __webpack_require__(32),
	    isStrictComparable = __webpack_require__(153),
	    matchesStrictComparable = __webpack_require__(154),
	    toKey = __webpack_require__(72);

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1,
	    COMPARE_UNORDERED_FLAG = 2;

	/**
	 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  if (isKey(path) && isStrictComparable(srcValue)) {
	    return matchesStrictComparable(toKey(path), srcValue);
	  }
	  return function(object) {
	    var objValue = get(object, path);
	    return (objValue === undefined && objValue === srcValue)
	      ? hasIn(object, path)
	      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
	  };
	}

	module.exports = baseMatchesProperty;


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

	var baseHasIn = __webpack_require__(157),
	    hasPath = __webpack_require__(158);

	/**
	 * Checks if `path` is a direct or inherited property of `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 * @example
	 *
	 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
	 *
	 * _.hasIn(object, 'a');
	 * // => true
	 *
	 * _.hasIn(object, 'a.b');
	 * // => true
	 *
	 * _.hasIn(object, ['a', 'b']);
	 * // => true
	 *
	 * _.hasIn(object, 'b');
	 * // => false
	 */
	function hasIn(object, path) {
	  return object != null && hasPath(object, path, baseHasIn);
	}

	module.exports = hasIn;


/***/ }),
/* 157 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.hasIn` without support for deep paths.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHasIn(object, key) {
	  return object != null && key in Object(object);
	}

	module.exports = baseHasIn;


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

	var castPath = __webpack_require__(31),
	    isArguments = __webpack_require__(8),
	    isArray = __webpack_require__(14),
	    isIndex = __webpack_require__(136),
	    isLength = __webpack_require__(139),
	    toKey = __webpack_require__(72);

	/**
	 * Checks if `path` exists on `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @param {Function} hasFunc The function to check properties.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 */
	function hasPath(object, path, hasFunc) {
	  path = castPath(path, object);

	  var index = -1,
	      length = path.length,
	      result = false;

	  while (++index < length) {
	    var key = toKey(path[index]);
	    if (!(result = object != null && hasFunc(object, key))) {
	      break;
	    }
	    object = object[key];
	  }
	  if (result || ++index != length) {
	    return result;
	  }
	  length = object == null ? 0 : object.length;
	  return !!length && isLength(length) && isIndex(key, length) &&
	    (isArray(object) || isArguments(object));
	}

	module.exports = hasPath;


/***/ }),
/* 159 */
/***/ (function(module, exports) {

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	module.exports = identity;


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(161),
	    basePropertyDeep = __webpack_require__(162),
	    isKey = __webpack_require__(32),
	    toKey = __webpack_require__(72);

	/**
	 * Creates a function that returns the value at `path` of a given object.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': 2 } },
	 *   { 'a': { 'b': 1 } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b'));
	 * // => [2, 1]
	 *
	 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
	 * // => [1, 2]
	 */
	function property(path) {
	  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
	}

	module.exports = property;


/***/ }),
/* 161 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	module.exports = baseProperty;


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(30);

	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function basePropertyDeep(path) {
	  return function(object) {
	    return baseGet(object, path);
	  };
	}

	module.exports = basePropertyDeep;


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

	var baseFindIndex = __webpack_require__(164),
	    baseIteratee = __webpack_require__(104),
	    toInteger = __webpack_require__(165);

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * This method is like `_.find` except that it returns the index of the first
	 * element `predicate` returns truthy for instead of the element itself.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.1.0
	 * @category Array
	 * @param {Array} array The array to inspect.
	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
	 * @param {number} [fromIndex=0] The index to search from.
	 * @returns {number} Returns the index of the found element, else `-1`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'active': false },
	 *   { 'user': 'fred',    'active': false },
	 *   { 'user': 'pebbles', 'active': true }
	 * ];
	 *
	 * _.findIndex(users, function(o) { return o.user == 'barney'; });
	 * // => 0
	 *
	 * // The `_.matches` iteratee shorthand.
	 * _.findIndex(users, { 'user': 'fred', 'active': false });
	 * // => 1
	 *
	 * // The `_.matchesProperty` iteratee shorthand.
	 * _.findIndex(users, ['active', false]);
	 * // => 0
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.findIndex(users, 'active');
	 * // => 2
	 */
	function findIndex(array, predicate, fromIndex) {
	  var length = array == null ? 0 : array.length;
	  if (!length) {
	    return -1;
	  }
	  var index = fromIndex == null ? 0 : toInteger(fromIndex);
	  if (index < 0) {
	    index = nativeMax(length + index, 0);
	  }
	  return baseFindIndex(array, baseIteratee(predicate, 3), index);
	}

	module.exports = findIndex;


/***/ }),
/* 164 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 1 : -1);

	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}

	module.exports = baseFindIndex;


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

	var toFinite = __webpack_require__(166);

	/**
	 * Converts `value` to an integer.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted integer.
	 * @example
	 *
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 */
	function toInteger(value) {
	  var result = toFinite(value),
	      remainder = result % 1;

	  return result === result ? (remainder ? result - remainder : result) : 0;
	}

	module.exports = toInteger;


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

	var toNumber = __webpack_require__(167);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0,
	    MAX_INTEGER = 1.7976931348623157e+308;

	/**
	 * Converts `value` to a finite number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.12.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted number.
	 * @example
	 *
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 */
	function toFinite(value) {
	  if (!value) {
	    return value === 0 ? value : 0;
	  }
	  value = toNumber(value);
	  if (value === INFINITY || value === -INFINITY) {
	    var sign = (value < 0 ? -1 : 1);
	    return sign * MAX_INTEGER;
	  }
	  return value === value ? value : 0;
	}

	module.exports = toFinite;


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(45),
	    isSymbol = __webpack_require__(33);

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	module.exports = toNumber;


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.































	runSemanticValidators = runSemanticValidators;var _concat = __webpack_require__(1);var _concat2 = _interopRequireDefault(_concat);var _reduce = __webpack_require__(169);var _reduce2 = _interopRequireDefault(_reduce);var _isArray = __webpack_require__(14);var _isArray2 = _interopRequireDefault(_isArray);var _pathTranslator = __webpack_require__(28);var _assign = __webpack_require__(177);var _assign2 = _interopRequireDefault(_assign);var _getTimestamp = __webpack_require__(191);var _getTimestamp2 = _interopRequireDefault(_getTimestamp);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var request = __webpack_require__(192);var semanticValidators = [];var LOG_SEMVAL_PERF = (null) !== "production";request.keys().forEach(function (key) {if (key === "./hook.js") {return;}if (!key.match(/js$/)) {return;}if (key.slice(2).indexOf("/") > -1) {// skip files in subdirs
	    return;}semanticValidators.push({ name: toTitleCase(key).replace(".js", "").replace("./", ""), validate: request(key).validate });});function runSemanticValidators(_ref) {var jsSpec = _ref.jsSpec,resolvedSpec = _ref.resolvedSpec,getLineNumberForPath = _ref.getLineNumberForPath,specStr = _ref.specStr;var semanticValidatorsOutput = semanticValidators.map(function (sv) {
	    if (LOG_SEMVAL_PERF) {
	      var t0 = (0, _getTimestamp2.default)();
	    }

	    var res;

	    try {
	      res = sv.validate({
	        jsSpec: (0, _assign2.default)({}, jsSpec),
	        specStr: specStr,
	        resolvedSpec: (0, _assign2.default)({}, resolvedSpec) });


	    } catch (e) {
	      console.error("Semantic validator " + sv.name + " had a problem: ", e);
	      res = {
	        errors: [],
	        warnings: [] };

	    }

	    if (LOG_SEMVAL_PERF) {
	      var t1 = (0, _getTimestamp2.default)();
	      // eslint-disable-next-line no-console
	      console.log("SemVal: " + sv.name + " took " + Math.ceil(t1 * 10 - t0 * 10) / 10 + "ms");
	    }

	    res.errors.forEach(function (err) {
	      // transform path strings into line numbers! it's magic!
	      if (err.path && !err.line) {
	        err.line = getLineNumberForPath((0, _isArray2.default)(err.path) ? err.path : (0, _pathTranslator.transformPathToArray)(err.path, jsSpec));
	      }
	    });

	    res.warnings.forEach(function (err) {
	      // transform path strings into line numbers! it's magic!
	      if (err.path && !err.line) {
	        err.line = getLineNumberForPath((0, _isArray2.default)(err.path) ? err.path : (0, _pathTranslator.transformPathToArray)(err.path, jsSpec));
	      }
	    });

	    res.name = sv.name;
	    return res;
	  });

	  var flattenedOutput = (0, _reduce2.default)(semanticValidatorsOutput, function (res, val) {
	    var errors = val.errors.map(function (err) {
	      err.source = "semantic";
	      err.level = "error";
	      return err;
	    });

	    var warnings = val.warnings.map(function (warning) {
	      warning.source = "semantic";
	      warning.level = "warning";
	      return warning;
	    });

	    return (0, _concat2.default)(res, errors, warnings);
	  }, []);

	  return flattenedOutput;

	}

	function toTitleCase(str) {
	  return str.
	  split("-").
	  map(function (substr) {return substr[0].toUpperCase() + substr.slice(1);}).
	  join("");
	}

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayReduce = __webpack_require__(170),
	    baseEach = __webpack_require__(171),
	    baseIteratee = __webpack_require__(104),
	    baseReduce = __webpack_require__(176),
	    isArray = __webpack_require__(14);

	/**
	 * Reduces `collection` to a value which is the accumulated result of running
	 * each element in `collection` thru `iteratee`, where each successive
	 * invocation is supplied the return value of the previous. If `accumulator`
	 * is not given, the first element of `collection` is used as the initial
	 * value. The iteratee is invoked with four arguments:
	 * (accumulator, value, index|key, collection).
	 *
	 * Many lodash methods are guarded to work as iteratees for methods like
	 * `_.reduce`, `_.reduceRight`, and `_.transform`.
	 *
	 * The guarded methods are:
	 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
	 * and `sortBy`
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @returns {*} Returns the accumulated value.
	 * @see _.reduceRight
	 * @example
	 *
	 * _.reduce([1, 2], function(sum, n) {
	 *   return sum + n;
	 * }, 0);
	 * // => 3
	 *
	 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
	 *   (result[value] || (result[value] = [])).push(key);
	 *   return result;
	 * }, {});
	 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
	 */
	function reduce(collection, iteratee, accumulator) {
	  var func = isArray(collection) ? arrayReduce : baseReduce,
	      initAccum = arguments.length < 3;

	  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
	}

	module.exports = reduce;


/***/ }),
/* 170 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `_.reduce` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @param {boolean} [initAccum] Specify using the first element of `array` as
	 *  the initial value.
	 * @returns {*} Returns the accumulated value.
	 */
	function arrayReduce(array, iteratee, accumulator, initAccum) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  if (initAccum && length) {
	    accumulator = array[++index];
	  }
	  while (++index < length) {
	    accumulator = iteratee(accumulator, array[index], index, array);
	  }
	  return accumulator;
	}

	module.exports = arrayReduce;


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

	var baseForOwn = __webpack_require__(172),
	    createBaseEach = __webpack_require__(175);

	/**
	 * The base implementation of `_.forEach` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object} Returns `collection`.
	 */
	var baseEach = createBaseEach(baseForOwn);

	module.exports = baseEach;


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(173),
	    keys = __webpack_require__(131);

	/**
	 * The base implementation of `_.forOwn` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return object && baseFor(object, iteratee, keys);
	}

	module.exports = baseForOwn;


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(174);

	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();

	module.exports = baseFor;


/***/ }),
/* 174 */
/***/ (function(module, exports) {

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	module.exports = createBaseFor;


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(146);

	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    if (collection == null) {
	      return collection;
	    }
	    if (!isArrayLike(collection)) {
	      return eachFunc(collection, iteratee);
	    }
	    var length = collection.length,
	        index = fromRight ? length : -1,
	        iterable = Object(collection);

	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}

	module.exports = createBaseEach;


/***/ }),
/* 176 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.reduce` and `_.reduceRight`, without support
	 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} accumulator The initial value.
	 * @param {boolean} initAccum Specify using the first or last element of
	 *  `collection` as the initial value.
	 * @param {Function} eachFunc The function to iterate over `collection`.
	 * @returns {*} Returns the accumulated value.
	 */
	function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
	  eachFunc(collection, function(value, index, collection) {
	    accumulator = initAccum
	      ? (initAccum = false, value)
	      : iteratee(accumulator, value, index, collection);
	  });
	  return accumulator;
	}

	module.exports = baseReduce;


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

	var assignValue = __webpack_require__(178),
	    copyObject = __webpack_require__(181),
	    createAssigner = __webpack_require__(182),
	    isArrayLike = __webpack_require__(146),
	    isPrototype = __webpack_require__(143),
	    keys = __webpack_require__(131);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Assigns own enumerable string keyed properties of source objects to the
	 * destination object. Source objects are applied from left to right.
	 * Subsequent sources overwrite property assignments of previous sources.
	 *
	 * **Note:** This method mutates `object` and is loosely based on
	 * [`Object.assign`](https://mdn.io/Object/assign).
	 *
	 * @static
	 * @memberOf _
	 * @since 0.10.0
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @see _.assignIn
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * function Bar() {
	 *   this.c = 3;
	 * }
	 *
	 * Foo.prototype.b = 2;
	 * Bar.prototype.d = 4;
	 *
	 * _.assign({ 'a': 0 }, new Foo, new Bar);
	 * // => { 'a': 1, 'c': 3 }
	 */
	var assign = createAssigner(function(object, source) {
	  if (isPrototype(source) || isArrayLike(source)) {
	    copyObject(source, keys(source), object);
	    return;
	  }
	  for (var key in source) {
	    if (hasOwnProperty.call(source, key)) {
	      assignValue(object, key, source[key]);
	    }
	  }
	});

	module.exports = assign;


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

	var baseAssignValue = __webpack_require__(179),
	    eq = __webpack_require__(58);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}

	module.exports = assignValue;


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

	var defineProperty = __webpack_require__(180);

	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && defineProperty) {
	    defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}

	module.exports = baseAssignValue;


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(42);

	var defineProperty = (function() {
	  try {
	    var func = getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());

	module.exports = defineProperty;


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

	var assignValue = __webpack_require__(178),
	    baseAssignValue = __webpack_require__(179);

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;

	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      baseAssignValue(object, key, newValue);
	    } else {
	      assignValue(object, key, newValue);
	    }
	  }
	  return object;
	}

	module.exports = copyObject;


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

	var baseRest = __webpack_require__(183),
	    isIterateeCall = __webpack_require__(190);

	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;

	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;

	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}

	module.exports = createAssigner;


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(159),
	    overRest = __webpack_require__(184),
	    setToString = __webpack_require__(186);

	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return setToString(overRest(func, start, identity), func + '');
	}

	module.exports = baseRest;


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

	var apply = __webpack_require__(185);

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);

	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return apply(func, this, otherArgs);
	  };
	}

	module.exports = overRest;


/***/ }),
/* 185 */
/***/ (function(module, exports) {

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}

	module.exports = apply;


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

	var baseSetToString = __webpack_require__(187),
	    shortOut = __webpack_require__(189);

	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = shortOut(baseSetToString);

	module.exports = setToString;


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

	var constant = __webpack_require__(188),
	    defineProperty = __webpack_require__(180),
	    identity = __webpack_require__(159);

	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !defineProperty ? identity : function(func, string) {
	  return defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant(string),
	    'writable': true
	  });
	};

	module.exports = baseSetToString;


/***/ }),
/* 188 */
/***/ (function(module, exports) {

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	module.exports = constant;


/***/ }),
/* 189 */
/***/ (function(module, exports) {

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800,
	    HOT_SPAN = 16;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeNow = Date.now;

	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
	  var count = 0,
	      lastCalled = 0;

	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);

	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}

	module.exports = shortOut;


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(58),
	    isArrayLike = __webpack_require__(146),
	    isIndex = __webpack_require__(136),
	    isObject = __webpack_require__(45);

	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike(object) && isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq(object[index], value);
	  }
	  return false;
	}

	module.exports = isIterateeCall;


/***/ }),
/* 191 */
/***/ (function(module, exports) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = getTimestamp;function getTimestamp() {
	  if (typeof performance !== "undefined" && performance.now) {
	    return performance.now();
	  } else if (typeof self.performance !== "undefined" && self.performance.now) {
	    return self.performance.now();
	  } else {
	    return Date.now();
	  }
	}

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

	var map = {
		"./dummy.js": 193,
		"./form-data.js": 194,
		"./items-required-for-array-objects.js": 195,
		"./operation-ids.js": 196,
		"./operations.js": 222,
		"./parameters.js": 230,
		"./paths.js": 231,
		"./refs.js": 232,
		"./schema.js": 246,
		"./security-definitions.js": 247,
		"./security.js": 248,
		"./walker.js": 249
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 192;


/***/ }),
/* 193 */
/***/ (function(module, exports) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.
	validate = validate; /* eslint-disable */function validate(_ref) {var jsSpec = _ref.jsSpec;
	  var errors = [];
	  var warnings = [];

	  // do stuff

	  return { errors: errors, warnings: warnings };
	}

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};exports.





















	validate = validate;var _isObject = __webpack_require__(45);var _isObject2 = _interopRequireDefault(_isObject);var _get = __webpack_require__(29);var _get2 = _interopRequireDefault(_get);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} // Assertions are in the following order ( bailing as soon as we hit the firs assertion )
	//
	// Assertation typo
	// If a paramter with `in: formdata` exists, warn about typo ( it should be formData )
	// Assertation 1
	// If a paramter with `in: formData` exists, a param with `in: body` cannot
	// Assertation 2:
	// If a parameter with `type: file` exists
	// - It must have `in: formData`
	// - The consumes property must have `multipart/form-data`
	// Assertation 3:
	// If a parameter with `in: formData` exists a consumes property ( inherited or inline ) my contain `application/x-www-form-urlencoded` or `multipart/form-data`
	function validate(_ref) {var resolvedSpec = _ref.resolvedSpec;var errors = [];var warnings = [];if (!(0, _isObject2.default)(resolvedSpec)) {return;} // Looking for...
	  // Parameters ( /paths/{method}/parameters or /parameters)
	  // - in: formData
	  // - type: file
	  function walk(obj, path) {path = path || [];if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object" || obj === null) {return;}
	    // Inside a parameter array ( under an operation or pathitem )
	    // NOTE: What if we want to add a body, with multipart/form-data? Not possible right?
	    if ((path[0] === "paths" || path[0] === "pathitems") && path[path.length - 1] === "parameters" && Array.isArray(obj)) {
	      var opPath = path.slice(0, path.length - 1);
	      var opItem = (0, _get2.default)(resolvedSpec, opPath);

	      // Check for formdata ( typos )
	      assertationTypo(obj, path);

	      return (
	        // assertationOne(obj, path)
	        assertationTwo(obj, path, opItem) ||
	        assertationThree(obj, path, opItem));

	    }

	    // Parameters under the root `/parameters` property
	    if (path[0] === "parameters" && path.length === 2 && Array.isArray(obj)) {
	      // Check for formdata ( typos )
	      assertationTypo(obj, path);
	      // return assertationOne(obj, path)
	    }

	    // Continue to walk the object tree
	    var keys = Object.keys(obj);
	    if (keys) {
	      return keys.map(function (k) {return walk(obj[k], [].concat(_toConsumableArray(path), [k]));});
	    } else {
	      return null;
	    }

	  }

	  // Checks the operation for the presences of a consumes
	  function hasConsumes(operation, consumes) {
	    return (0, _isObject2.default)(operation) && Array.isArray(operation.consumes) && operation.consumes.some(function (c) {return c === consumes;});
	  }

	  // Warn about a typo, formdata => formData
	  function assertationTypo(params, path) {
	    var formDataWithTypos = params.filter(function (p) {return (0, _isObject2.default)(p) && p["in"] === "formdata";});

	    if (formDataWithTypos.length) {
	      return errors = errors.concat(params.map(function (param, i) {
	        if (param["in"] !== "formdata") {
	          return;
	        }
	        var pathStr = path.join(".") + "." + i;
	        return {
	          path: pathStr,
	          message: "Parameter \"in: formdata\" is invalid, did you mean \"in: formData\" ( camelCase )?" };

	      }));
	    }
	  }

	  // If a paramter with `in: formData` exists, a param with `in: body` cannot
	  // eslint-disable-next-line no-unused-vars
	  function assertationOne(params, path) {
	    // Assertion 1
	    var inBodyIndex = params.findIndex(function (p) {return (0, _isObject2.default)(p) && p["in"] === "body";});
	    var formData = params.filter(function (p) {return (0, _isObject2.default)(p) && p["in"] === "formData";});
	    var hasFormData = !!formData.length;

	    if (~inBodyIndex && hasFormData) {
	      // We"ll blame the `in: body` parameter
	      var pathStr = path.join(".") + "." + inBodyIndex;
	      return errors.push({
	        path: pathStr,
	        message: "Parameters cannot have both a \"in: body\" and \"in: formData\", as \"formData\" _will_ be the body" });

	    }
	  }

	  // If a parameter with `type: file` exists
	  // - a. It must have `in: formData`
	  // - b. The consumes property must have `multipart/form-data`
	  function assertationTwo(params, path, operation) {
	    var typeFileIndex = params.findIndex(function (p) {return (0, _isObject2.default)(p) && p.type === "file";});
	    // No type: file?
	    if (!~typeFileIndex) {
	      return;
	    }
	    var hasErrors = false;

	    var param = params[typeFileIndex];
	    var pathStr = [].concat(_toConsumableArray(path), [typeFileIndex]).join(".");
	    // a - must have formData
	    if (param["in"] !== "formData") {
	      errors.push({
	        path: pathStr,
	        message: "Parameters with \"type: file\" must have \"in: formData\"" });

	      hasErrors = true;
	    }

	    // - b. The consumes property must have `multipart/form-data`
	    if (!hasConsumes(operation, "multipart/form-data")) {
	      errors.push({
	        path: pathStr,
	        message: "Operations with Parameters of \"type: file\" must include \"multipart/form-data\" in their \"consumes\" property" });

	      hasErrors = true;
	    }

	    return hasErrors;
	  }

	  // If a parameter with `in: formData` exists, a consumes property ( inherited or inline ) my contain `application/x-www-form-urlencoded` or `multipart/form-data`
	  function assertationThree(params, path, operation) {
	    var hasFormData = params.some(function (p) {return (0, _isObject2.default)(p) && p["in"] === "formData";});

	    if (!hasFormData) {
	      return;
	    }

	    if (hasConsumes(operation, "multipart/form-data") || hasConsumes(operation, "application/x-www-form-urlencoded")) {
	      return;
	    }

	    var pathStr = path.slice(0, -1).join("."); // Blame the operation, not the parameter0
	    return errors.push({
	      path: pathStr,
	      message: "Operations with Parameters of \"in: formData\" must include \"application/x-www-form-urlencoded\" or \"multipart/form-data\" in their \"consumes\" property" });


	  }

	  walk(resolvedSpec, []);
	  return { errors: errors, warnings: warnings };
	}

/***/ }),
/* 195 */
/***/ (function(module, exports) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};exports.









	validate = validate;function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} // Assertation 1:
	// The items property for Schema Objects, or schema-like objects (non-body parameters), is required when type is set to array
	// Assertation 2:
	// The required properties for a Schema Object must be defined in the object or one of its ancestors.
	// Assertation 3:
	// The default property for Schema Objects, or schema-like objects (non-body parameters), must validate against the respective JSON Schema
	function validate(_ref) {var resolvedSpec = _ref.resolvedSpec;var errors = [];var warnings = [];function walk(obj, path) {if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object" || obj === null) {return;
	    }

	    if (path[path.length - 1] === "schema" || path[path.length - 2] === "definitions") {
	      // if parent is 'schema', or we're in a model definition

	      // Assertation 1
	      if (obj.type === "array" && _typeof(obj.items) !== "object") {
	        errors.push({
	          path: path.join("."),
	          message: "Schema objects with 'array' type require an 'items' property" });

	      }

	      // Assertation 2
	      if (Array.isArray(obj.required)) {
	        obj.required.forEach(function (requiredProp, i) {
	          if (!obj.properties || !obj.properties[requiredProp]) {
	            var pathStr = path.concat(["required[" + i + "]"]).join(".");
	            errors.push({
	              path: pathStr,
	              message: "Schema properties specified as 'required' must be defined" });

	          }
	        });
	      }

	    }

	    if (path[path.length - 2] === "headers") {
	      if (obj.type === "array" && _typeof(obj.items) !== "object") {
	        errors.push({
	          path: path,
	          message: "Headers with 'array' type require an 'items' property" });

	      }
	    }

	    if (Object.keys(obj).length) {
	      return Object.keys(obj).map(function (k) {return walk(obj[k], [].concat(_toConsumableArray(path), [k]));});

	    } else {
	      return null;
	    }

	  }

	  walk(resolvedSpec, []);

	  return { errors: errors, warnings: warnings };
	}

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.






	validate = validate;var _pickBy = __webpack_require__(197);var _pickBy2 = _interopRequireDefault(_pickBy);var _reduce = __webpack_require__(169);var _reduce2 = _interopRequireDefault(_reduce);var _merge = __webpack_require__(206);var _merge2 = _interopRequireDefault(_merge);var _each = __webpack_require__(218);var _each2 = _interopRequireDefault(_each);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} // Assertation 1: Operations must have a unique operationId.
	function validate(_ref) {var jsSpec = _ref.jsSpec;var errors = [];
	  var warnings = [];

	  var validOperationKeys = ["get", "head", "post", "put", "patch", "delete", "options"];

	  var operations = (0, _reduce2.default)(jsSpec.paths, function (arr, path, pathKey) {
	    var pathOps = (0, _pickBy2.default)(path, function (obj, k) {
	      return validOperationKeys.indexOf(k) > -1;
	    });
	    (0, _each2.default)(pathOps, function (op, opKey) {return arr.push((0, _merge2.default)({
	        path: "paths." + pathKey + "." + opKey },
	      op));});
	    return arr;
	  }, []);

	  var seenOperationIds = {};

	  var tallyOperationId = function tallyOperationId(operationId) {
	    var prev = seenOperationIds[operationId];
	    seenOperationIds[operationId] = true;
	    // returns if it was previously seen
	    return !!prev;
	  };

	  operations.forEach(function (op) {
	    // wrap in an if, since operationIds are not required
	    if (op.operationId) {
	      var hasBeenSeen = tallyOperationId(op.operationId);
	      if (hasBeenSeen) {
	        errors.push({
	          path: op.path + ".operationId",
	          message: "operationIds must be unique" });

	      }
	    }
	  });

	  return { errors: errors, warnings: warnings };
	}

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayMap = __webpack_require__(71),
	    baseIteratee = __webpack_require__(104),
	    basePickBy = __webpack_require__(198),
	    getAllKeysIn = __webpack_require__(200);

	/**
	 * Creates an object composed of the `object` properties `predicate` returns
	 * truthy for. The predicate is invoked with two arguments: (value, key).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Object
	 * @param {Object} object The source object.
	 * @param {Function} [predicate=_.identity] The function invoked per property.
	 * @returns {Object} Returns the new object.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': '2', 'c': 3 };
	 *
	 * _.pickBy(object, _.isNumber);
	 * // => { 'a': 1, 'c': 3 }
	 */
	function pickBy(object, predicate) {
	  if (object == null) {
	    return {};
	  }
	  var props = arrayMap(getAllKeysIn(object), function(prop) {
	    return [prop];
	  });
	  predicate = baseIteratee(predicate);
	  return basePickBy(object, props, function(value, path) {
	    return predicate(value, path[0]);
	  });
	}

	module.exports = pickBy;


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(30),
	    baseSet = __webpack_require__(199),
	    castPath = __webpack_require__(31);

	/**
	 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} paths The property paths to pick.
	 * @param {Function} predicate The function invoked per property.
	 * @returns {Object} Returns the new object.
	 */
	function basePickBy(object, paths, predicate) {
	  var index = -1,
	      length = paths.length,
	      result = {};

	  while (++index < length) {
	    var path = paths[index],
	        value = baseGet(object, path);

	    if (predicate(value, path)) {
	      baseSet(result, castPath(path, object), value);
	    }
	  }
	  return result;
	}

	module.exports = basePickBy;


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

	var assignValue = __webpack_require__(178),
	    castPath = __webpack_require__(31),
	    isIndex = __webpack_require__(136),
	    isObject = __webpack_require__(45),
	    toKey = __webpack_require__(72);

	/**
	 * The base implementation of `_.set`.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {Array|string} path The path of the property to set.
	 * @param {*} value The value to set.
	 * @param {Function} [customizer] The function to customize path creation.
	 * @returns {Object} Returns `object`.
	 */
	function baseSet(object, path, value, customizer) {
	  if (!isObject(object)) {
	    return object;
	  }
	  path = castPath(path, object);

	  var index = -1,
	      length = path.length,
	      lastIndex = length - 1,
	      nested = object;

	  while (nested != null && ++index < length) {
	    var key = toKey(path[index]),
	        newValue = value;

	    if (index != lastIndex) {
	      var objValue = nested[key];
	      newValue = customizer ? customizer(objValue, key, nested) : undefined;
	      if (newValue === undefined) {
	        newValue = isObject(objValue)
	          ? objValue
	          : (isIndex(path[index + 1]) ? [] : {});
	      }
	    }
	    assignValue(nested, key, newValue);
	    nested = nested[key];
	  }
	  return object;
	}

	module.exports = baseSet;


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetAllKeys = __webpack_require__(127),
	    getSymbolsIn = __webpack_require__(201),
	    keysIn = __webpack_require__(203);

	/**
	 * Creates an array of own and inherited enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeysIn(object) {
	  return baseGetAllKeys(object, keysIn, getSymbolsIn);
	}

	module.exports = getAllKeysIn;


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayPush = __webpack_require__(2),
	    getPrototype = __webpack_require__(202),
	    getSymbols = __webpack_require__(128),
	    stubArray = __webpack_require__(130);

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own and inherited enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
	  var result = [];
	  while (object) {
	    arrayPush(result, getSymbols(object));
	    object = getPrototype(object);
	  }
	  return result;
	};

	module.exports = getSymbolsIn;


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(145);

	/** Built-in value references. */
	var getPrototype = overArg(Object.getPrototypeOf, Object);

	module.exports = getPrototype;


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayLikeKeys = __webpack_require__(132),
	    baseKeysIn = __webpack_require__(204),
	    isArrayLike = __webpack_require__(146);

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
	}

	module.exports = keysIn;


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(45),
	    isPrototype = __webpack_require__(143),
	    nativeKeysIn = __webpack_require__(205);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn(object) {
	  if (!isObject(object)) {
	    return nativeKeysIn(object);
	  }
	  var isProto = isPrototype(object),
	      result = [];

	  for (var key in object) {
	    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = baseKeysIn;


/***/ }),
/* 205 */
/***/ (function(module, exports) {

	/**
	 * This function is like
	 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * except that it includes inherited enumerable properties.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function nativeKeysIn(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = nativeKeysIn;


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

	var baseMerge = __webpack_require__(207),
	    createAssigner = __webpack_require__(182);

	/**
	 * This method is like `_.assign` except that it recursively merges own and
	 * inherited enumerable string keyed properties of source objects into the
	 * destination object. Source properties that resolve to `undefined` are
	 * skipped if a destination value exists. Array and plain object properties
	 * are merged recursively. Other objects and value types are overridden by
	 * assignment. Source objects are applied from left to right. Subsequent
	 * sources overwrite property assignments of previous sources.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.5.0
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * var object = {
	 *   'a': [{ 'b': 2 }, { 'd': 4 }]
	 * };
	 *
	 * var other = {
	 *   'a': [{ 'c': 3 }, { 'e': 5 }]
	 * };
	 *
	 * _.merge(object, other);
	 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
	 */
	var merge = createAssigner(function(object, source, srcIndex) {
	  baseMerge(object, source, srcIndex);
	});

	module.exports = merge;


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(107),
	    assignMergeValue = __webpack_require__(208),
	    baseFor = __webpack_require__(173),
	    baseMergeDeep = __webpack_require__(209),
	    isObject = __webpack_require__(45),
	    keysIn = __webpack_require__(203);

	/**
	 * The base implementation of `_.merge` without support for multiple sources.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMerge(object, source, srcIndex, customizer, stack) {
	  if (object === source) {
	    return;
	  }
	  baseFor(source, function(srcValue, key) {
	    if (isObject(srcValue)) {
	      stack || (stack = new Stack);
	      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
	    }
	    else {
	      var newValue = customizer
	        ? customizer(object[key], srcValue, (key + ''), object, source, stack)
	        : undefined;

	      if (newValue === undefined) {
	        newValue = srcValue;
	      }
	      assignMergeValue(object, key, newValue);
	    }
	  }, keysIn);
	}

	module.exports = baseMerge;


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

	var baseAssignValue = __webpack_require__(179),
	    eq = __webpack_require__(58);

	/**
	 * This function is like `assignValue` except that it doesn't assign
	 * `undefined` values.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignMergeValue(object, key, value) {
	  if ((value !== undefined && !eq(object[key], value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}

	module.exports = assignMergeValue;


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

	var assignMergeValue = __webpack_require__(208),
	    cloneBuffer = __webpack_require__(210),
	    cloneTypedArray = __webpack_require__(211),
	    copyArray = __webpack_require__(15),
	    initCloneObject = __webpack_require__(213),
	    isArguments = __webpack_require__(8),
	    isArray = __webpack_require__(14),
	    isArrayLikeObject = __webpack_require__(215),
	    isBuffer = __webpack_require__(134),
	    isFunction = __webpack_require__(44),
	    isObject = __webpack_require__(45),
	    isPlainObject = __webpack_require__(216),
	    isTypedArray = __webpack_require__(137),
	    toPlainObject = __webpack_require__(217);

	/**
	 * A specialized version of `baseMerge` for arrays and objects which performs
	 * deep merges and tracks traversed objects enabling objects with circular
	 * references to be merged.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {string} key The key of the value to merge.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} mergeFunc The function to merge values.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	  var objValue = object[key],
	      srcValue = source[key],
	      stacked = stack.get(srcValue);

	  if (stacked) {
	    assignMergeValue(object, key, stacked);
	    return;
	  }
	  var newValue = customizer
	    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
	    : undefined;

	  var isCommon = newValue === undefined;

	  if (isCommon) {
	    var isArr = isArray(srcValue),
	        isBuff = !isArr && isBuffer(srcValue),
	        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

	    newValue = srcValue;
	    if (isArr || isBuff || isTyped) {
	      if (isArray(objValue)) {
	        newValue = objValue;
	      }
	      else if (isArrayLikeObject(objValue)) {
	        newValue = copyArray(objValue);
	      }
	      else if (isBuff) {
	        isCommon = false;
	        newValue = cloneBuffer(srcValue, true);
	      }
	      else if (isTyped) {
	        isCommon = false;
	        newValue = cloneTypedArray(srcValue, true);
	      }
	      else {
	        newValue = [];
	      }
	    }
	    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
	      newValue = objValue;
	      if (isArguments(objValue)) {
	        newValue = toPlainObject(objValue);
	      }
	      else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
	        newValue = initCloneObject(srcValue);
	      }
	    }
	    else {
	      isCommon = false;
	    }
	  }
	  if (isCommon) {
	    // Recursively merge objects and arrays (susceptible to call stack limits).
	    stack.set(srcValue, newValue);
	    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
	    stack['delete'](srcValue);
	  }
	  assignMergeValue(object, key, newValue);
	}

	module.exports = baseMergeDeep;


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(6);

	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined,
	    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var length = buffer.length,
	      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

	  buffer.copy(result);
	  return result;
	}

	module.exports = cloneBuffer;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)(module)))

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

	var cloneArrayBuffer = __webpack_require__(212);

	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray(typedArray, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}

	module.exports = cloneTypedArray;


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

	var Uint8Array = __webpack_require__(122);

	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	  return result;
	}

	module.exports = cloneArrayBuffer;


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

	var baseCreate = __webpack_require__(214),
	    getPrototype = __webpack_require__(202),
	    isPrototype = __webpack_require__(143);

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !isPrototype(object))
	    ? baseCreate(getPrototype(object))
	    : {};
	}

	module.exports = initCloneObject;


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(45);

	/** Built-in value references. */
	var objectCreate = Object.create;

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} proto The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	var baseCreate = (function() {
	  function object() {}
	  return function(proto) {
	    if (!isObject(proto)) {
	      return {};
	    }
	    if (objectCreate) {
	      return objectCreate(proto);
	    }
	    object.prototype = proto;
	    var result = new object;
	    object.prototype = undefined;
	    return result;
	  };
	}());

	module.exports = baseCreate;


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(146),
	    isObjectLike = __webpack_require__(13);

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}

	module.exports = isArrayLikeObject;


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(10),
	    getPrototype = __webpack_require__(202),
	    isObjectLike = __webpack_require__(13);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString.call(Ctor) == objectCtorString;
	}

	module.exports = isPlainObject;


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

	var copyObject = __webpack_require__(181),
	    keysIn = __webpack_require__(203);

	/**
	 * Converts `value` to a plain object flattening inherited enumerable string
	 * keyed properties of `value` to own properties of the plain object.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {Object} Returns the converted plain object.
	 * @example
	 *
	 * function Foo() {
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.assign({ 'a': 1 }, new Foo);
	 * // => { 'a': 1, 'b': 2 }
	 *
	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	 * // => { 'a': 1, 'b': 2, 'c': 3 }
	 */
	function toPlainObject(value) {
	  return copyObject(value, keysIn(value));
	}

	module.exports = toPlainObject;


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(219);


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayEach = __webpack_require__(220),
	    baseEach = __webpack_require__(171),
	    castFunction = __webpack_require__(221),
	    isArray = __webpack_require__(14);

	/**
	 * Iterates over elements of `collection` and invokes `iteratee` for each element.
	 * The iteratee is invoked with three arguments: (value, index|key, collection).
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * **Note:** As with other "Collections" methods, objects with a "length"
	 * property are iterated like arrays. To avoid this behavior use `_.forIn`
	 * or `_.forOwn` for object iteration.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @alias each
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @returns {Array|Object} Returns `collection`.
	 * @see _.forEachRight
	 * @example
	 *
	 * _.forEach([1, 2], function(value) {
	 *   console.log(value);
	 * });
	 * // => Logs `1` then `2`.
	 *
	 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
	 *   console.log(key);
	 * });
	 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
	 */
	function forEach(collection, iteratee) {
	  var func = isArray(collection) ? arrayEach : baseEach;
	  return func(collection, castFunction(iteratee));
	}

	module.exports = forEach;


/***/ }),
/* 220 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `_.forEach` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	module.exports = arrayEach;


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(159);

	/**
	 * Casts `value` to `identity` if it's not a function.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {Function} Returns cast function.
	 */
	function castFunction(value) {
	  return typeof value == 'function' ? value : identity;
	}

	module.exports = castFunction;


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.









	validate = validate;var _pick = __webpack_require__(223);var _pick2 = _interopRequireDefault(_pick);var _map = __webpack_require__(227);var _map2 = _interopRequireDefault(_map);var _each = __webpack_require__(218);var _each2 = _interopRequireDefault(_each);var _findIndex = __webpack_require__(163);var _findIndex2 = _interopRequireDefault(_findIndex);var _findLastIndex = __webpack_require__(229);var _findLastIndex2 = _interopRequireDefault(_findLastIndex);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function validate(_ref) {var resolvedSpec = _ref.resolvedSpec;
	  var errors = [];
	  var warnings = [];

	  (0, _map2.default)(resolvedSpec.paths,
	  function (path, pathKey) {
	    var pathOps = (0, _pick2.default)(path, ["get", "head", "post", "put", "patch", "delete", "options"]);
	    (0, _each2.default)(pathOps, function (op, opKey) {

	      if (!op) {
	        return;
	      }

	      // Assertation 1
	      var bodyParamIndex = (0, _findIndex2.default)(op.parameters, ["in", "body"]);
	      var formDataParamIndex = (0, _findIndex2.default)(op.parameters, ["in", "formData"]);
	      if (bodyParamIndex > -1 && formDataParamIndex > -1) {
	        errors.push({
	          path: "paths." + pathKey + "." + opKey + ".parameters",
	          message: "Operations cannot have both a \"body\" parameter and \"formData\" parameter" });

	      }
	      // Assertation 2
	      var lastBodyParamIndex = (0, _findLastIndex2.default)(op.parameters, ["in", "body"]);
	      if (bodyParamIndex !== lastBodyParamIndex) {
	        errors.push({
	          path: "paths." + pathKey + "." + opKey + ".parameters",
	          message: "Operations must have no more than one body parameter" });

	      }

	      // Assertation 3
	      (0, _each2.default)(op.parameters, function (param, paramIndex) {
	        var nameAndInComboIndex = (0, _findIndex2.default)(op.parameters, { "name": param.name, "in": param.in });
	        // comparing the current index against the first found index is good, because
	        // it cuts down on error quantity when only two parameters are involved,
	        // i.e. if param1 and param2 conflict, this will only complain about param2.
	        // it also will favor complaining about parameters later in the spec, which
	        // makes more sense to the user.
	        if (paramIndex !== nameAndInComboIndex) {
	          errors.push({
	            path: "paths." + pathKey + "." + opKey + ".parameters[" + paramIndex + "]",
	            message: "Operation parameters must have unique 'name' + 'in' properties" });

	        }
	      });
	    });
	  });

	  return { errors: errors, warnings: warnings };
	} // Assertation 1: Operations cannot have both a 'body' parameter and a 'formData' parameter.
	// Assertation 2: Operations must have only one body parameter.
	// Assertation 3: Operations must have unique (name + in combination) parameters.

/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

	var basePick = __webpack_require__(224),
	    flatRest = __webpack_require__(225);

	/**
	 * Creates an object composed of the picked `object` properties.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The source object.
	 * @param {...(string|string[])} [paths] The property paths to pick.
	 * @returns {Object} Returns the new object.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': '2', 'c': 3 };
	 *
	 * _.pick(object, ['a', 'c']);
	 * // => { 'a': 1, 'c': 3 }
	 */
	var pick = flatRest(function(object, paths) {
	  return object == null ? {} : basePick(object, paths);
	});

	module.exports = pick;


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

	var basePickBy = __webpack_require__(198),
	    hasIn = __webpack_require__(156);

	/**
	 * The base implementation of `_.pick` without support for individual
	 * property identifiers.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} paths The property paths to pick.
	 * @returns {Object} Returns the new object.
	 */
	function basePick(object, paths) {
	  return basePickBy(object, paths, function(value, path) {
	    return hasIn(object, path);
	  });
	}

	module.exports = basePick;


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

	var flatten = __webpack_require__(226),
	    overRest = __webpack_require__(184),
	    setToString = __webpack_require__(186);

	/**
	 * A specialized version of `baseRest` which flattens the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @returns {Function} Returns the new function.
	 */
	function flatRest(func) {
	  return setToString(overRest(func, undefined, flatten), func + '');
	}

	module.exports = flatRest;


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

	var baseFlatten = __webpack_require__(3);

	/**
	 * Flattens `array` a single level deep.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to flatten.
	 * @returns {Array} Returns the new flattened array.
	 * @example
	 *
	 * _.flatten([1, [2, [3, [4]], 5]]);
	 * // => [1, 2, [3, [4]], 5]
	 */
	function flatten(array) {
	  var length = array == null ? 0 : array.length;
	  return length ? baseFlatten(array, 1) : [];
	}

	module.exports = flatten;


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayMap = __webpack_require__(71),
	    baseIteratee = __webpack_require__(104),
	    baseMap = __webpack_require__(228),
	    isArray = __webpack_require__(14);

	/**
	 * Creates an array of values by running each element in `collection` thru
	 * `iteratee`. The iteratee is invoked with three arguments:
	 * (value, index|key, collection).
	 *
	 * Many lodash methods are guarded to work as iteratees for methods like
	 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
	 *
	 * The guarded methods are:
	 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
	 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
	 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
	 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 * @example
	 *
	 * function square(n) {
	 *   return n * n;
	 * }
	 *
	 * _.map([4, 8], square);
	 * // => [16, 64]
	 *
	 * _.map({ 'a': 4, 'b': 8 }, square);
	 * // => [16, 64] (iteration order is not guaranteed)
	 *
	 * var users = [
	 *   { 'user': 'barney' },
	 *   { 'user': 'fred' }
	 * ];
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.map(users, 'user');
	 * // => ['barney', 'fred']
	 */
	function map(collection, iteratee) {
	  var func = isArray(collection) ? arrayMap : baseMap;
	  return func(collection, baseIteratee(iteratee, 3));
	}

	module.exports = map;


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

	var baseEach = __webpack_require__(171),
	    isArrayLike = __webpack_require__(146);

	/**
	 * The base implementation of `_.map` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function baseMap(collection, iteratee) {
	  var index = -1,
	      result = isArrayLike(collection) ? Array(collection.length) : [];

	  baseEach(collection, function(value, key, collection) {
	    result[++index] = iteratee(value, key, collection);
	  });
	  return result;
	}

	module.exports = baseMap;


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

	var baseFindIndex = __webpack_require__(164),
	    baseIteratee = __webpack_require__(104),
	    toInteger = __webpack_require__(165);

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeMin = Math.min;

	/**
	 * This method is like `_.findIndex` except that it iterates over elements
	 * of `collection` from right to left.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.0.0
	 * @category Array
	 * @param {Array} array The array to inspect.
	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
	 * @param {number} [fromIndex=array.length-1] The index to search from.
	 * @returns {number} Returns the index of the found element, else `-1`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'active': true },
	 *   { 'user': 'fred',    'active': false },
	 *   { 'user': 'pebbles', 'active': false }
	 * ];
	 *
	 * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
	 * // => 2
	 *
	 * // The `_.matches` iteratee shorthand.
	 * _.findLastIndex(users, { 'user': 'barney', 'active': true });
	 * // => 0
	 *
	 * // The `_.matchesProperty` iteratee shorthand.
	 * _.findLastIndex(users, ['active', false]);
	 * // => 2
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.findLastIndex(users, 'active');
	 * // => 0
	 */
	function findLastIndex(array, predicate, fromIndex) {
	  var length = array == null ? 0 : array.length;
	  if (!length) {
	    return -1;
	  }
	  var index = length - 1;
	  if (fromIndex !== undefined) {
	    index = toInteger(fromIndex);
	    index = fromIndex < 0
	      ? nativeMax(length + index, 0)
	      : nativeMin(index, length - 1);
	  }
	  return baseFindIndex(array, baseIteratee(predicate, 3), index, true);
	}

	module.exports = findLastIndex;


/***/ }),
/* 230 */
/***/ (function(module, exports) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};exports.


	validate = validate;function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} // Assertation 1:
	// The items property for a parameter is required when its type is set to array
	function validate(_ref) {var resolvedSpec = _ref.resolvedSpec;var errors = [];var warnings = [];

	  function walk(obj, path) {
	    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object" || obj === null) {
	      return;
	    }

	    // 1
	    if (path[path.length - 2] === "parameters") {
	      if (obj.type === "array" && _typeof(obj.items) !== "object") {
	        errors.push({
	          path: path,
	          message: "Parameters with 'array' type require an 'items' property." });

	      }
	    }

	    if (Object.keys(obj).length) {
	      return Object.keys(obj).map(function (k) {return walk(obj[k], [].concat(_toConsumableArray(path), [k]));});

	    } else {
	      return null;
	    }

	  }

	  walk(resolvedSpec, []);

	  return { errors: errors, warnings: warnings };
	}

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.


























	validate = validate;var _each = __webpack_require__(218);var _each2 = _interopRequireDefault(_each);var _findIndex = __webpack_require__(163);var _findIndex2 = _interopRequireDefault(_findIndex);var _isObject = __webpack_require__(45);var _isObject2 = _interopRequireDefault(_isObject);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} // Assertation 1:
	// Path parameters definition, either at the path-level or the operation-level, need matching paramater declarations
	// Assertation 2:
	// Path parameter declarations do not allow empty names (/path/{} is not valid)
	// Assertation 3:
	// Path parameters declared in the path string need matching parameter definitions (Either at the path-level or the operation)
	// Assertation 4:
	// Path strings must be (equivalently) different (Example: /pet/{petId} and /pet/{petId2} are equivalently the same and would generate an error)
	// Assertation 5:
	// Paths must have unique (name + in combination) parameters
	// Assertation 6:
	// Paths cannot have partial templates. (/path/abc{123} is illegal)
	// Assertation 7:
	// Paths cannot have literal query strings in them.
	var templateRegex = /\{(.*?)\}/g;function validate(_ref) {var resolvedSpec = _ref.resolvedSpec;var errors = [];var warnings = [];var seenRealPaths = {};var tallyRealPath = function tallyRealPath(path) {// ~~ is a flag for a removed template string
	    var realPath = path.replace(templateRegex, "~~");var prev = seenRealPaths[realPath];seenRealPaths[realPath] = true; // returns if it was previously seen
	    return !!prev;};(0, _each2.default)(resolvedSpec.paths, function (path, pathName) {if (!path || !pathName) {
	      return;
	    }

	    pathName.split("/").map(function (substr) {
	      // Assertation 6
	      if (templateRegex.test(substr) && substr.replace(templateRegex, "").length > 0) {
	        errors.push({
	          path: "paths." + pathName,
	          message: "Partial path templating is not allowed." });

	      }
	    });

	    if (pathName.indexOf("?") > -1) {
	      errors.push({
	        path: "paths." + pathName,
	        message: "Query strings in paths are not allowed." });

	    }

	    var parametersFromPath = path.parameters ? path.parameters.slice() : [];

	    var availableParameters = parametersFromPath.map(function (param, i) {
	      if (!(0, _isObject2.default)(param)) {
	        return;
	      }
	      param.$$path = "paths." + pathName + ".parameters[" + i + "]";
	      return param;
	    });

	    (0, _each2.default)(path, function (thing, thingName) {
	      if (thing && thing.parameters) {
	        availableParameters.push.apply(availableParameters, _toConsumableArray(thing.parameters.map(function (param, i) {
	          if (!(0, _isObject2.default)(param)) {
	            return;
	          }
	          param.$$path = "paths." + pathName + "." + thingName + ".parameters[" + i + "]";
	          return param;
	        })));
	      }
	    });

	    // Assertation 4
	    var hasBeenSeen = tallyRealPath(pathName);
	    if (hasBeenSeen) {
	      errors.push({
	        path: "paths." + pathName,
	        message: "Equivalent paths are not allowed." });

	    }

	    // Assertation 5
	    (0, _each2.default)(parametersFromPath, function (parameterDefinition, i) {
	      var nameAndInComboIndex = (0, _findIndex2.default)(parametersFromPath, { "name": parameterDefinition.name, "in": parameterDefinition.in });
	      // comparing the current index against the first found index is good, because
	      // it cuts down on error quantity when only two parameters are involved,
	      // i.e. if param1 and param2 conflict, this will only complain about param2.
	      // it also will favor complaining about parameters later in the spec, which
	      // makes more sense to the user.
	      if (i !== nameAndInComboIndex && parameterDefinition.in) {
	        errors.push({
	          path: "paths." + pathName + ".parameters[" + i + "]",
	          message: "Path parameters must have unique 'name' + 'in' properties" });

	      }
	    });

	    var pathTemplates = pathName.match(templateRegex) || [];
	    pathTemplates = pathTemplates.map(function (str) {return str.replace("{", "").replace("}", "");});

	    // Assertation 1
	    (0, _each2.default)(availableParameters, function (parameterDefinition, i) {
	      if ((0, _isObject2.default)(parameterDefinition) && parameterDefinition.in === "path" && pathTemplates.indexOf(parameterDefinition.name) === -1) {
	        errors.push({
	          path: parameterDefinition.$$path || "paths." + pathName + ".parameters[" + i + "]",
	          message: "Path parameter " + parameterDefinition.name + " was defined but never used" });

	      }
	    });

	    if (pathTemplates) {
	      pathTemplates.forEach(function (parameter) {
	        // Assertation 2

	        if (parameter === "") {// it was originally "{}"
	          errors.push({
	            path: "paths." + pathName,
	            message: "Empty path parameter declarations are not valid" });

	        } else

	          // Assertation 3
	          if ((0, _findIndex2.default)(availableParameters, { name: parameter, in: "path" }) === -1) {
	            if ((0, _findIndex2.default)(errors, { path: "paths." + pathName }) > -1) {
	              // don't add an error if there's already one for the path (for assertation 6)
	              return;
	            }
	            errors.push({
	              path: "paths." + pathName,
	              message: "Declared path parameter \"" + parameter + "\" needs to be defined as a path parameter at either the path or operation level" });

	          }
	      });
	    } else {
	      (0, _each2.default)(availableParameters, function (parameterDefinition, i) {
	        // Assertation 1, for cases when no templating is present on the path
	        if (parameterDefinition.in === "path") {
	          errors.push({
	            path: "paths." + pathName + ".parameters[" + i + "]",
	            message: "Path parameter " + parameterDefinition.name + " was defined but never used" });

	        }
	      });
	    }


	  });

	  return { errors: errors, warnings: warnings };
	}

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.







	validate = validate;var _uniq = __webpack_require__(233);var _uniq2 = _interopRequireDefault(_uniq);var _filter = __webpack_require__(242);var _filter2 = _interopRequireDefault(_filter);var _startsWith = __webpack_require__(244);var _startsWith2 = _interopRequireDefault(_startsWith);var _each = __webpack_require__(218);var _each2 = _interopRequireDefault(_each);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} // Assertation 1:
	// Referenceable definitions should be used by being referenced in the appropriate way
	function validate(_ref) {var jsSpec = _ref.jsSpec,specStr = _ref.specStr;var errors = [];var warnings = [];

	  // Assertation 1
	  // This is a "creative" way to approach the problem of collecting used $refs,
	  // but other solutions required walking the jsSpec recursively to detect $refs,
	  // which can be quite slow.
	  var refRegex = /\$ref.*["'](.*)["']/g;
	  var match = refRegex.exec(specStr);
	  var refs = [];
	  while (match !== null) {
	    refs.push(match[1]);
	    match = refRegex.exec(specStr);
	  }

	  // de-dupe the array, and filter out non-definition refs
	  var definitionsRefs = (0, _filter2.default)((0, _uniq2.default)(refs), function (v) {return (0, _startsWith2.default)(v, "#/definitions");});

	  (0, _each2.default)(jsSpec.definitions, function (def, defName) {
	    if (definitionsRefs.indexOf("#/definitions/" + defName) === -1) {
	      warnings.push({
	        path: "definitions." + defName,
	        message: "Definition was declared but never used in document" });

	    }
	  });

	  return { errors: errors, warnings: warnings };
	}

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

	var baseUniq = __webpack_require__(234);

	/**
	 * Creates a duplicate-free version of an array, using
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons, in which only the first occurrence of each element
	 * is kept. The order of result values is determined by the order they occur
	 * in the array.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to inspect.
	 * @returns {Array} Returns the new duplicate free array.
	 * @example
	 *
	 * _.uniq([2, 1, 2]);
	 * // => [2, 1]
	 */
	function uniq(array) {
	  return (array && array.length) ? baseUniq(array) : [];
	}

	module.exports = uniq;


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

	var SetCache = __webpack_require__(116),
	    arrayIncludes = __webpack_require__(235),
	    arrayIncludesWith = __webpack_require__(239),
	    cacheHas = __webpack_require__(120),
	    createSet = __webpack_require__(240),
	    setToArray = __webpack_require__(124);

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} [iteratee] The iteratee invoked per element.
	 * @param {Function} [comparator] The comparator invoked per element.
	 * @returns {Array} Returns the new duplicate free array.
	 */
	function baseUniq(array, iteratee, comparator) {
	  var index = -1,
	      includes = arrayIncludes,
	      length = array.length,
	      isCommon = true,
	      result = [],
	      seen = result;

	  if (comparator) {
	    isCommon = false;
	    includes = arrayIncludesWith;
	  }
	  else if (length >= LARGE_ARRAY_SIZE) {
	    var set = iteratee ? null : createSet(array);
	    if (set) {
	      return setToArray(set);
	    }
	    isCommon = false;
	    includes = cacheHas;
	    seen = new SetCache;
	  }
	  else {
	    seen = iteratee ? [] : result;
	  }
	  outer:
	  while (++index < length) {
	    var value = array[index],
	        computed = iteratee ? iteratee(value) : value;

	    value = (comparator || value !== 0) ? value : 0;
	    if (isCommon && computed === computed) {
	      var seenIndex = seen.length;
	      while (seenIndex--) {
	        if (seen[seenIndex] === computed) {
	          continue outer;
	        }
	      }
	      if (iteratee) {
	        seen.push(computed);
	      }
	      result.push(value);
	    }
	    else if (!includes(seen, computed, comparator)) {
	      if (seen !== result) {
	        seen.push(computed);
	      }
	      result.push(value);
	    }
	  }
	  return result;
	}

	module.exports = baseUniq;


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIndexOf = __webpack_require__(236);

	/**
	 * A specialized version of `_.includes` for arrays without support for
	 * specifying an index to search from.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludes(array, value) {
	  var length = array == null ? 0 : array.length;
	  return !!length && baseIndexOf(array, value, 0) > -1;
	}

	module.exports = arrayIncludes;


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

	var baseFindIndex = __webpack_require__(164),
	    baseIsNaN = __webpack_require__(237),
	    strictIndexOf = __webpack_require__(238);

	/**
	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  return value === value
	    ? strictIndexOf(array, value, fromIndex)
	    : baseFindIndex(array, baseIsNaN, fromIndex);
	}

	module.exports = baseIndexOf;


/***/ }),
/* 237 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.isNaN` without support for number objects.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	 */
	function baseIsNaN(value) {
	  return value !== value;
	}

	module.exports = baseIsNaN;


/***/ }),
/* 238 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `_.indexOf` which performs strict equality
	 * comparisons of values, i.e. `===`.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function strictIndexOf(array, value, fromIndex) {
	  var index = fromIndex - 1,
	      length = array.length;

	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}

	module.exports = strictIndexOf;


/***/ }),
/* 239 */
/***/ (function(module, exports) {

	/**
	 * This function is like `arrayIncludes` except that it accepts a comparator.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @param {Function} comparator The comparator invoked per element.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludesWith(array, value, comparator) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (comparator(value, array[index])) {
	      return true;
	    }
	  }
	  return false;
	}

	module.exports = arrayIncludesWith;


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

	var Set = __webpack_require__(150),
	    noop = __webpack_require__(241),
	    setToArray = __webpack_require__(124);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/**
	 * Creates a set object of `values`.
	 *
	 * @private
	 * @param {Array} values The values to add to the set.
	 * @returns {Object} Returns the new set.
	 */
	var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
	  return new Set(values);
	};

	module.exports = createSet;


/***/ }),
/* 241 */
/***/ (function(module, exports) {

	/**
	 * This method returns `undefined`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.3.0
	 * @category Util
	 * @example
	 *
	 * _.times(2, _.noop);
	 * // => [undefined, undefined]
	 */
	function noop() {
	  // No operation performed.
	}

	module.exports = noop;


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayFilter = __webpack_require__(129),
	    baseFilter = __webpack_require__(243),
	    baseIteratee = __webpack_require__(104),
	    isArray = __webpack_require__(14);

	/**
	 * Iterates over elements of `collection`, returning an array of all elements
	 * `predicate` returns truthy for. The predicate is invoked with three
	 * arguments: (value, index|key, collection).
	 *
	 * **Note:** Unlike `_.remove`, this method returns a new array.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 * @see _.reject
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney', 'age': 36, 'active': true },
	 *   { 'user': 'fred',   'age': 40, 'active': false }
	 * ];
	 *
	 * _.filter(users, function(o) { return !o.active; });
	 * // => objects for ['fred']
	 *
	 * // The `_.matches` iteratee shorthand.
	 * _.filter(users, { 'age': 36, 'active': true });
	 * // => objects for ['barney']
	 *
	 * // The `_.matchesProperty` iteratee shorthand.
	 * _.filter(users, ['active', false]);
	 * // => objects for ['fred']
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.filter(users, 'active');
	 * // => objects for ['barney']
	 */
	function filter(collection, predicate) {
	  var func = isArray(collection) ? arrayFilter : baseFilter;
	  return func(collection, baseIteratee(predicate, 3));
	}

	module.exports = filter;


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

	var baseEach = __webpack_require__(171);

	/**
	 * The base implementation of `_.filter` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function baseFilter(collection, predicate) {
	  var result = [];
	  baseEach(collection, function(value, index, collection) {
	    if (predicate(value, index, collection)) {
	      result.push(value);
	    }
	  });
	  return result;
	}

	module.exports = baseFilter;


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

	var baseClamp = __webpack_require__(245),
	    baseToString = __webpack_require__(70),
	    toInteger = __webpack_require__(165),
	    toString = __webpack_require__(69);

	/**
	 * Checks if `string` starts with the given target string.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category String
	 * @param {string} [string=''] The string to inspect.
	 * @param {string} [target] The string to search for.
	 * @param {number} [position=0] The position to search from.
	 * @returns {boolean} Returns `true` if `string` starts with `target`,
	 *  else `false`.
	 * @example
	 *
	 * _.startsWith('abc', 'a');
	 * // => true
	 *
	 * _.startsWith('abc', 'b');
	 * // => false
	 *
	 * _.startsWith('abc', 'b', 1);
	 * // => true
	 */
	function startsWith(string, target, position) {
	  string = toString(string);
	  position = position == null
	    ? 0
	    : baseClamp(toInteger(position), 0, string.length);

	  target = baseToString(target);
	  return string.slice(position, position + target.length) == target;
	}

	module.exports = startsWith;


/***/ }),
/* 245 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.clamp` which doesn't coerce arguments.
	 *
	 * @private
	 * @param {number} number The number to clamp.
	 * @param {number} [lower] The lower bound.
	 * @param {number} upper The upper bound.
	 * @returns {number} Returns the clamped number.
	 */
	function baseClamp(number, lower, upper) {
	  if (number === number) {
	    if (upper !== undefined) {
	      number = number <= upper ? number : upper;
	    }
	    if (lower !== undefined) {
	      number = number >= lower ? number : lower;
	    }
	  }
	  return number;
	}

	module.exports = baseClamp;


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.

	validate = validate;var _each = __webpack_require__(218);var _each2 = _interopRequireDefault(_each);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function validate(_ref) {var resolvedSpec = _ref.resolvedSpec;
	  var errors = [];
	  var warnings = [];

	  var schemas = [];

	  if (resolvedSpec.definitions) {
	    (0, _each2.default)(resolvedSpec.definitions, function (def, name) {
	      def.name = name;
	      schemas.push({ schema: def, path: ["definitions", name] });
	    });
	  }

	  if (resolvedSpec.paths) {
	    (0, _each2.default)(resolvedSpec.paths, function (path, pathName) {
	      (0, _each2.default)(path, function (op, opName) {
	        if (op && op.parameters) {
	          op.parameters.forEach(function (parameter, parameterIndex) {
	            if (parameter.in === "body" && parameter.schema) {
	              schemas.push({
	                schema: parameter.schema,
	                path: ["paths", pathName, opName, "parameters", parameterIndex.toString(), "schema"] });

	            }
	          });
	        }
	        if (op && op.responses) {
	          (0, _each2.default)(op.responses, function (response, responseName) {
	            if (response && response.schema) {
	              schemas.push({
	                schema: response.schema,
	                path: ["paths", pathName, opName, "responses", responseName, "schema"] });

	            }
	          });
	        }
	      });
	    });
	  }

	  schemas.forEach(function (_ref2) {var schema = _ref2.schema,path = _ref2.path;
	    if (Array.isArray(schema.properties) && Array.isArray(schema.required)) {
	      schema.properties.forEach(function () {
	        errors.push.apply(errors, _toConsumableArray(generateReadOnlyErrors(schema, path)));
	      });
	    }
	  });

	  return { errors: errors, warnings: warnings };
	}

	function generateReadOnlyErrors(schema, contextPath) {
	  var arr = [];

	  schema.properties.forEach(function (property, i) {
	    if (property.name && property.readOnly && schema.required.indexOf(property.name) > -1) {
	      arr.push({
	        path: contextPath.concat(["required", i.toString()]),
	        message: "Read only properties cannot marked as required by a schema." });

	    }
	  });
	  return arr;
	}

/***/ }),
/* 247 */
/***/ (function(module, exports) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};exports.








	validate = validate; // Assertation 1: security definition must have type one of "apiKey" || "oauth2" || "basic"
	// Assertation 2: "apiKey" security must have "in" one of "header" || "query", and required "name" string
	// Assertation 3: "oauth2" security must have flow parameter one of "implicit" || "password" || "application" || "accessCode"
	// Assertation 4: "oauth2" security flow "implicit" must have required string "authorizationUrl" and object "scopes" parameters
	// Assertation 5: "oauth2" security flow "password" must have required string "tokenUrl" and object "scopes" parameters
	// Assertation 5: "oauth2" security flow "accessCode" must have required string "tokenUrl", string "authorizationUrl" and object "scopes" parameters
	// Assertation 6: "oauth2" security flow "application" must have required string "tokenUrl", string "authorizationUrl" and object "scopes" parameters
	function validate(_ref) {var jsSpec = _ref.jsSpec;var API_KEY = "apiKey";var OAUTH2 = "oauth2";var BASIC = "basic";var auths = [API_KEY, OAUTH2, BASIC];var IMPLICIT = "implicit";var PASSWORD = "password";var APPLICATION = "application";
	  var ACCESS_CODE = "accessCode";
	  var oauth2Flows = [IMPLICIT, PASSWORD, APPLICATION, ACCESS_CODE];

	  var errors = [];
	  var warnings = [];

	  var securityDefinitions = jsSpec.securityDefinitions;

	  for (var key in securityDefinitions) {
	    var security = securityDefinitions[key];
	    var type = security.type;
	    var path = "securityDefinitions." + key;

	    if (auths.indexOf(type) === -1) {
	      errors.push({
	        message: path + " must have required string 'type' param",
	        path: path,
	        authId: key });

	    } else {
	      //apiKey validation
	      if (type === API_KEY) {
	        var authIn = security.in;

	        if (authIn !== "query" && authIn !== "header") {
	          errors.push({
	            message: "apiKey authorization must have required 'in' param, valid values are 'query' or 'header'.",
	            path: path,
	            authId: key });

	        }

	        if (!security.name) {
	          errors.push({
	            message: "apiKey authorization must have required 'name' string param. The name of the header or query parameter to be used.",
	            path: path,
	            authId: key });

	        }
	      } // oauth2 validation
	      else if (type === OAUTH2) {
	          var flow = security.flow;
	          var authorizationUrl = security.authorizationUrl;
	          var tokenUrl = security.tokenUrl;
	          var scopes = security.scopes;

	          if (oauth2Flows.indexOf(flow) === -1) {
	            errors.push({
	              message: "oauth2 authorization must have required 'flow' string param. Valid values are 'implicit', 'password', 'application' or 'accessCode'",
	              path: path,
	              authId: key });

	          } else if (flow === IMPLICIT) {
	            if (!authorizationUrl) {
	              errors.push({
	                message: "oauth2 authorization implicit flow must have required 'authorizationUrl' parameter.",
	                path: path,
	                authId: key });

	            }
	          } else if (flow === ACCESS_CODE) {
	            if (!authorizationUrl || !tokenUrl) {
	              errors.push({
	                message: "oauth2 authorization accessCode flow must have required 'authorizationUrl' and 'tokenUrl' string parameters.",
	                path: path,
	                authId: key });

	            }
	          } else if (flow === PASSWORD) {
	            if (!tokenUrl) {
	              errors.push({
	                message: "oauth2 authorization password flow must have required 'tokenUrl' string parameter.",
	                path: path,
	                authId: key });

	            }
	          } else if (flow === APPLICATION) {
	            if (!tokenUrl) {
	              errors.push({
	                message: "oauth2 authorization application flow must have required 'tokenUrl' string parameter.",
	                path: path,
	                authId: key });

	            }
	          }

	          if ((typeof scopes === "undefined" ? "undefined" : _typeof(scopes)) !== "object") {
	            errors.push({
	              message: "'scopes' is required property type object. The available scopes for the OAuth2 security scheme.",
	              path: path,
	              authId: key });

	          }
	        }
	    }
	  }

	  return { errors: errors, warnings: warnings };
	}

/***/ }),
/* 248 */
/***/ (function(module, exports) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};exports.



	validate = validate;function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} // Assertation 1:
	// Items in `security` must match a `securityDefinition`.
	function validate(_ref) {var resolvedSpec = _ref.resolvedSpec;var errors = [];var warnings = [];

	  var securityDefinitions = resolvedSpec.securityDefinitions;

	  function walk(obj, path) {
	    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object" || obj === null) {
	      return;
	    }

	    if (path[path.length - 2] === "security") {

	      // Assertation 1
	      Object.keys(obj).map(function (key) {
	        var securityDefinition = securityDefinitions && securityDefinitions[key];
	        if (!securityDefinition) {
	          errors.push({
	            message: "security requirements must match a security definition",
	            path: path });

	        }

	        if (securityDefinition) {
	          var scopes = obj[key];
	          if (Array.isArray(scopes)) {

	            // Check for unknown scopes

	            scopes.forEach(function (scope, i) {
	              if (!securityDefinition.scopes || !securityDefinition.scopes[scope]) {
	                errors.push({
	                  message: "Security scope definition " + scope + " could not be resolved",
	                  path: path.concat([i.toString()]) });

	              }
	            });
	          }
	        }
	      });
	    }

	    if (Object.keys(obj).length) {
	      return Object.keys(obj).map(function (k) {return walk(obj[k], [].concat(_toConsumableArray(path), [k]));});

	    } else {
	      return null;
	    }

	  }

	  walk(resolvedSpec, []);

	  return { errors: errors, warnings: warnings };
	}

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;}; // Walks an entire spec.

	// Assertation 1:
	// In specific areas of a spec, allowed $ref values are restricted.

	// Assertation 2:
	// Sibling keys with $refs are not allowed.
	exports.


	validate = validate;var _matcher = __webpack_require__(250);var _matcher2 = _interopRequireDefault(_matcher);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function validate(_ref) {var jsSpec = _ref.jsSpec;
	  var errors = [];
	  var warnings = [];

	  function walk(value, path) {
	    var curr = path[path.length - 1];

	    if (value === null) {
	      return null;
	    }

	    ///// "type" should always be a string, everywhere.
	    if (curr === "type" && ["definitions", "properties"].indexOf(path[path.length - 2]) === -1) {
	      if (typeof value !== "string") {
	        errors.push({
	          path: path,
	          message: "\"type\" should be a string" });

	      }

	    }

	    ///// Minimums and Maximums

	    if (value.maximum && value.minimum) {
	      if (greater(value.minimum, value.maximum)) {
	        errors.push({
	          path: path.concat(["minimum"]),
	          message: "Minimum cannot be more than maximum" });

	      }
	    }

	    if (value.maxProperties && value.minProperties) {
	      if (greater(value.minProperties, value.maxProperties)) {
	        errors.push({
	          path: path.concat(["minProperties"]),
	          message: "minProperties cannot be more than maxProperties" });

	      }
	    }

	    if (value.maxLength && value.minLength) {
	      if (greater(value.minLength, value.maxLength)) {
	        errors.push({
	          path: path.concat(["minLength"]),
	          message: "minLength cannot be more than maxLength" });

	      }
	    }

	    ///// Restricted $refs

	    if (curr === "$ref") {
	      var refBlacklist = getRefPatternBlacklist(path) || [];
	      var matches = (0, _matcher2.default)([value], refBlacklist);

	      var humanFriendlyRefBlacklist = refBlacklist.
	      map(function (val) {return "\"" + val + "\"";}).
	      join(", ");

	      if (refBlacklist && refBlacklist.length && matches.length) {
	        // Assertation 1
	        errors.push({
	          path: path,
	          message: path[path.length - 2] + " $refs cannot match any of the following: " + humanFriendlyRefBlacklist });

	      }
	    }

	    if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== "object") {
	      return null;
	    }

	    var keys = Object.keys(value);

	    if (keys.length) {
	      ///// $ref siblings
	      return keys.map(function (k) {
	        if (keys.indexOf("$ref") > -1 && k !== "$ref") {
	          warnings.push({
	            path: path.concat([k]),
	            message: "Values alongside a $ref will be ignored." });

	        }
	        return walk(value[k], [].concat(_toConsumableArray(path), [k]));
	      });

	    } else {
	      return null;
	    }

	  }

	  walk(jsSpec, []);

	  return { errors: errors, warnings: warnings };
	}

	// values are globs!
	var unacceptableRefPatterns = {
	  responses: ["*#/definitions*", "*#/parameters*"],
	  schema: ["*#/responses*", "*#/parameters*"],
	  parameters: ["*#/definitions*", "*#/responses*"] };


	var exceptionedParents = ["properties"];

	function getRefPatternBlacklist(path) {
	  return path.reduce(function (prev, curr, i) {
	    var parent = path[i - 1];
	    if (unacceptableRefPatterns[curr] && exceptionedParents.indexOf(parent) === -1) {
	      return unacceptableRefPatterns[curr];
	    } else {
	      return prev;
	    }
	  }, null);
	}

	function greater(a, b) {
	  // is a greater than b?
	  return a > b;
	}

/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var escapeStringRegexp = __webpack_require__(251);
	var reCache = {};

	function makeRe(pattern, shouldNegate) {
		var cacheKey = pattern + shouldNegate;

		if (reCache[cacheKey]) {
			return reCache[cacheKey];
		}

		var negated = false;

		if (pattern[0] === '!') {
			negated = true;
			pattern = pattern.slice(1);
		}

		pattern = escapeStringRegexp(pattern).replace(/\\\*/g, '.*');

		if (negated && shouldNegate) {
			pattern = '(?!' + pattern + ')';
		}

		var re = new RegExp('^' + pattern + '$', 'i');

		re.negated = negated;

		reCache[cacheKey] = re;

		return re;
	}

	module.exports = function (inputs, patterns) {
		if (!(Array.isArray(inputs) && Array.isArray(patterns))) {
			throw new TypeError('Expected two arrays, got ' + typeof inputs + ' ' + typeof patterns);
		}

		if (patterns.length === 0) {
			return inputs;
		}

		var firstNegated = patterns[0][0] === '!';

		patterns = patterns.map(function (x) {
			return makeRe(x, false);
		});

		var ret = [];

		for (var i = 0; i < inputs.length; i++) {
			// if first pattern is negated we include
			// everything to match user expectation
			var matches = firstNegated;

			for (var j = 0; j < patterns.length; j++) {
				if (patterns[j].test(inputs[i])) {
					matches = !patterns[j].negated;
				}
			}

			if (matches) {
				ret.push(inputs[i]);
			}
		}

		return ret;
	};

	module.exports.isMatch = function (input, pattern) {
		return makeRe(pattern, true).test(input);
	};


/***/ }),
/* 251 */
/***/ (function(module, exports) {

	'use strict';

	var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

	module.exports = function (str) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string');
		}

		return str.replace(matchOperatorsRe, '\\$&');
	};


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var isPromise = __webpack_require__(253);

	function parseJsonSafely(str) {
	  try {
	    return JSON.parse(str);
	  } catch (e) {
	    return false;
	  }
	}

	function registerPromiseWorker(callback) {

	  function postOutgoingMessage(e, messageId, error, result) {
	    function postMessage(msg) {
	      /* istanbul ignore if */
	      if (typeof self.postMessage !== 'function') { // service worker
	        e.ports[0].postMessage(msg);
	      } else { // web worker
	        self.postMessage(msg);
	      }
	    }
	    if (error) {
	      /* istanbul ignore else */
	      if (typeof console !== 'undefined' && 'error' in console) {
	        // This is to make errors easier to debug. I think it's important
	        // enough to just leave here without giving the user an option
	        // to silence it.
	        console.error('Worker caught an error:', error);
	      }
	      postMessage(JSON.stringify([messageId, {
	        message: error.message
	      }]));
	    } else {
	      postMessage(JSON.stringify([messageId, null, result]));
	    }
	  }

	  function tryCatchFunc(callback, message) {
	    try {
	      return {res: callback(message)};
	    } catch (e) {
	      return {err: e};
	    }
	  }

	  function handleIncomingMessage(e, callback, messageId, message) {

	    var result = tryCatchFunc(callback, message);

	    if (result.err) {
	      postOutgoingMessage(e, messageId, result.err);
	    } else if (!isPromise(result.res)) {
	      postOutgoingMessage(e, messageId, null, result.res);
	    } else {
	      result.res.then(function (finalResult) {
	        postOutgoingMessage(e, messageId, null, finalResult);
	      }, function (finalError) {
	        postOutgoingMessage(e, messageId, finalError);
	      });
	    }
	  }

	  function onIncomingMessage(e) {
	    var payload = parseJsonSafely(e.data);
	    if (!payload) {
	      // message isn't stringified json; ignore
	      return;
	    }
	    var messageId = payload[0];
	    var message = payload[1];

	    if (typeof callback !== 'function') {
	      postOutgoingMessage(e, messageId, new Error(
	        'Please pass a function into register().'));
	    } else {
	      handleIncomingMessage(e, callback, messageId, message);
	    }
	  }

	  self.addEventListener('message', onIncomingMessage);
	}

	module.exports = registerPromiseWorker;

/***/ }),
/* 253 */
/***/ (function(module, exports) {

	module.exports = isPromise;

	function isPromise(obj) {
	  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
	}


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _schema = __webpack_require__(255);var _schema2 = _interopRequireDefault(_schema);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default =

	{
	  "apis": {
	    schemas: [_schema2.default], // the API schema references itself by URL, so we have to preload it
	    testSchema: _schema2.default,
	    runStructural: true,
	    runSemantic: true } };

/***/ }),
/* 255 */
/***/ (function(module, exports) {

	"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = {
	  "title": "A JSON Schema for Swagger 2.0 API.",
	  "id": "http://swagger.io/v2/schema.json#",
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "type": "object",
	  "required": [
	  "swagger",
	  "info",
	  "paths"],

	  "additionalProperties": false,
	  "patternProperties": {
	    "^x-": {
	      "$ref": "#/definitions/vendorExtension" } },


	  "properties": {
	    "swagger": {
	      "type": "string",
	      "enum": [
	      "2.0"],

	      "description": "The Swagger version of this document." },

	    "info": {
	      "$ref": "#/definitions/info" },

	    "host": {
	      "type": "string",
	      "pattern": "^[^{}/ :\\\\]+(?::\\d+)?$",
	      "description": "The host (name or ip) of the API. Example: 'swagger.io'" },

	    "basePath": {
	      "type": "string",
	      "pattern": "^/",
	      "description": "The base path to the API. Example: '/api'." },

	    "schemes": {
	      "$ref": "#/definitions/schemesList" },

	    "consumes": {
	      "description": "A list of MIME types accepted by the API.",
	      "allOf": [
	      {
	        "$ref": "#/definitions/mediaTypeList" }] },



	    "produces": {
	      "description": "A list of MIME types the API can produce.",
	      "allOf": [
	      {
	        "$ref": "#/definitions/mediaTypeList" }] },



	    "paths": {
	      "$ref": "#/definitions/paths" },

	    "definitions": {
	      "$ref": "#/definitions/definitions" },

	    "parameters": {
	      "$ref": "#/definitions/parameterDefinitions" },

	    "responses": {
	      "$ref": "#/definitions/responseDefinitions" },

	    "security": {
	      "$ref": "#/definitions/security" },

	    "securityDefinitions": {
	      "$ref": "#/definitions/securityDefinitions" },

	    "tags": {
	      "type": "array",
	      "items": {
	        "$ref": "#/definitions/tag" },

	      "uniqueItems": true },

	    "externalDocs": {
	      "$ref": "#/definitions/externalDocs" } },


	  "definitions": {
	    "info": {
	      "type": "object",
	      "description": "General information about the API.",
	      "required": [
	      "version",
	      "title"],

	      "additionalProperties": false,
	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } },


	      "properties": {
	        "title": {
	          "type": "string",
	          "description": "A unique and precise title of the API." },

	        "version": {
	          "type": "string",
	          "description": "A semantic version number of the API." },

	        "description": {
	          "type": "string",
	          "description": "A longer description of the API. Should be different from the title.  GitHub Flavored Markdown is allowed." },

	        "termsOfService": {
	          "type": "string",
	          "description": "The terms of service for the API." },

	        "contact": {
	          "$ref": "#/definitions/contact" },

	        "license": {
	          "$ref": "#/definitions/license" } } },



	    "contact": {
	      "type": "object",
	      "description": "Contact information for the owners of the API.",
	      "additionalProperties": false,
	      "properties": {
	        "name": {
	          "type": "string",
	          "description": "The identifying name of the contact person/organization." },

	        "url": {
	          "type": "string",
	          "description": "The URL pointing to the contact information.",
	          "format": "uri" },

	        "email": {
	          "type": "string",
	          "description": "The email address of the contact person/organization.",
	          "format": "email" } },


	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "license": {
	      "type": "object",
	      "required": [
	      "name"],

	      "additionalProperties": false,
	      "properties": {
	        "name": {
	          "type": "string",
	          "description": "The name of the license type. It's encouraged to use an OSI compatible license." },

	        "url": {
	          "type": "string",
	          "description": "The URL pointing to the license.",
	          "format": "uri" } },


	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "paths": {
	      "type": "object",
	      "description": "Relative paths to the individual endpoints. They must be relative to the 'basePath'.",
	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" },

	        "^/": {
	          "$ref": "#/definitions/pathItem" } },


	      "additionalProperties": false },

	    "definitions": {
	      "type": "object",
	      "additionalProperties": {
	        "$ref": "#/definitions/schema" },

	      "description": "One or more JSON objects describing the schemas being consumed and produced by the API." },

	    "parameterDefinitions": {
	      "type": "object",
	      "additionalProperties": {
	        "$ref": "#/definitions/parameter" },

	      "description": "One or more JSON representations for parameters" },

	    "responseDefinitions": {
	      "type": "object",
	      "additionalProperties": {
	        "$ref": "#/definitions/response" },

	      "description": "One or more JSON representations for parameters" },

	    "externalDocs": {
	      "type": "object",
	      "additionalProperties": false,
	      "description": "information about external documentation",
	      "required": [
	      "url"],

	      "properties": {
	        "description": {
	          "type": "string" },

	        "url": {
	          "type": "string",
	          "format": "uri" } },


	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "examples": {
	      "type": "object",
	      "additionalProperties": true },

	    "mimeType": {
	      "type": "string",
	      "description": "The MIME type of the HTTP message." },

	    "operation": {
	      "type": "object",
	      "required": [
	      "responses"],

	      "additionalProperties": false,
	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } },


	      "properties": {
	        "tags": {
	          "type": "array",
	          "items": {
	            "type": "string" },

	          "uniqueItems": true },

	        "summary": {
	          "type": "string",
	          "description": "A brief summary of the operation." },

	        "description": {
	          "type": "string",
	          "description": "A longer description of the operation, GitHub Flavored Markdown is allowed." },

	        "externalDocs": {
	          "$ref": "#/definitions/externalDocs" },

	        "operationId": {
	          "type": "string",
	          "description": "A unique identifier of the operation." },

	        "produces": {
	          "description": "A list of MIME types the API can produce.",
	          "allOf": [
	          {
	            "$ref": "#/definitions/mediaTypeList" }] },



	        "consumes": {
	          "description": "A list of MIME types the API can consume.",
	          "allOf": [
	          {
	            "$ref": "#/definitions/mediaTypeList" }] },



	        "parameters": {
	          "$ref": "#/definitions/parametersList" },

	        "responses": {
	          "$ref": "#/definitions/responses" },

	        "schemes": {
	          "$ref": "#/definitions/schemesList" },

	        "deprecated": {
	          "type": "boolean",
	          "default": false },

	        "security": {
	          "$ref": "#/definitions/security" } } },



	    "pathItem": {
	      "type": "object",
	      "additionalProperties": false,
	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } },


	      "properties": {
	        "$ref": {
	          "type": "string" },

	        "get": {
	          "$ref": "#/definitions/operation" },

	        "put": {
	          "$ref": "#/definitions/operation" },

	        "post": {
	          "$ref": "#/definitions/operation" },

	        "delete": {
	          "$ref": "#/definitions/operation" },

	        "options": {
	          "$ref": "#/definitions/operation" },

	        "head": {
	          "$ref": "#/definitions/operation" },

	        "patch": {
	          "$ref": "#/definitions/operation" },

	        "parameters": {
	          "$ref": "#/definitions/parametersList" } } },



	    "responses": {
	      "type": "object",
	      "description": "Response objects names can either be any valid HTTP status code or 'default'.",
	      "minProperties": 1,
	      "additionalProperties": false,
	      "patternProperties": {
	        "^([0-9]{3})$|^(default)$": {
	          "$ref": "#/definitions/responseValue" },

	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } },


	      "not": {
	        "type": "object",
	        "additionalProperties": false,
	        "patternProperties": {
	          "^x-": {
	            "$ref": "#/definitions/vendorExtension" } } } },




	    "responseValue": {
	      "oneOf": [
	      {
	        "$ref": "#/definitions/response" },

	      {
	        "$ref": "#/definitions/jsonReference" }] },



	    "response": {
	      "type": "object",
	      "required": [
	      "description"],

	      "properties": {
	        "description": {
	          "type": "string" },

	        "schema": {
	          "oneOf": [
	          {
	            "$ref": "#/definitions/schema" },

	          {
	            "$ref": "#/definitions/fileSchema" }] },



	        "headers": {
	          "$ref": "#/definitions/headers" },

	        "examples": {
	          "$ref": "#/definitions/examples" } },


	      "additionalProperties": false,
	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "headers": {
	      "type": "object",
	      "additionalProperties": {
	        "$ref": "#/definitions/header" } },


	    "header": {
	      "type": "object",
	      "additionalProperties": false,
	      "required": [
	      "type"],

	      "properties": {
	        "type": {
	          "type": "string",
	          "enum": [
	          "string",
	          "number",
	          "integer",
	          "boolean",
	          "array"] },


	        "format": {
	          "type": "string" },

	        "items": {
	          "$ref": "#/definitions/primitivesItems" },

	        "collectionFormat": {
	          "$ref": "#/definitions/collectionFormat" },

	        "default": {
	          "$ref": "#/definitions/default" },

	        "maximum": {
	          "$ref": "#/definitions/maximum" },

	        "exclusiveMaximum": {
	          "$ref": "#/definitions/exclusiveMaximum" },

	        "minimum": {
	          "$ref": "#/definitions/minimum" },

	        "exclusiveMinimum": {
	          "$ref": "#/definitions/exclusiveMinimum" },

	        "maxLength": {
	          "$ref": "#/definitions/maxLength" },

	        "minLength": {
	          "$ref": "#/definitions/minLength" },

	        "pattern": {
	          "$ref": "#/definitions/pattern" },

	        "maxItems": {
	          "$ref": "#/definitions/maxItems" },

	        "minItems": {
	          "$ref": "#/definitions/minItems" },

	        "uniqueItems": {
	          "$ref": "#/definitions/uniqueItems" },

	        "enum": {
	          "$ref": "#/definitions/enum" },

	        "multipleOf": {
	          "$ref": "#/definitions/multipleOf" },

	        "description": {
	          "type": "string" } },


	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "vendorExtension": {
	      "description": "Any property starting with x- is valid.",
	      "additionalProperties": true,
	      "additionalItems": true },

	    "bodyParameter": {
	      "type": "object",
	      "required": [
	      "name",
	      "in",
	      "schema"],

	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } },


	      "properties": {
	        "description": {
	          "type": "string",
	          "description": "A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed." },

	        "name": {
	          "type": "string",
	          "description": "The name of the parameter." },

	        "in": {
	          "type": "string",
	          "description": "Determines the location of the parameter.",
	          "enum": [
	          "body"] },


	        "required": {
	          "type": "boolean",
	          "description": "Determines whether or not this parameter is required or optional.",
	          "default": false },

	        "schema": {
	          "$ref": "#/definitions/schema" } },


	      "additionalProperties": false },

	    "headerParameterSubSchema": {
	      "additionalProperties": false,
	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } },


	      "properties": {
	        "required": {
	          "type": "boolean",
	          "description": "Determines whether or not this parameter is required or optional.",
	          "default": false },

	        "in": {
	          "type": "string",
	          "description": "Determines the location of the parameter.",
	          "enum": [
	          "header"] },


	        "description": {
	          "type": "string",
	          "description": "A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed." },

	        "name": {
	          "type": "string",
	          "description": "The name of the parameter." },

	        "type": {
	          "type": "string",
	          "enum": [
	          "string",
	          "number",
	          "boolean",
	          "integer",
	          "array"] },


	        "format": {
	          "type": "string" },

	        "items": {
	          "$ref": "#/definitions/primitivesItems" },

	        "collectionFormat": {
	          "$ref": "#/definitions/collectionFormat" },

	        "default": {
	          "$ref": "#/definitions/default" },

	        "maximum": {
	          "$ref": "#/definitions/maximum" },

	        "exclusiveMaximum": {
	          "$ref": "#/definitions/exclusiveMaximum" },

	        "minimum": {
	          "$ref": "#/definitions/minimum" },

	        "exclusiveMinimum": {
	          "$ref": "#/definitions/exclusiveMinimum" },

	        "maxLength": {
	          "$ref": "#/definitions/maxLength" },

	        "minLength": {
	          "$ref": "#/definitions/minLength" },

	        "pattern": {
	          "$ref": "#/definitions/pattern" },

	        "maxItems": {
	          "$ref": "#/definitions/maxItems" },

	        "minItems": {
	          "$ref": "#/definitions/minItems" },

	        "uniqueItems": {
	          "$ref": "#/definitions/uniqueItems" },

	        "enum": {
	          "$ref": "#/definitions/enum" },

	        "multipleOf": {
	          "$ref": "#/definitions/multipleOf" } } },



	    "queryParameterSubSchema": {
	      "additionalProperties": false,
	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } },


	      "properties": {
	        "required": {
	          "type": "boolean",
	          "description": "Determines whether or not this parameter is required or optional.",
	          "default": false },

	        "in": {
	          "type": "string",
	          "description": "Determines the location of the parameter.",
	          "enum": [
	          "query"] },


	        "description": {
	          "type": "string",
	          "description": "A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed." },

	        "name": {
	          "type": "string",
	          "description": "The name of the parameter." },

	        "allowEmptyValue": {
	          "type": "boolean",
	          "default": false,
	          "description": "allows sending a parameter by name only or with an empty value." },

	        "type": {
	          "type": "string",
	          "enum": [
	          "string",
	          "number",
	          "boolean",
	          "integer",
	          "array"] },


	        "format": {
	          "type": "string" },

	        "items": {
	          "$ref": "#/definitions/primitivesItems" },

	        "collectionFormat": {
	          "$ref": "#/definitions/collectionFormatWithMulti" },

	        "default": {
	          "$ref": "#/definitions/default" },

	        "maximum": {
	          "$ref": "#/definitions/maximum" },

	        "exclusiveMaximum": {
	          "$ref": "#/definitions/exclusiveMaximum" },

	        "minimum": {
	          "$ref": "#/definitions/minimum" },

	        "exclusiveMinimum": {
	          "$ref": "#/definitions/exclusiveMinimum" },

	        "maxLength": {
	          "$ref": "#/definitions/maxLength" },

	        "minLength": {
	          "$ref": "#/definitions/minLength" },

	        "pattern": {
	          "$ref": "#/definitions/pattern" },

	        "maxItems": {
	          "$ref": "#/definitions/maxItems" },

	        "minItems": {
	          "$ref": "#/definitions/minItems" },

	        "uniqueItems": {
	          "$ref": "#/definitions/uniqueItems" },

	        "enum": {
	          "$ref": "#/definitions/enum" },

	        "multipleOf": {
	          "$ref": "#/definitions/multipleOf" } } },



	    "formDataParameterSubSchema": {
	      "additionalProperties": false,
	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } },


	      "properties": {
	        "required": {
	          "type": "boolean",
	          "description": "Determines whether or not this parameter is required or optional.",
	          "default": false },

	        "in": {
	          "type": "string",
	          "description": "Determines the location of the parameter.",
	          "enum": [
	          "formData"] },


	        "description": {
	          "type": "string",
	          "description": "A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed." },

	        "name": {
	          "type": "string",
	          "description": "The name of the parameter." },

	        "allowEmptyValue": {
	          "type": "boolean",
	          "default": false,
	          "description": "allows sending a parameter by name only or with an empty value." },

	        "type": {
	          "type": "string",
	          "enum": [
	          "string",
	          "number",
	          "boolean",
	          "integer",
	          "array",
	          "file"] },


	        "format": {
	          "type": "string" },

	        "items": {
	          "$ref": "#/definitions/primitivesItems" },

	        "collectionFormat": {
	          "$ref": "#/definitions/collectionFormatWithMulti" },

	        "default": {
	          "$ref": "#/definitions/default" },

	        "maximum": {
	          "$ref": "#/definitions/maximum" },

	        "exclusiveMaximum": {
	          "$ref": "#/definitions/exclusiveMaximum" },

	        "minimum": {
	          "$ref": "#/definitions/minimum" },

	        "exclusiveMinimum": {
	          "$ref": "#/definitions/exclusiveMinimum" },

	        "maxLength": {
	          "$ref": "#/definitions/maxLength" },

	        "minLength": {
	          "$ref": "#/definitions/minLength" },

	        "pattern": {
	          "$ref": "#/definitions/pattern" },

	        "maxItems": {
	          "$ref": "#/definitions/maxItems" },

	        "minItems": {
	          "$ref": "#/definitions/minItems" },

	        "uniqueItems": {
	          "$ref": "#/definitions/uniqueItems" },

	        "enum": {
	          "$ref": "#/definitions/enum" },

	        "multipleOf": {
	          "$ref": "#/definitions/multipleOf" } } },



	    "pathParameterSubSchema": {
	      "additionalProperties": false,
	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } },


	      "required": [
	      "required"],

	      "properties": {
	        "required": {
	          "type": "boolean",
	          "enum": [
	          true],

	          "description": "Determines whether or not this parameter is required or optional." },

	        "in": {
	          "type": "string",
	          "description": "Determines the location of the parameter.",
	          "enum": [
	          "path"] },


	        "description": {
	          "type": "string",
	          "description": "A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed." },

	        "name": {
	          "type": "string",
	          "description": "The name of the parameter." },

	        "type": {
	          "type": "string",
	          "enum": [
	          "string",
	          "number",
	          "boolean",
	          "integer",
	          "array"] },


	        "format": {
	          "type": "string" },

	        "items": {
	          "$ref": "#/definitions/primitivesItems" },

	        "collectionFormat": {
	          "$ref": "#/definitions/collectionFormat" },

	        "default": {
	          "$ref": "#/definitions/default" },

	        "maximum": {
	          "$ref": "#/definitions/maximum" },

	        "exclusiveMaximum": {
	          "$ref": "#/definitions/exclusiveMaximum" },

	        "minimum": {
	          "$ref": "#/definitions/minimum" },

	        "exclusiveMinimum": {
	          "$ref": "#/definitions/exclusiveMinimum" },

	        "maxLength": {
	          "$ref": "#/definitions/maxLength" },

	        "minLength": {
	          "$ref": "#/definitions/minLength" },

	        "pattern": {
	          "$ref": "#/definitions/pattern" },

	        "maxItems": {
	          "$ref": "#/definitions/maxItems" },

	        "minItems": {
	          "$ref": "#/definitions/minItems" },

	        "uniqueItems": {
	          "$ref": "#/definitions/uniqueItems" },

	        "enum": {
	          "$ref": "#/definitions/enum" },

	        "multipleOf": {
	          "$ref": "#/definitions/multipleOf" } } },



	    "nonBodyParameter": {
	      "type": "object",
	      "required": [
	      "name",
	      "in",
	      "type"],

	      "oneOf": [
	      {
	        "$ref": "#/definitions/headerParameterSubSchema" },

	      {
	        "$ref": "#/definitions/formDataParameterSubSchema" },

	      {
	        "$ref": "#/definitions/queryParameterSubSchema" },

	      {
	        "$ref": "#/definitions/pathParameterSubSchema" }] },



	    "parameter": {
	      "oneOf": [
	      {
	        "$ref": "#/definitions/bodyParameter" },

	      {
	        "$ref": "#/definitions/nonBodyParameter" }] },



	    "schema": {
	      "type": "object",
	      "description": "A deterministic version of a JSON Schema object.",
	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } },


	      "properties": {
	        "$ref": {
	          "type": "string" },

	        "format": {
	          "type": "string" },

	        "title": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/title" },

	        "description": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/description" },

	        "default": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/default" },

	        "multipleOf": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/multipleOf" },

	        "maximum": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/maximum" },

	        "exclusiveMaximum": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/exclusiveMaximum" },

	        "minimum": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/minimum" },

	        "exclusiveMinimum": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/exclusiveMinimum" },

	        "maxLength": {
	          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger" },

	        "minLength": {
	          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0" },

	        "pattern": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/pattern" },

	        "maxItems": {
	          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger" },

	        "minItems": {
	          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0" },

	        "uniqueItems": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/uniqueItems" },

	        "maxProperties": {
	          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger" },

	        "minProperties": {
	          "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0" },

	        "required": {
	          "$ref": "http://json-schema.org/draft-04/schema#/definitions/stringArray" },

	        "enum": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/enum" },

	        "additionalProperties": {
	          "anyOf": [
	          {
	            "$ref": "#/definitions/schema" },

	          {
	            "type": "boolean" }],


	          "default": {} },

	        "type": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/type" },

	        "items": {
	          "anyOf": [
	          {
	            "$ref": "#/definitions/schema" },

	          {
	            "type": "array",
	            "minItems": 1,
	            "items": {
	              "$ref": "#/definitions/schema" } }],



	          "default": {} },

	        "allOf": {
	          "type": "array",
	          "minItems": 1,
	          "items": {
	            "$ref": "#/definitions/schema" } },


	        "properties": {
	          "type": "object",
	          "additionalProperties": {
	            "$ref": "#/definitions/schema" },

	          "default": {} },

	        "discriminator": {
	          "type": "string" },

	        "readOnly": {
	          "type": "boolean",
	          "default": false },

	        "xml": {
	          "$ref": "#/definitions/xml" },

	        "externalDocs": {
	          "$ref": "#/definitions/externalDocs" },

	        "example": {} },

	      "additionalProperties": false },

	    "fileSchema": {
	      "type": "object",
	      "description": "A deterministic version of a JSON Schema object.",
	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } },


	      "required": [
	      "type"],

	      "properties": {
	        "format": {
	          "type": "string" },

	        "title": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/title" },

	        "description": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/description" },

	        "default": {
	          "$ref": "http://json-schema.org/draft-04/schema#/properties/default" },

	        "required": {
	          "$ref": "http://json-schema.org/draft-04/schema#/definitions/stringArray" },

	        "type": {
	          "type": "string",
	          "enum": [
	          "file"] },


	        "readOnly": {
	          "type": "boolean",
	          "default": false },

	        "externalDocs": {
	          "$ref": "#/definitions/externalDocs" },

	        "example": {} },

	      "additionalProperties": false },

	    "primitivesItems": {
	      "type": "object",
	      "additionalProperties": false,
	      "properties": {
	        "type": {
	          "type": "string",
	          "enum": [
	          "string",
	          "number",
	          "integer",
	          "boolean",
	          "array"] },


	        "format": {
	          "type": "string" },

	        "items": {
	          "$ref": "#/definitions/primitivesItems" },

	        "collectionFormat": {
	          "$ref": "#/definitions/collectionFormat" },

	        "default": {
	          "$ref": "#/definitions/default" },

	        "maximum": {
	          "$ref": "#/definitions/maximum" },

	        "exclusiveMaximum": {
	          "$ref": "#/definitions/exclusiveMaximum" },

	        "minimum": {
	          "$ref": "#/definitions/minimum" },

	        "exclusiveMinimum": {
	          "$ref": "#/definitions/exclusiveMinimum" },

	        "maxLength": {
	          "$ref": "#/definitions/maxLength" },

	        "minLength": {
	          "$ref": "#/definitions/minLength" },

	        "pattern": {
	          "$ref": "#/definitions/pattern" },

	        "maxItems": {
	          "$ref": "#/definitions/maxItems" },

	        "minItems": {
	          "$ref": "#/definitions/minItems" },

	        "uniqueItems": {
	          "$ref": "#/definitions/uniqueItems" },

	        "enum": {
	          "$ref": "#/definitions/enum" },

	        "multipleOf": {
	          "$ref": "#/definitions/multipleOf" } },


	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "security": {
	      "type": "array",
	      "items": {
	        "$ref": "#/definitions/securityRequirement" },

	      "uniqueItems": true },

	    "securityRequirement": {
	      "type": "object",
	      "additionalProperties": {
	        "type": "array",
	        "items": {
	          "type": "string" },

	        "uniqueItems": true } },


	    "xml": {
	      "type": "object",
	      "additionalProperties": false,
	      "properties": {
	        "name": {
	          "type": "string" },

	        "namespace": {
	          "type": "string" },

	        "prefix": {
	          "type": "string" },

	        "attribute": {
	          "type": "boolean",
	          "default": false },

	        "wrapped": {
	          "type": "boolean",
	          "default": false } },


	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "tag": {
	      "type": "object",
	      "additionalProperties": false,
	      "required": [
	      "name"],

	      "properties": {
	        "name": {
	          "type": "string" },

	        "description": {
	          "type": "string" },

	        "externalDocs": {
	          "$ref": "#/definitions/externalDocs" } },


	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "securityDefinitions": {
	      "type": "object",
	      "additionalProperties": {
	        "oneOf": [
	        {
	          "$ref": "#/definitions/basicAuthenticationSecurity" },

	        {
	          "$ref": "#/definitions/apiKeySecurity" },

	        {
	          "$ref": "#/definitions/oauth2ImplicitSecurity" },

	        {
	          "$ref": "#/definitions/oauth2PasswordSecurity" },

	        {
	          "$ref": "#/definitions/oauth2ApplicationSecurity" },

	        {
	          "$ref": "#/definitions/oauth2AccessCodeSecurity" }] } },




	    "basicAuthenticationSecurity": {
	      "type": "object",
	      "additionalProperties": false,
	      "required": [
	      "type"],

	      "properties": {
	        "type": {
	          "type": "string",
	          "enum": [
	          "basic"] },


	        "description": {
	          "type": "string" } },


	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "apiKeySecurity": {
	      "type": "object",
	      "additionalProperties": false,
	      "required": [
	      "type",
	      "name",
	      "in"],

	      "properties": {
	        "type": {
	          "type": "string",
	          "enum": [
	          "apiKey"] },


	        "name": {
	          "type": "string" },

	        "in": {
	          "type": "string",
	          "enum": [
	          "header",
	          "query"] },


	        "description": {
	          "type": "string" } },


	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "oauth2ImplicitSecurity": {
	      "type": "object",
	      "additionalProperties": false,
	      "required": [
	      "type",
	      "flow",
	      "authorizationUrl"],

	      "properties": {
	        "type": {
	          "type": "string",
	          "enum": [
	          "oauth2"] },


	        "flow": {
	          "type": "string",
	          "enum": [
	          "implicit"] },


	        "scopes": {
	          "$ref": "#/definitions/oauth2Scopes" },

	        "authorizationUrl": {
	          "type": "string",
	          "format": "uri" },

	        "description": {
	          "type": "string" } },


	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "oauth2PasswordSecurity": {
	      "type": "object",
	      "additionalProperties": false,
	      "required": [
	      "type",
	      "flow",
	      "tokenUrl"],

	      "properties": {
	        "type": {
	          "type": "string",
	          "enum": [
	          "oauth2"] },


	        "flow": {
	          "type": "string",
	          "enum": [
	          "password"] },


	        "scopes": {
	          "$ref": "#/definitions/oauth2Scopes" },

	        "tokenUrl": {
	          "type": "string",
	          "format": "uri" },

	        "description": {
	          "type": "string" } },


	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "oauth2ApplicationSecurity": {
	      "type": "object",
	      "additionalProperties": false,
	      "required": [
	      "type",
	      "flow",
	      "tokenUrl"],

	      "properties": {
	        "type": {
	          "type": "string",
	          "enum": [
	          "oauth2"] },


	        "flow": {
	          "type": "string",
	          "enum": [
	          "application"] },


	        "scopes": {
	          "$ref": "#/definitions/oauth2Scopes" },

	        "tokenUrl": {
	          "type": "string",
	          "format": "uri" },

	        "description": {
	          "type": "string" } },


	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "oauth2AccessCodeSecurity": {
	      "type": "object",
	      "additionalProperties": false,
	      "required": [
	      "type",
	      "flow",
	      "authorizationUrl",
	      "tokenUrl"],

	      "properties": {
	        "type": {
	          "type": "string",
	          "enum": [
	          "oauth2"] },


	        "flow": {
	          "type": "string",
	          "enum": [
	          "accessCode"] },


	        "scopes": {
	          "$ref": "#/definitions/oauth2Scopes" },

	        "authorizationUrl": {
	          "type": "string",
	          "format": "uri" },

	        "tokenUrl": {
	          "type": "string",
	          "format": "uri" },

	        "description": {
	          "type": "string" } },


	      "patternProperties": {
	        "^x-": {
	          "$ref": "#/definitions/vendorExtension" } } },



	    "oauth2Scopes": {
	      "type": "object",
	      "additionalProperties": {
	        "type": "string" } },


	    "mediaTypeList": {
	      "type": "array",
	      "items": {
	        "$ref": "#/definitions/mimeType" },

	      "uniqueItems": true },

	    "parametersList": {
	      "type": "array",
	      "description": "The parameters needed to send a valid API call.",
	      "additionalItems": false,
	      "items": {
	        "oneOf": [
	        {
	          "$ref": "#/definitions/parameter" },

	        {
	          "$ref": "#/definitions/jsonReference" }] },



	      "uniqueItems": true },

	    "schemesList": {
	      "type": "array",
	      "description": "The transfer protocol of the API.",
	      "items": {
	        "type": "string",
	        "enum": [
	        "http",
	        "https",
	        "ws",
	        "wss"] },


	      "uniqueItems": true },

	    "collectionFormat": {
	      "type": "string",
	      "enum": [
	      "csv",
	      "ssv",
	      "tsv",
	      "pipes"],

	      "default": "csv" },

	    "collectionFormatWithMulti": {
	      "type": "string",
	      "enum": [
	      "csv",
	      "ssv",
	      "tsv",
	      "pipes",
	      "multi"],

	      "default": "csv" },

	    "title": {
	      "$ref": "http://json-schema.org/draft-04/schema#/properties/title" },

	    "description": {
	      "$ref": "http://json-schema.org/draft-04/schema#/properties/description" },

	    "default": {
	      "$ref": "http://json-schema.org/draft-04/schema#/properties/default" },

	    "multipleOf": {
	      "$ref": "http://json-schema.org/draft-04/schema#/properties/multipleOf" },

	    "maximum": {
	      "$ref": "http://json-schema.org/draft-04/schema#/properties/maximum" },

	    "exclusiveMaximum": {
	      "$ref": "http://json-schema.org/draft-04/schema#/properties/exclusiveMaximum" },

	    "minimum": {
	      "$ref": "http://json-schema.org/draft-04/schema#/properties/minimum" },

	    "exclusiveMinimum": {
	      "$ref": "http://json-schema.org/draft-04/schema#/properties/exclusiveMinimum" },

	    "maxLength": {
	      "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger" },

	    "minLength": {
	      "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0" },

	    "pattern": {
	      "$ref": "http://json-schema.org/draft-04/schema#/properties/pattern" },

	    "maxItems": {
	      "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveInteger" },

	    "minItems": {
	      "$ref": "http://json-schema.org/draft-04/schema#/definitions/positiveIntegerDefault0" },

	    "uniqueItems": {
	      "$ref": "http://json-schema.org/draft-04/schema#/properties/uniqueItems" },

	    "enum": {
	      "$ref": "http://json-schema.org/draft-04/schema#/properties/enum" },

	    "jsonReference": {
	      "type": "object",
	      "required": [
	      "$ref"],

	      "additionalProperties": false,
	      "properties": {
	        "$ref": {
	          "type": "string" } } } } };

/***/ })
/******/ ]);
//# sourceMappingURL=validation.worker.js.map