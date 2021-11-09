import { isObjectElement, isStringElement } from '@swagger-api/apidom-core';

import configAsyncapi from './asyncapi/config';
/* METADATA */

const configOpenapi = {
  openApi3_1: {
    yaml: {
      completion: [
        {
          label: 'openapi',
          kind: 10,
          insertText: 'openapi: $1\n',
          insertTextFormat: 2,
          documentation: 'Add `openapi` property',
        },
        {
          label: 'info',
          kind: 10,
          insertText: 'info: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `info` section',
        },
        {
          label: 'jsonSchemaDialect',
          kind: 10,
          insertText: 'jsonSchemaDialect: $1\n',
          insertTextFormat: 2,
          documentation: 'Add `jsonSchemaDialect` property',
        },
        {
          label: 'servers',
          kind: 10,
          insertText: 'servers: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `servers` section',
        },
        {
          label: 'paths',
          kind: 10,
          insertText: 'paths: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `paths` section',
        },
        {
          label: 'webhooks',
          kind: 10,
          insertText: 'webhooks: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `webhooks` section',
        },
        {
          label: 'components',
          kind: 10,
          insertText: 'components: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `components` section',
        },
        {
          label: 'security',
          kind: 10,
          insertText: 'security: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `security` section',
        },
        {
          label: 'tags',
          kind: 10,
          insertText: 'tags: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `tags` section',
        },
        {
          label: 'externalDocs',
          kind: 10,
          insertText: 'externalDocs: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `externalDocs` section',
        },
      ],
    },
    json: {
      completion: [
        {
          label: 'openapi',
          kind: 10,
          insertText: '"openapi": "$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `openapi` property',
        },
        {
          label: 'info',
          kind: 10,
          insertText: '"info": {\n  $1\n},\n',
          insertTextFormat: 2,
          documentation: 'Add `info` section',
        },
        {
          label: 'jsonSchemaDialect',
          kind: 10,
          insertText: '"jsonSchemaDialect": "$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `jsonSchemaDialect` property',
        },
        {
          label: 'servers',
          kind: 10,
          insertText: '"servers": [\n  $1\n],\n',
          insertTextFormat: 2,
          documentation: 'Add `servers` section',
        },
        {
          label: 'paths',
          kind: 10,
          insertText: '"paths": {\n  $1\n},\n',
          insertTextFormat: 2,
          documentation: 'Add `paths` section',
        },
        {
          label: 'webhooks',
          kind: 10,
          insertText: '"webhooks": {\n  $1\n},\n',
          insertTextFormat: 2,
          documentation: 'Add `webhooks` section',
        },
        {
          label: 'components',
          kind: 10,
          insertText: '"components": {\n  $1\n},\n',
          insertTextFormat: 2,
          documentation: 'Add `components` section',
        },
        {
          label: 'security',
          kind: 10,
          insertText: '"security": [\n  $1\n],\n',
          insertTextFormat: 2,
          documentation: 'Add `security` section',
        },
        {
          label: 'tags',
          kind: 10,
          insertText: '"tags": [\n  $1\n],\n',
          insertTextFormat: 2,
          documentation: 'Add `tags` section',
        },
        {
          label: 'externalDocs',
          kind: 10,
          insertText: '"externalDocs": {\n  $1\n},\n',
          insertTextFormat: 2,
          documentation: 'Add `externalDocs` section',
        },
      ],
    },
  },
  '*': {
    lint: [
      {
        code: 0,
        source: 'apilint',
        message: 'UPPERCASE Not allowed!',
        severity: 1,
        linterFunction: 'noUpperCaseLinter',
        marker: 'value',
        data: {
          quickFix: [
            {
              message: 'transform to lowercase',
              function: 'tranformToLowercase',
              action: 'transformValue',
            },
          ],
        },
      },
    ],
  },
  info: {
    lint: [
      {
        code: 2,
        source: 'apilint',
        message: "should always have a 'description'",
        severity: 1,
        linterFunction: 'infoLinter',
        marker: 'key',
        data: {
          quickFix: [
            {
              message: "add 'description' field",
              function: 'addDescription',
              action: 'addChild',
              snippetYaml: 'description: \n  ',
              snippetJson: '"description": "",\n    ',
            },
          ],
        },
      },
    ],
    yaml: {
      completion: [
        {
          label: 'license',
          kind: 10,
          insertText: 'license: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `license` section',
        },
        {
          label: 'version',
          kind: 10,
          insertText: 'version: $1\n',
          insertTextFormat: 2,
          documentation: 'Add `version` property',
        },
        {
          label: 'title',
          kind: 10,
          insertText: 'title: $1\n',
          insertTextFormat: 2,
          documentation: 'Add `title` property',
        },
        {
          label: 'summary',
          kind: 10,
          insertText: 'summary: $1\n',
          insertTextFormat: 2,
          documentation: 'Add `summary` property',
        },
        {
          label: 'description',
          kind: 10,
          insertText: 'description: $1\n',
          insertTextFormat: 2,
          documentation: 'Add `description` property',
        },
        {
          label: 'termsOfService',
          kind: 10,
          insertText: 'termsOfService: $1\n',
          insertTextFormat: 2,
          documentation: 'Add `termsOfService` property',
        },
        {
          label: 'contact',
          kind: 10,
          insertText: 'contact: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `contact` section',
        },
      ],
    },
    json: {
      completion: [
        {
          label: 'license',
          kind: 10,
          insertText: '"license": {\n  $1\n},\n',
          insertTextFormat: 2,
          documentation: 'Add `license` section',
        },
        {
          label: 'version',
          kind: 10,
          insertText: '"version": "$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `version` property',
        },
        {
          label: 'title',
          kind: 10,
          insertText: '"title": "$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `title` property',
        },
        {
          label: 'summary',
          kind: 10,
          insertText: '"summary": "$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `summary` property',
        },
        {
          label: 'description',
          kind: 10,
          insertText: '"description": "$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `description` property',
        },
        {
          label: 'termsOfService',
          kind: 10,
          insertText: '"termsOfService": "$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `termsOfService` property',
        },
        {
          label: 'contact',
          kind: 10,
          insertText: '"contact": {\n  $1\n},\n',
          insertTextFormat: 2,
          documentation: 'Add `contact` section',
        },
      ],
    },
  },
  contact: {
    lint: [
      {
        code: 3,
        source: 'apilint',
        message: "should always have a 'name'",
        severity: 1,
        linterFunction: 'contactLinter',
        marker: 'key',
        data: {
          quickFix: [
            {
              message: "add 'name' field",
              function: 'addName',
              action: 'addChild',
              snippetYaml: 'name: \n    ',
              snippetJson: '"name": "",\n      ',
            },
          ],
        },
      },
      {
        code: 4,
        source: 'apilint',
        message: "should always have a 'x-smartbear-team'",
        severity: 1,
        linterFunction: 'xLinter',
        marker: 'key',
        data: {
          quickFix: [
            {
              message: "add 'x-smartbear-team' field",
              function: 'addX',
              action: 'addChild',
              snippetYaml: 'x-smartbear-team: swagger\n    ',
              snippetJson: '"x-smartbear-team": "swagger",\n      ',
            },
          ],
        },
      },
    ],
    yaml: {
      completion: [
        {
          label: 'name',
          kind: 10,
          insertText: 'name: $1\n',
          insertTextFormat: 2,
          documentation: 'Add `name` property',
        },
        {
          label: 'url',
          kind: 10,
          insertText: 'url: $1\n',
          insertTextFormat: 2,
          documentation: 'Add `url` property',
        },
        {
          label: 'email',
          kind: 10,
          insertText: 'email: $1\n',
          insertTextFormat: 2,
          documentation: 'Add `email` property',
        },
        {
          label: 'x-smartbear-team',
          kind: 10,
          insertText: 'x-smartbear-team: swagger$1\n',
          insertTextFormat: 2,
          documentation: 'Add `x-smartbear-team` property',
        },
      ],
    },
    json: {
      completion: [
        {
          label: 'url',
          kind: 10,
          insertText: '"url": "$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `url` property',
        },
        {
          label: 'name',
          kind: 10,
          insertText: '"name": "$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `name` property',
        },
        {
          label: 'email',
          kind: 10,
          insertText: '"email": "$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `email` property',
        },
        {
          label: 'x-smartbear-team',
          kind: 10,
          insertText: '"x-smartbear-team": "swagger$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `x-smartbear-team` property',
        },
      ],
    },
  },
  operation: {
    documentation:
      'https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#operationObject\n\n#### Operation Object\n\nDescribes a single API operation on a path.\n\n##### Fixed Fields\n\nField Name | Type | Description\n---|:---:|---\n[tags](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#operationTags) | [`string`] | A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.\n[summary](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#operationSummary) | `string` | A short summary of what the operation does.\n[description](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#operationDescription) | `string` | A verbose explanation of the operation behavior. [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.\n[externalDocs](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#operationExternalDocs) | [External Documentation Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#externalDocumentationObject) | Additional external documentation for this operation.\n[operationId](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#operationId) | `string` | Unique string used to identify the operation. The id MUST be unique among all operations described in the API. The operationId value is **case-sensitive**. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.\n[parameters](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#operationParameters) | [[Parameter Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#parameterObject) \\| [Reference Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#referenceObject)] | A list of parameters that are applicable for this operation. If a parameter is already defined at the [Path Item](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#pathItemParameters), the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a [name](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#parameterName) and [location](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#parameterIn). The list can use the [Reference Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#referenceObject) to link to parameters that are defined at the [OpenAPI Object\'s components/parameters](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#componentsParameters).\n[requestBody](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#operationRequestBody) | [Request Body Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#requestBodyObject) \\| [Reference Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md##referenceObject) | The request body applicable for this operation.  The `requestBody` is fully supported in HTTP methods where the HTTP 1.1 specification [RFC7231](https://tools.ietf.org/html/rfc7231#section-4.3.1) has explicitly defined semantics for request bodies.  In other cases where the HTTP spec is vague (such as [GET](https://tools.ietf.org/html/rfc7231#section-4.3.1), [HEAD](https://tools.ietf.org/html/rfc7231#section-4.3.2) and [DELETE](https://tools.ietf.org/html/rfc7231#section-4.3.5)), `requestBody` is permitted but does not have well-defined semantics and SHOULD be avoided if possible.\n[responses](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#operationResponses) | [Responses Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#responsesObject) | The list of possible responses as they are returned from executing this operation.\n[callbacks](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#operationCallbacks) | Map[`string`, [Callback Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#callbackObject) \\| [Reference Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#referenceObject)] | A map of possible out-of band callbacks related to the parent operation. The key is a unique identifier for the Callback Object. Each value in the map is a [Callback Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#callbackObject) that describes a request that may be initiated by the API provider and the expected responses.\n[deprecated](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#operationDeprecated) | `boolean` | Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default value is `false`.\n[security](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#operationSecurity) | [[Security Requirement Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#securityRequirementObject)] | A declaration of which security mechanisms can be used for this operation. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. To make security optional, an empty security requirement (`{}`) can be included in the array. This definition overrides any declared top-level [`security`](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#oasSecurity). To remove a top-level security declaration, an empty array can be used.\n[servers](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#operationServers) | [[Server Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#serverObject)] | An alternative `server` array to service this operation. If an alternative `server` object is specified at the Path Item Object or Root level, it will be overridden by this value.\n\nThis object MAY be extended with [Specification Extensions](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#specificationExtensions).\n\n##### Operation Object Example\n\n```json\n{\n  "tags": [\n    "pet"\n  ],\n  "summary": "Updates a pet in the store with form data",\n  "operationId": "updatePetWithForm",\n  "parameters": [\n    {\n      "name": "petId",\n      "in": "path",\n      "description": "ID of pet that needs to be updated",\n      "required": true,\n      "schema": {\n        "type": "string"\n      }\n    }\n  ],\n  "requestBody": {\n    "content": {\n      "application/x-www-form-urlencoded": {\n        "schema": {\n          "type": "object",\n          "properties": {\n            "name": { \n              "description": "Updated name of the pet",\n              "type": "string"\n            },\n            "status": {\n              "description": "Updated status of the pet",\n              "type": "string"\n            }\n          },\n          "required": ["status"] \n        }\n      }\n    }\n  },\n  "responses": {\n    "200": {\n      "description": "Pet updated.",\n      "content": {\n        "application/json": {},\n        "application/xml": {}\n      }\n    },\n    "405": {\n      "description": "Method Not Allowed",\n      "content": {\n        "application/json": {},\n        "application/xml": {}\n      }\n    }\n  },\n  "security": [\n    {\n      "petstore_auth": [\n        "write:pets",\n        "read:pets"\n      ]\n    }\n  ]\n}\n```\n\n```yaml\ntags:\n- pet\nsummary: Updates a pet in the store with form data\noperationId: updatePetWithForm\nparameters:\n- name: petId\n  in: path\n  description: ID of pet that needs to be updated\n  required: true\n  schema:\n    type: string\nrequestBody:\n  content:\n    \'application/x-www-form-urlencoded\':\n      schema:\n       properties:\n          name: \n            description: Updated name of the pet\n            type: string\n          status:\n            description: Updated status of the pet\n            type: string\n       required:\n         - status\nresponses:\n  \'200\':\n    description: Pet updated.\n    content: \n      \'application/json\': {}\n      \'application/xml\': {}\n  \'405\':\n    description: Method Not Allowed\n    content: \n      \'application/json\': {}\n      \'application/xml\': {}\nsecurity:\n- petstore_auth:\n  - write:pets\n  - read:pets\n```',
    yaml: {
      completion: [
        {
          label: 'operationId',
          kind: 10,
          insertText: 'operationId: $1\n',
          insertTextFormat: 2,
          documentation: 'Add `operationId` property',
        },
      ],
    },
    json: {
      completion: [
        {
          label: 'operationId',
          kind: 10,
          insertText: '"operationId": "$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `operationId` property',
        },
      ],
    },
  },
  servers: {
    documentation:
      '#### Servers\n\nhttps://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#fixed-fields\n\nField Name | Type | Description\n---|:---:|---\n[servers](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#fixed-fields) | [[Server Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#serverObject)] | An array of Server Objects, which provide connectivity information to a target server. If the `servers` property is not provided, or is an empty array, the default value would be a [Server Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#serverObject) with a [url](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md##serverUrl) value of `/`.\n\n----\n\n#### [Server Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#serverObject)\n\nAn object representing a Server.\n\n##### Fixed Fields\n\nField Name | Type | Description\n---|:---:|---\n[url](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#serverUrl) | `string` | **REQUIRED**. A URL to the target host.  This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the OpenAPI document is being served. Variable substitutions will be made when a variable is named in `{`brackets`}`.\ndescription | `string` | An optional string describing the host designated by the URL. [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.\nvariables | Map[`string`, [Server Variable Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#serverVariableObject)] | A map between a variable name and its value.  The value is used for substitution in the server\'s URL template.\n\nThis object MAY be extended with [Specification Extensions](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#specificationExtensions).\n\n##### Server Object Example\n\nA single server would be described as:\n\n```json\n{\n  "url": "https://development.gigantic-server.com/v1",\n  "description": "Development server"\n}\n```\n\n```yaml\nurl: https://development.gigantic-server.com/v1\ndescription: Development server\n```\n\nThe following shows how multiple servers can be described, for example, at the OpenAPI Object\'s [`servers`](#oasServers):\n\n```json\n{\n  "servers": [\n    {\n      "url": "https://development.gigantic-server.com/v1",\n      "description": "Development server"\n    },\n    {\n      "url": "https://staging.gigantic-server.com/v1",\n      "description": "Staging server"\n    },\n    {\n      "url": "https://api.gigantic-server.com/v1",\n      "description": "Production server"\n    }\n  ]\n}\n```\n\n```yaml\nservers:\n- url: https://development.gigantic-server.com/v1\n  description: Development server\n- url: https://staging.gigantic-server.com/v1\n  description: Staging server\n- url: https://api.gigantic-server.com/v1\n  description: Production server\n```\n\nThe following shows how variables can be used for a server configuration:\n\n```json\n{\n  "servers": [\n    {\n      "url": "https://{username}.gigantic-server.com:{port}/{basePath}",\n      "description": "The production API server",\n      "variables": {\n        "username": {\n          "default": "demo",\n          "description": "this value is assigned by the service provider, in this example `gigantic-server.com`"\n        },\n        "port": {\n          "enum": [\n            "8443",\n            "443"\n          ],\n          "default": "8443"\n        },\n        "basePath": {\n          "default": "v2"\n        }\n      }\n    }\n  ]\n}\n```\n\n```yaml\nservers:\n- url: https://{username}.gigantic-server.com:{port}/{basePath}\n  description: The production API server\n  variables:\n    username:\n      # note! no enum here means it is an open value\n      default: demo\n      description: this value is assigned by the service provider, in this example `gigantic-server.com`\n    port:\n      enum:\n        - \'8443\'\n        - \'443\'\n      default: \'8443\'\n    basePath:\n      # open meaning there is the opportunity to use special base paths as assigned by the provider, default is `v2`\n      default: v2\n```\n\n\n#### [Server Variable Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#serverVariableObject)\n\nAn object representing a Server Variable for server URL template substitution.\n\n##### Fixed Fields\n\nField Name | Type | Description\n---|:---:|---\nenum | [`string`] | An enumeration of string values to be used if the substitution options are from a limited set. The array MUST NOT be empty.\ndefault | `string` |  **REQUIRED**. The default value to use for substitution, which SHALL be sent if an alternate value is _not_ supplied. Note this behavior is different than the [Schema Object\'s](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#schemaObject) treatment of default values, because in those cases parameter values are optional. If the [`enum`](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#serverVariableEnum) is defined, the value MUST exist in the enum\'s values.\ndescription | `string` | An optional description for the server variable. [CommonMark syntax](https://spec.commonmark.org/) MAY be used for rich text representation.\n\nThis object MAY be extended with [Specification Extensions](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#specificationExtensions).\n\n',
  },
};

/* LINT FUNCTIONS */

export const infoLinter = (element) => {
  if (element && isObjectElement(element) && element.element === 'info') {
    if (!element.get('description')) {
      return false;
    }
  }
  return true;
};

export const contactLinter = (element) => {
  if (element && isObjectElement(element) && element.element === 'contact') {
    if (!element.get('name')) {
      return false;
    }
  }
  return true;
};

export const xLinter = (element) => {
  if (element && isObjectElement(element) && element.element === 'contact') {
    if (!element.get('x-smartbear-team')) {
      return false;
    }
  }
  return true;
};

export const noUpperCaseLinter = (element) => {
  if (element && isStringElement(element)) {
    const re = /"/gi;
    if (
      String(element.toValue())
        .replace(re, '')
        .match(/^[A-Z]*$/)
    ) {
      return false;
    }
  }
  return true;
};

export const pascalCaseLinter = (element) => {
  if (element && isStringElement(element)) {
    const re = /"/gi;
    if (
      !String(element.toValue())
        .replace(re, '')
        .match(/^[a-z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?$/)
    ) {
      return false;
    }
  }
  return true;
};

/* LINT FUNCTIONS META */

export const linterFunctionsOpenapi = {
  infoLinter,
  noUpperCaseLinter,
  // pascalCaseLinter,
  contactLinter,
  xLinter,
};

export const linterFunctionsAsyncapi = {
  infoLinter,
  noUpperCaseLinter,
  contactLinter,
  // pascalCaseLinter,
  xLinter,
};

export default function config() {
  return {
    metadataMaps: {
      openapi: configOpenapi,
      asyncapi: configAsyncapi,
    },
    linterFunctions: {
      openapi: linterFunctionsOpenapi,
      asyncapi: linterFunctionsAsyncapi,
    },
  };
}
