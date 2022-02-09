// Adapted from OAS 3.0.0-rc2

// comma dangles in this file = cleaner diffs
/*eslint comma-dangle: ["error", "always-multiline"]*/

// anyOf and combine are the same for now.
// they are seperated for semantics, and for possible future improvement
const anyOf = (...objs) => objs ? Object.assign({}, ...objs) : {}
const stringEnum = (arr) => arr

const Any = null

export const ExternalDocumentation = {
  description: String,
  url: String,
}

export const Contact = {
  name: String,
  url: String,
  email: String,
}

export const License = {
  name: String,
  url: String,
}

export const Info = {
  title: String,
  description: String,
  termsOfService: String,
  contact: Contact,
  license: License,
  version: String,
}

export const ServerVariable = {
  enum: [String],
  default: String,
  description: String,
}

export const XML = {
  name: String,
  namespace: String,
  prefix: String,
  attribute: Boolean,
  wrapped: Boolean,
}

export const OAuthFlow = {
  authorizationUrl: String,
  tokenUrl: String,
  refreshUrl: String,
  scopes: {
    ".": String,
  },
}

export const Reference = {
  "$ref": String,
}

export const Example = {
  summary: String,
  description: String,
  value: Any,
  externalValue: String,
}

export const SecurityRequirement = {
  ".": [String],
}

export const Server = {
  url: String,
  description: String,
  variables: {
    ".": ServerVariable,
  },
}

export const Link = {
  operationRef: String,
  operationId: String,
  parameters: {
    ".": Any,
  },
  requestBody: Any,
  description: String,
  server: Server,
}

export const Schema = {
  // Lifted from JSONSchema
  title: String,
  multipleOf: String,
  maximum: String,
  exclusiveMaximum: String,
  minimum: String,
  exclusiveMinimum: String,
  maxLength: String,
  minLength: String,
  pattern: RegExp,
  maxItems: String,
  minItems: String,
  uniqueItems: Boolean,
  maxProperties: String,
  minProperties: String,
  required: Boolean,
  enum: String,
  // Adapted from JSONSchema
  type: String,
  get allOf () { return this },
  get oneOf () { return this },
  get anyOf () { return this },
  get not () { return this },
  get items () { return this },
  get properties () {
    return {
      ".": this,
    }
  },
  get additionalProperties () { return this },
  description: String,
  format: String,
  default: Any,
  nullable: Boolean,
  readOnly: Boolean,
  writeOnly: Boolean,
  xml: XML,
  externalDocs: ExternalDocumentation,
  example: Any,
  deprecated: Boolean,
}

export const Encoding = {
  contentType: String,
  headers: {
    ".": undefined,
  },
  style: stringEnum(["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"]),
  explode: Boolean,
  allowReserved: Boolean,
}

export const MediaType = {
  schema: anyOf(Schema, Reference),
  example: Any,
  examples: {
    ".": anyOf(Example, Reference),
  },
  encoding: {
    ".": Encoding,
  },
}

export const Parameter = {
  name: String,
  in: stringEnum(["query", "header", "path", "cookie"]),
  description: String,
  required: Boolean,
  deprecated: Boolean,
  allowEmptyValue: Boolean,
  style: stringEnum(["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"]),
  explode: String,
  allowReserved: Boolean,
  schema: anyOf(Schema, Reference),
  example: Any,
  examples: {
    ".": anyOf(Example, Reference),
  },
  content: {
    ".": MediaType,
  },
}

export const Header = {
  description: String,
  required: Boolean,
  deprecated: Boolean,
  allowEmptyValue: Boolean,
  style: stringEnum(["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"]),
  explode: String,
  allowReserved: Boolean,
  schema: anyOf(Schema, Reference),
  example: Any,
  examples: {
    ".": anyOf(Example, Reference),
  },
  content: {
    ".": MediaType,
  },
}

export const RequestBody = {
  description: String,
  content: {
    ".": MediaType,
  },
}

export const Response = {
  description: String,
  headers: {
    ".": anyOf(Header, Reference),
  },
  content: {
    ".": MediaType,
  },
  links: {
    ".": anyOf(Link, Reference),
  },
}

export const Responses = {
  default: anyOf(Response, Reference),
  "\\d\\d\\d|\\d\\dX|\\dXX": anyOf(Response, Reference),
}

export const Callback = {
  // ".": PathItem,
}

export const Tag = {
  name: String,
  description: String,
  externalDocs: ExternalDocumentation,
}

export const OAuthFlows = {
  implicit: OAuthFlow,
  password: OAuthFlow,
  clientCredentials: OAuthFlow,
  authorizationCode: OAuthFlow,
}

export const SecurityScheme = {
  type: String,
  description: String,
  name: String,
  in: String,
  scheme: String,
  bearerFormat: String,
  flows: OAuthFlows,
  openIdConnectUrl: String,
}

const ComponentFixedFieldRegex = "^[a-zA-Z0-9._-]+$"

export const Components = {
  schemas: {
    [ComponentFixedFieldRegex]: anyOf(Schema, Reference),
  },
  responses: {
    [ComponentFixedFieldRegex]: anyOf(Response, Reference),
  },
  parameters: {
    [ComponentFixedFieldRegex]: anyOf(Parameter, Reference),
  },
  examples: {
    [ComponentFixedFieldRegex]: anyOf(Example, Reference),
  },
  requestBodies: {
    [ComponentFixedFieldRegex]: anyOf(RequestBody, Reference),
  },
  headers: {
    [ComponentFixedFieldRegex]: anyOf(Header, Reference),
  },
  securitySchemes: {
    [ComponentFixedFieldRegex]: anyOf(SecurityScheme, Reference),
  },
  links: {
    [ComponentFixedFieldRegex]: anyOf(Link, Reference),
  },
  callbacks: {
    get [ComponentFixedFieldRegex]() { return anyOf(Callback, Reference) },
  },
}

export const Operation = {
  tags: [String],
  summary: String,
  description: String,
  externalDocs: ExternalDocumentation,
  operationId: String,
  parameters: [anyOf(Parameter, Reference)],
  requestBody: anyOf(RequestBody, Reference),
  responses: Responses,
  get callbacks() {
    return {
      ".": anyOf(Callback, Reference),
    }
  },
  deprecated: Boolean,
  security: [SecurityRequirement],
  servers: [Server],
}

export const Discriminator = {
  propertyName: String,
  mapping: {
    ".": String,
  },
}

export const PathItem = anyOf(Reference, {
  summary: String,
  description: String,
  get: Operation,
  put: Operation,
  post: Operation,
  delete: Operation,
  options: Operation,
  head: Operation,
  patch: Operation,
  trace: Operation,
  servers: Server,
  parameters: anyOf(Parameter, Reference),
})

export const Paths = {
  "/.": PathItem,
}

// solves `PathItem -> Operation -> Callback -> PathItem` circular reference
Callback["."] = PathItem

// solves `Encoding -> Header -> MediaType -> Encoding` circular reference
Encoding.headers["."] = Header
