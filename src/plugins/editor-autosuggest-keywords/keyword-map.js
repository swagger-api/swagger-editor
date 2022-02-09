
var Bool = ["true", "false"]
var Anything = String

var combine = (...objs) => objs ? Object.assign({}, ...objs) : {}

var makeValue = (val = "") => {
  return {
    __value: val
  }
}

var emptyValue = makeValue("")

var externalDocs = {
  description: String,
  url: String
}


var xml = {
  name: String,
  namespace: String,
  prefix: String,
  attribute: Bool,
  wrapped: Bool
}

var schema = {
  $ref: String,
  format: String,
  title: String,
  description: String,
  default: String,
  maximum: Number,
  minimum: Number,
  exclusiveMaximum: Bool,
  exclusiveMinimum: Bool,
  maxLength: Number,
  minLength: Number,
  pattern: String,
  maxItems: Number,
  minItems: Number,
  uniqueItems: Bool,
  enum: [String],
  multipleOf: Number,
  maxProperties: Number,
  minProperties: Number,
  required: [String],
  type: ["string", "number", "integer", "boolean", "array", "object"],
  get items () { return this },
  get allOf () { return [this] },
  get properties () {
    return {
      ".": this
    }
  },
  get additionalProperties () { return this },
  discriminator: String,
  readOnly: Bool,
  xml: xml,
  externalDocs: externalDocs,
  example: String
}

var schemes = [
  "http",
  "https",
  "ws",
  "wss"
]

var items = {
  type: ["string", "number", "integer", "boolean", "array"],
  format: String,
  get items () { return this },
  collectionFormat: ["csv"],
  default: Anything,
  minimum: String,
  maximum: String,
  exclusiveMinimum: Bool,
  exclusiveMaximum: Bool,
  minLength: String,
  maxLength: String,
  pattern: String,
  minItems: String,
  maxItems: String,
  uniqueItems: Bool,
  enum: [Anything],
  multipleOf: String
}

var header = {
  description: String,
  type: String,
  format: String,
  items: items,
  collectionFormat: ["csv"],
  default: Anything,
  enum: [String],
  minimum: String,
  maximum: String,
  exclusiveMinimum: Bool,
  exclusiveMaximum: Bool,
  multipleOf: String,
  maxLength: String,
  minLength: String,
  pattern: String,
  minItems: String,
  maxItems: String,
  uniqueItems: Bool
}

var parameter = {
  name: String,
  description: String,
  required: ["true", "false"],
  type:  [
    "string",
    "number",
    "boolean",
    "integer",
    "array",
    "file"
  ],
  format: String,
  schema: schema,
  enum: [String],
  minimum: String,
  maximum: String,
  exclusiveMinimum: Bool,
  exclusiveMaximum: Bool,
  multipleOf: String,
  maxLength: String,
  minLength: String,
  pattern: String,
  minItems: String,
  maxItems: String,
  uniqueItems: Bool,
  allowEmptyValue: Bool,
  collectionFormat: ["csv", "multi"],
  default: String,
  items: items,
  in: [
    "body",
    "formData",
    "header",
    "path",
    "query"
  ]
}

var reference = {
  "$ref": String
}

var response = {
  description: String,
  schema: schema,
  headers: {
    ".": combine(header, {
      __value: ""
    })
  },
  examples: String
}

var operation = {
  summary: String,
  description: String,
  schemes: [schemes],
  externalDocs: externalDocs,
  operationId: String,
  produces: [String],
  consumes: [String],
  deprecated: Bool,
  security: [String],
  parameters: [combine(reference, parameter)],
  responses: {
    "[2-6][0-9][0-9]": combine(reference, response, emptyValue),
    "default": combine(reference, response)
  },
  tags: [String]
}

var securityScheme = {
  type: ["oauth2", "apiKey", "basic"],
  description: String,
  name: String,
  in: ["query", "header"],
  flow: ["implicit", "password", "application", "accessCode"],
  authorizationUrl: String,
  tokenUrl: String,
  scopes: String // actually an object, but this is equivalent
}

var info = {
  version: String,
  title: String,
  description: String,
  termsOfService: String,
  contact: {
    name: String,
    url: String,
    email: String
  },
  license: {
    name: String,
    url: String
  }
}

var map = {
  swagger: ["'2.0'"],
  info: info,

  host: String,
  basePath: String,

  schemes: [schemes],
  produces: [String],
  consumes: [String],

  paths: {

    //path
    ".": {
      __value: "",
      parameters: [combine(reference, parameter)],
      "get": operation,
      "put": operation,
      "post": operation,
      "delete": operation,
      "options": operation,
      "head": operation,
      "patch": operation,
      "$ref": String
    }
  },

  definitions: {

    // Definition name
    ".": combine(schema, emptyValue)
  },

  parameters: {
    ".": combine(reference, parameter, emptyValue)
  },
  responses: {
    "[2-6][0-9][0-9]": combine(response, emptyValue)
  },
  securityDefinitions: {
    ".": combine(securityScheme, emptyValue)
  },
  security: [String],
  tags: [{
    name: String,
    description: String,
    externalDocs: externalDocs
  }],
  externalDocs: externalDocs
}

export default map
