/* METADATA */

let code = 0;

/* LINT */

/* LINT root */

const rootIdLint = {
  code,
  source: 'apilint',
  message: "'id' value must be a valid URI",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^[a-zA-Z]{1}[a-zA-Z0-9\\.\\+\\-]*\\:?[\\S|^\\:]*$'],
  marker: 'value',
  target: 'id',
  data: {},
};

/*
const rootIdLint = {
  code,
  source: 'apilint',
  message: "'id' value must be a valid URI",
  severity: 1,
  linterFunction: 'apilintFieldValueRegex',
  linterParams: [
    'id',
    "^aaa$",
  ],
  marker: 'value',
  target: 'id',
  data: {},
};
*/

code += 1;

const rootInfoLint = {
  code,
  source: 'apilint',
  message: "should always have a 'info' section",
  severity: 1,
  linterFunction: 'hasRequiredField',
  linterParams: ['info'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'info' section",
        action: 'addChild',
        snippetYaml: 'info: \n  $1\n',
        snippetJson: '"info": {\n  $1\n},\n',
      },
    ],
  },
};

code += 1;

const rootChannelsLint = {
  code,
  source: 'apilint',
  message: "should always have a 'channels' section",
  severity: 1,
  linterFunction: 'hasRequiredField',
  linterParams: ['channels'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'channels' section",
        action: 'addChild',
        snippetYaml: 'channels: \n  $1\n',
        snippetJson: '"channels": {\n  $1\n},\n',
      },
    ],
  },
};

code += 1;

// const rootLints = [rootAsyncapiLint];
const rootLints = [rootIdLint, rootInfoLint, rootChannelsLint];

const asyncapiVersionLint20 = {
  code,
  source: 'apilint',
  message: "'asyncapi' value must be 2.0.0",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['2\\.0\\.0'],
  marker: 'value',
  targetSpecs: [{ namespace: 'asyncapi', version: '2.0.0' }],
  data: {
    quickFix: [
      {
        message: "update to '2.0.0'",
        action: 'updateValue',
        functionParams: ['2.0.0'],
      },
    ],
  },
};
code += 1;
const asyncapiVersionLint21 = {
  code,
  source: 'apilint',
  message: "'asyncapi' value must be 2.1.0",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['2\\.1\\.0'],
  marker: 'value',
  targetSpecs: [{ namespace: 'asyncapi', version: '2.1.0' }],
  data: {
    quickFix: [
      {
        message: "update to '2.1.0'",
        action: 'updateValue',
        functionParams: ['2.1.0'],
      },
    ],
  },
};
code += 1;
const asyncapiVersionLint22 = {
  code,
  source: 'apilint',
  message: "'asyncapi' value must be 2.2.0",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['2\\.2\\.0'],
  marker: 'value',
  targetSpecs: [{ namespace: 'asyncapi', version: '2.2.0' }],
  data: {
    quickFix: [
      {
        message: "update to '2.2.0'",
        action: 'updateValue',
        functionParams: ['2.2.0'],
      },
    ],
  },
};
code += 1;
const asyncapiVersionLints = [asyncapiVersionLint20, asyncapiVersionLint21, asyncapiVersionLint22];

const securitySchemeLint2122 = {
  code,
  source: 'apilint',
  message: 'type must be one of allowed values',
  severity: 1,
  targetSpecs: [
    { namespace: 'asyncapi', version: '2.2.0' },
    { namespace: 'asyncapi', version: '2.1.0' },
  ],
  linterFunction: 'apilintValueRegex',
  linterParams: [
    '^userPassword|apiKey|X509|symmetricEncryption|asymmetricEncryption|httpApiKey|http|oauth2|openIdConnect|plain|scramSha256|scramSha512|gssapi$',
  ],
  marker: 'value',
  target: 'type',
  data: {
    quickFix: [
      {
        message: "update to 'userPassword'",
        action: 'updateValue',
        functionParams: ['userPassword'],
      },
      {
        message: "update to 'apiKey'",
        action: 'updateValue',
        functionParams: ['apiKey'],
      },
      {
        message: "update to 'X509'",
        action: 'updateValue',
        functionParams: ['X509'],
      },
      {
        message: "update to 'symmetricEncryption'",
        action: 'updateValue',
        functionParams: ['symmetricEncryption'],
      },
      {
        message: "update to 'asymmetricEncryption'",
        action: 'updateValue',
        functionParams: ['asymmetricEncryption'],
      },
      {
        message: "update to 'httpApiKey'",
        action: 'updateValue',
        functionParams: ['httpApiKey'],
      },
      {
        message: "update to 'http'",
        action: 'updateValue',
        functionParams: ['http'],
      },
      {
        message: "update to 'oauth2'",
        action: 'updateValue',
        functionParams: ['oauth2'],
      },
      {
        message: "update to 'openIdConnect'",
        action: 'updateValue',
        functionParams: ['openIdConnect'],
      },
      {
        message: "update to 'plain'",
        action: 'updateValue',
        functionParams: ['plain'],
      },
      {
        message: "update to 'scramSha256'",
        action: 'updateValue',
        functionParams: ['scramSha256'],
      },
      {
        message: "update to 'scramSha512'",
        action: 'updateValue',
        functionParams: ['scramSha512'],
      },
      {
        message: "update to 'gssapi'",
        action: 'updateValue',
        functionParams: ['gssapi'],
      },
      {
        message: 'clear',
        action: 'updateValue',
        functionParams: [''],
      },
    ],
  },
};
code += 1;

const securitySchemeLint20 = {
  code,
  source: 'apilint',
  message: 'type must be one of allowed values',
  severity: 1,
  targetSpecs: [{ namespace: 'asyncapi', version: '2.0.0' }],
  linterFunction: 'apilintValueRegex',
  linterParams: [
    '^userPassword|apiKey|X509|symmetricEncryption|asymmetricEncryption|httpApiKey|http|oauth2|openIdConnect$',
  ],
  marker: 'value',
  target: 'type',
  data: {
    quickFix: [
      {
        message: "update to 'userPassword'",
        action: 'updateValue',
        functionParams: ['userPassword'],
      },
      {
        message: "update to 'apiKey'",
        action: 'updateValue',
        functionParams: ['apiKey'],
      },
      {
        message: "update to 'X509'",
        action: 'updateValue',
        functionParams: ['X509'],
      },
      {
        message: "update to 'symmetricEncryption'",
        action: 'updateValue',
        functionParams: ['symmetricEncryption'],
      },
      {
        message: "update to 'asymmetricEncryption'",
        action: 'updateValue',
        functionParams: ['asymmetricEncryption'],
      },
      {
        message: "update to 'httpApiKey'",
        action: 'updateValue',
        functionParams: ['httpApiKey'],
      },
      {
        message: "update to 'http'",
        action: 'updateValue',
        functionParams: ['http'],
      },
      {
        message: "update to 'oauth2'",
        action: 'updateValue',
        functionParams: ['oauth2'],
      },
      {
        message: "update to 'openIdConnect'",
        action: 'updateValue',
        functionParams: ['openIdConnect'],
      },
      {
        message: 'clear',
        action: 'updateValue',
        functionParams: [''],
      },
    ],
  },
};
code += 1;

const securitySchemeLints = [securitySchemeLint2122, securitySchemeLint20];

const schema$IdLint = {
  code,
  source: 'apilint',
  message: "'$id' value must be a valid URI-reference",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^[a-zA-Z]{1}[a-zA-Z0-9\\.\\+\\-]*\\:?[\\S|^\\:]*$'],
  marker: 'value',
  target: '$id',
  data: {},
};
code += 1;
const schema$RefLint = {
  code,
  source: 'apilint',
  message: "'$ref' value must be a valid URI-reference",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^[a-zA-Z]{1}[a-zA-Z0-9\\.\\+\\-]*\\:?[\\S|^\\:]*$'],
  marker: 'value',
  target: '$ref',
  data: {},
};
code += 1;
const schemaTypeLint = {
  code,
  source: 'apilint',
  message: 'type must be one of allowed values',
  severity: 1,
  linterFunction: 'apilintValueOrArray',
  linterParams: [['null', 'boolean', 'object', 'array', 'number', 'string', 'integer']],
  marker: 'value',
  target: 'type',
  data: {
    quickFix: [
      {
        message: "update to 'null'",
        action: 'updateValue',
        functionParams: ['null'],
      },
      {
        message: "update to 'boolean'",
        action: 'updateValue',
        functionParams: ['boolean'],
      },
      {
        message: "update to 'object'",
        action: 'updateValue',
        functionParams: ['object'],
      },
      {
        message: "update to 'array'",
        action: 'updateValue',
        functionParams: ['array'],
      },
      {
        message: "update to 'number'",
        action: 'updateValue',
        functionParams: ['null'],
      },
      {
        message: "update to 'string'",
        action: 'updateValue',
        functionParams: ['string'],
      },
      {
        message: "update to 'integer'",
        action: 'updateValue',
        functionParams: ['integer'],
      },
    ],
  },
};
code += 1;
const schemaEnumLint = {
  code,
  source: 'apilint',
  message: "enum' value must be an array with unique values",
  severity: 1,
  linterFunction: 'apilintUniqueArray',
  marker: 'value',
  target: 'enum',
  data: {},
};
code += 1;
const schemaMultipleOfLint = {
  code,
  source: 'apilint',
  message: "multipleOf' value must be a number",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^-?\\d*\\.{0,1}\\d+$', 'number'],
  marker: 'value',
  target: 'multipleOf',
  data: {},
};
code += 1;
const schemaMaximumLint = {
  code,
  source: 'apilint',
  message: "maximum' value must be a number",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^-?\\d*\\.{0,1}\\d+$', 'number'],
  marker: 'value',
  target: 'maximum',
  data: {},
};
code += 1;
const schemaMinimumOfLint = {
  code,
  source: 'apilint',
  message: "minimum' value must be a number",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^-?\\d*\\.{0,1}\\d+$', 'number'],
  marker: 'value',
  target: 'minimum',
  data: {},
};
code += 1;
const schemaExclusiveMaximumLint = {
  code,
  source: 'apilint',
  message: "exclusiveMaximum' value must be a number",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^-?\\d*\\.{0,1}\\d+$', 'number'],
  marker: 'value',
  target: 'exclusiveMaximum',
  data: {},
};
code += 1;
const schemaExclusiveMinimumLint = {
  code,
  source: 'apilint',
  message: "exclusiveMinimum' value must be a number",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^-?\\d*\\.{0,1}\\d+$', 'number'],
  marker: 'value',
  target: 'exclusiveMinimum',
  data: {},
};
code += 1;

const schemaLints = [
  schema$IdLint,
  schema$RefLint,
  schemaTypeLint,
  schemaEnumLint,
  schemaMultipleOfLint,
  schemaMaximumLint,
  schemaMinimumOfLint,
  schemaExclusiveMaximumLint,
  schemaExclusiveMinimumLint,
];
/* COMPLETE */

const asyncapiVersionCompletesYaml = [
  {
    label: '2.0.0',
    kind: 10,
    insertText: '2.0.0$1',
    insertTextFormat: 2,
  },
  {
    label: '2.1.0',
    kind: 10,
    insertText: '2.1.0$1',
    insertTextFormat: 2,
  },
  {
    label: '2.2.0',
    kind: 10,
    insertText: '2.2.0$1',
    insertTextFormat: 2,
  },
];

const asyncapiVersionCompletesJson = [
  {
    label: '2.0.0',
    kind: 10,
    insertText: '"2.0.0"$1',
    insertTextFormat: 2,
  },
  {
    label: '2.1.0',
    kind: 10,
    insertText: '"2.1.0"$1',
    insertTextFormat: 2,
  },
  {
    label: '2.2.0',
    kind: 10,
    insertText: '"2.2.0"$1',
    insertTextFormat: 2,
  },
];

const schemaTypeCompletesYaml = [
  {
    label: 'null',
    kind: 10,
    insertText: 'null$1',
    insertTextFormat: 2,
  },
  {
    label: 'boolean',
    kind: 10,
    insertText: 'boolean$1',
    insertTextFormat: 2,
  },
  {
    label: 'object',
    kind: 10,
    insertText: 'object$1',
    insertTextFormat: 2,
  },
  {
    label: 'array',
    kind: 10,
    insertText: 'array$1',
    insertTextFormat: 2,
  },
  {
    label: 'number',
    kind: 10,
    insertText: 'number$1',
    insertTextFormat: 2,
  },
  {
    label: 'string',
    kind: 10,
    insertText: 'string$1',
    insertTextFormat: 2,
  },
  {
    label: 'integer',
    kind: 10,
    insertText: 'integer$1',
    insertTextFormat: 2,
  },
];

const schemaTypeCompletesJson = [
  {
    label: 'null',
    kind: 10,
    insertText: '"null"$1',
    insertTextFormat: 2,
  },
  {
    label: 'boolean',
    kind: 10,
    insertText: '"boolean"$1',
    insertTextFormat: 2,
  },
  {
    label: 'object',
    kind: 10,
    insertText: '"object"$1',
    insertTextFormat: 2,
  },
  {
    label: 'array',
    kind: 10,
    insertText: '"array"$1',
    insertTextFormat: 2,
  },
  {
    label: 'number',
    kind: 10,
    insertText: '"number"$1',
    insertTextFormat: 2,
  },
  {
    label: 'string',
    kind: 10,
    insertText: '"string"$1',
    insertTextFormat: 2,
  },
  {
    label: 'integer',
    kind: 10,
    insertText: '"integer"$1',
    insertTextFormat: 2,
  },
];

const schemaCompletesYaml = [
  {
    label: 'type',
    kind: 10,
    insertText: 'type: $1\n',
    insertTextFormat: 2,
    documentation: 'Add `type` property',
  },
  {
    label: 'minimum',
    kind: 10,
    insertText: 'minimum: $1\n',
    insertTextFormat: 2,
    documentation: 'Add `minimum` property',
  },
  {
    label: 'properties',
    kind: 10,
    insertText: 'properties: \n  $1\n',
    insertTextFormat: 2,
    documentation: 'Add `properties`',
  },
];

const schemaCompletesJson = [
  {
    label: 'type',
    kind: 10,
    insertText: '"type": "$1",\n',
    insertTextFormat: 2,
    documentation: 'Add `type` property',
  },
  {
    label: 'minimum',
    kind: 10,
    insertText: '"minimum": $1,\n',
    insertTextFormat: 2,
    documentation: 'Add `minimum` property',
  },
  {
    label: 'properties',
    kind: 10,
    insertText: '"properties": {\n  $1\n},\n',
    insertTextFormat: 2,
    documentation: 'Add `properties`',
  },
];

const securitySchemeTypeYaml = [
  {
    target: 'type',
    label: 'userPassword',
    kind: 10,
    insertText: 'userPassword$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'apiKey',
    kind: 10,
    insertText: 'apiKey$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'X509',
    kind: 10,
    insertText: 'X509$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'symmetricEncryption',
    kind: 10,
    insertText: 'symmetricEncryption$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'asymmetricEncryption',
    kind: 10,
    insertText: 'asymmetricEncryption$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'httpApiKey',
    kind: 10,
    insertText: 'httpApiKey$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'http',
    kind: 10,
    insertText: 'http$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'oauth2',
    kind: 10,
    insertText: 'oauth2$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'openIdConnect',
    kind: 10,
    insertText: 'openIdConnect$1',
    insertTextFormat: 2,
  },
  {
    targetSpecs: [
      { namespace: 'asyncapi', version: '2.1.0' },
      { namespace: 'asyncapi', version: '2.2.0' },
    ],
    target: 'type',
    label: 'plain',
    kind: 10,
    insertText: 'plain$1',
    insertTextFormat: 2,
  },
  {
    targetSpecs: [
      { namespace: 'asyncapi', version: '2.1.0' },
      { namespace: 'asyncapi', version: '2.2.0' },
    ],
    target: 'type',
    label: 'scramSha256',
    kind: 10,
    insertText: 'scramSha256$1',
    insertTextFormat: 2,
  },
  {
    targetSpecs: [
      { namespace: 'asyncapi', version: '2.1.0' },
      { namespace: 'asyncapi', version: '2.2.0' },
    ],
    target: 'type',
    label: 'scramSha512',
    kind: 10,
    insertText: 'scramSha512$1',
    insertTextFormat: 2,
  },
  {
    targetSpecs: [
      { namespace: 'asyncapi', version: '2.1.0' },
      { namespace: 'asyncapi', version: '2.2.0' },
    ],
    target: 'type',
    label: 'gssapi',
    kind: 10,
    insertText: 'gssapi$1',
    insertTextFormat: 2,
  },
];

const securitySchemeTypeJson = [
  {
    target: 'type',
    label: 'userPassword',
    kind: 10,
    insertText: '"userPassword"$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'apiKey',
    kind: 10,
    insertText: '"apiKey"$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'X509',
    kind: 10,
    insertText: '"X509"$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'symmetricEncryption',
    kind: 10,
    insertText: '"symmetricEncryption"$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'asymmetricEncryption',
    kind: 10,
    insertText: '"asymmetricEncryption"$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'httpApiKey',
    kind: 10,
    insertText: '"httpApiKey"$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'http',
    kind: 10,
    insertText: '"http"$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'oauth2',
    kind: 10,
    insertText: '"oauth2"$1',
    insertTextFormat: 2,
  },
  {
    target: 'type',
    label: 'openIdConnect',
    kind: 10,
    insertText: '"openIdConnect"$1',
    insertTextFormat: 2,
  },
  {
    targetSpecs: [
      { namespace: 'asyncapi', version: '2.1.0' },
      { namespace: 'asyncapi', version: '2.2.0' },
    ],
    target: 'type',
    label: 'plain',
    kind: 10,
    insertText: '"plain"$1',
    insertTextFormat: 2,
  },
  {
    targetSpecs: [
      { namespace: 'asyncapi', version: '2.1.0' },
      { namespace: 'asyncapi', version: '2.2.0' },
    ],
    target: 'type',
    label: 'scramSha256',
    kind: 10,
    insertText: '"scramSha256"$1',
    insertTextFormat: 2,
  },
  {
    targetSpecs: [
      { namespace: 'asyncapi', version: '2.1.0' },
      { namespace: 'asyncapi', version: '2.2.0' },
    ],
    target: 'type',
    label: 'scramSha512',
    kind: 10,
    insertText: '"scramSha512"$1',
    insertTextFormat: 2,
  },
  {
    targetSpecs: [
      { namespace: 'asyncapi', version: '2.1.0' },
      { namespace: 'asyncapi', version: '2.2.0' },
    ],
    target: 'type',
    label: 'gssapi',
    kind: 10,
    insertText: '"gssapi"$1',
    insertTextFormat: 2,
  },
];

const asyncapiVersionMeta = {
  lint: asyncapiVersionLints,
  yaml: {
    completion: asyncapiVersionCompletesYaml,
  },
  json: {
    completion: asyncapiVersionCompletesJson,
  },
};

const schemaTypeMeta = {
  yaml: {
    completion: schemaTypeCompletesYaml,
  },
  json: {
    completion: schemaTypeCompletesJson,
  },
};

const schemaMeta = {
  lint: schemaLints,
  yaml: {
    completion: schemaCompletesYaml,
  },
  json: {
    completion: schemaCompletesJson,
  },
};

const securitySchemeMeta = {
  lint: securitySchemeLints,
  yaml: {
    completion: securitySchemeTypeYaml,
  },
  json: {
    completion: securitySchemeTypeJson,
  },
};

export default {
  '*': {
    lint: [],
  },
  info: {
    lint: [
      {
        code: 223,
        source: 'apilint',
        message: "should always have a 'description'",
        severity: 1,
        linterFunction: 'hasRequiredField',
        linterParams: ['description'],
        marker: 'key',
        data: {
          quickFix: [
            {
              message: "add 'description' field",
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
        code: 31,
        source: 'apilint',
        message: "should always have a 'name'",
        severity: 1,
        linterFunction: 'hasRequiredField',
        linterParams: ['name'],
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
        code: 42,
        source: 'apilint',
        message: "should always have a 'x-smartbear-team'",
        severity: 1,
        linterFunction: 'hasRequiredField',
        linterParams: ['x-smartbear-team'],
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
      'https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#operationObject\n\n#### Operation Object\n\nDescribes a publish or a subscribe operation. This provides a place to document how and why messages are sent and received. For example, an operation might describe a chat application use case where a user sends a text message to a group.\n\n##### Fixed Fields\n\nField Name | Type | Description\n---|:---:|---\n[operationId](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#operationObjectOperationId) | `string` | Unique string used to identify the operation. The id MUST be unique among all operations described in the API. The operationId value is **case-sensitive**. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.\n[summary](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#operationObjectSummary) | `string` | A short summary of what the operation is about.\n[description](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#operationObjectDescription) | `string` | A verbose explanation of the operation. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.\n[tags](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#operationObjectTags) | [Tags Object](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#tagsObject) | A list of tags for API documentation control. Tags can be used for logical grouping of operations.\n[externalDocs](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#operationObjectExternalDocs) | [External Documentation Object](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#externalDocumentationObject) | Additional external documentation for this operation.\n[bindings](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#operationObjectBindings) | [Operation Bindings Object](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#operationBindingsObject) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the operation.\n[traits](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#operationObjectTraits) | [[Operation Trait Object](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#operationTraitObject) &#124; [Reference Object](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#referenceObject) ] | A list of traits to apply to the operation object. Traits MUST be merged into the operation object using the [JSON Merge Patch](https://tools.ietf.org/html/rfc7386) algorithm in the same order they are defined here.\n[message](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#operationObjectMessage) | [[Message Object](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#messageObject) &#124; [Reference Object](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#referenceObject)] | A definition of the message that will be published or received on this channel. `oneOf` is allowed here to specify multiple messages, however, **a message MUST be valid only against one of the referenced message objects.**\n\nThis object can be extended with [Specification Extensions](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#specificationExtensions).\n\n##### Operation Object Example\n\n```json\n{\n  "operationId": "registerUser",\n  "summary": "Action to sign a user up.",\n  "description": "A longer description",\n  "tags": [\n    { "name": "user" },\n    { "name": "signup" },\n    { "name": "register" }\n  ],\n  "message": {\n    "headers": {\n      "type": "object",\n      "properties": {\n        "applicationInstanceId": {\n          "description": "Unique identifier for a given instance of the publishing application",\n          "type": "string"\n        }\n      }\n    },\n    "payload": {\n      "type": "object",\n      "properties": {\n        "user": {\n          "$ref": "#/components/schemas/userCreate"\n        },\n        "signup": {\n          "$ref": "#/components/schemas/signup"\n        }\n      }\n    }\n  },\n  "bindings": {\n    "amqp": {\n      "ack": false\n    },\n  },\n  "traits": [\n    { "$ref": "#/components/operationTraits/kafka" }\n  ]\n}\n```\n\n```yaml\noperationId: registerUser\nsummary: Action to sign a user up.\ndescription: A longer description\ntags:\n  - name: user\n  - name: signup\n  - name: register\nmessage:\n  headers:\n    type: object\n    properties:\n      applicationInstanceId:\n        description: Unique identifier for a given instance of the publishing application\n        type: string\n  payload:\n    type: object\n    properties:\n      user:\n        $ref: "#/components/schemas/userCreate"\n      signup:\n        $ref: "#/components/schemas/signup"\nbindings:\n  amqp:\n    ack: false\ntraits:\n  - $ref: "#/components/operationTraits/kafka"\n```\n',
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
  channel: {
    documentation:
      '**TODO** \n ### Channel \n docs in MD to retrieve from some submodule or whatever',
    yaml: {
      completion: [
        {
          label: 'subscribe',
          kind: 10,
          insertText: 'subscribe: $1\n',
          insertTextFormat: 2,
          documentation: 'Add `subscribe` section',
        },
      ],
    },
    json: {
      completion: [
        {
          label: 'subscribe',
          kind: 10,
          insertText: '"subscribe": "$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `subscribe` section',
        },
      ],
    },
  },
  asyncApi2: {
    lint: rootLints,
    yaml: {
      completion: [
        {
          label: 'info',
          kind: 10,
          insertText: 'info: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `info` section',
        },
        {
          label: 'asyncapi',
          kind: 10,
          insertText: 'asyncapi: $1\n',
          insertTextFormat: 2,
          documentation: 'Add `asyncapi` property',
        },
        {
          label: 'channels',
          kind: 10,
          insertText: 'channels: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `channels` section',
        },
        {
          label: 'servers',
          kind: 10,
          insertText: 'servers: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `servers` section',
        },
        {
          label: 'components',
          kind: 10,
          insertText: 'components: \n  $1\n',
          insertTextFormat: 2,
          documentation: 'Add `components` section',
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
          label: 'info',
          kind: 10,
          insertText: '"info": {\n  $1\n},',
          insertTextFormat: 2,
          documentation: 'Add `info` section',
        },
        {
          label: 'asyncapi',
          kind: 10,
          insertText: '"asyncapi": "$1",\n',
          insertTextFormat: 2,
          documentation: 'Add `asyncapi` property',
        },
        {
          label: 'channels',
          kind: 10,
          insertText: '"channels": {\n  $1\n},\n',
          insertTextFormat: 2,
          documentation: 'Add `channels` section',
        },
        {
          label: 'servers',
          kind: 10,
          insertText: '"servers": [\n  $1\n],\n',
          insertTextFormat: 2,
          documentation: 'Add `servers` section',
        },
        {
          label: 'components',
          kind: 10,
          insertText: '"components": {\n  $1\n},\n',
          insertTextFormat: 2,
          documentation: 'Add `components` section',
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
  asyncApiVersion: asyncapiVersionMeta,
  'json-schema-type': schemaTypeMeta,
  schema: schemaMeta,
  securityScheme: securitySchemeMeta,
  servers: {
    documentation:
      '#### [Servers](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#a2sservers)\n\n\nField Name | Type | Description\n---|:---:|---\nservers | [Servers Object](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#serversObject) | Provides connection details of servers.\n\n#### Servers Object\n\nThe Servers Object is a map of [Server Objects](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#serverObject).\n\n##### Patterned Fields\n\nField Pattern | Type | Description\n---|:---:|---\n`^[A-Za-z0-9_\\-]+$` | [Server Object](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#serverObject) | The definition of a server this application MAY connect to.\n\n##### Servers Object Example\n\n```json\n{\n  "production": {\n    "url": "development.gigantic-server.com",\n    "description": "Development server",\n    "protocol": "kafka",\n    "protocolVersion": "1.0.0"\n  }\n}\n```\n\n```yaml\nproduction:\n  url: development.gigantic-server.com\n  description: Development server\n  protocol: kafka\n  protocolVersion: \'1.0.0\'\n```\n\n\n#### Server Object\n\nAn object representing a message broker, a server or any other kind of computer program capable of sending and/or receiving data. This object is used to capture details such as URIs, protocols and security configuration. Variable substitution can be used so that some details, for example usernames and passwords, can be injected by code generation tools.\n\n##### Fixed Fields\n\nField Name | Type | Description\n---|:---:|---\nurl | `string` | **REQUIRED**. A URL to the target host.  This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the AsyncAPI document is being served. Variable substitutions will be made when a variable is named in `{`brackets`}`.\nprotocol | `string` | **REQUIRED**. The protocol this URL supports for connection. Supported protocol include, but are not limited to: `amqp`, `amqps`, `http`, `https`, `jms`, `kafka`, `kafka-secure`, `mqtt`, `secure-mqtt`, `stomp`, `stomps`, `ws`, `wss`, `mercure`.\nprotocolVersion | `string` | The version of the protocol used for connection. For instance: AMQP `0.9.1`, HTTP `2.0`, Kafka `1.0.0`, etc.\ndescription | `string` | An optional string describing the host designated by the URL. [CommonMark syntax](http://spec.commonmark.org/) MAY be used for rich text representation.\nvariables | Map[`string`, [Server Variable Object](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#serverVariableObject)] | A map between a variable name and its value.  The value is used for substitution in the server\'s URL template.\nsecurity | [[Security Requirement Object](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#securityRequirementObject)] | A declaration of which security mechanisms can be used with this server. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a connection or operation.\nbindings | [Server Bindings Object](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#serverBindingsObject) | A map where the keys describe the name of the protocol and the values describe protocol-specific definitions for the server.\n\nThis object MAY be extended with [Specification Extensions](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#specificationExtensions).\n\n##### Server Object Example\n\nA single server would be described as:\n\n```json\n{\n  "url": "development.gigantic-server.com",\n  "description": "Development server",\n  "protocol": "kafka",\n  "protocolVersion": "1.0.0"\n}\n```\n\n```yaml\nurl: development.gigantic-server.com\ndescription: Development server\nprotocol: kafka\nprotocolVersion: \'1.0.0\'\n```\n\nThe following shows how multiple servers can be described, for example, at the AsyncAPI Object\'s [`servers`](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#A2SServers):\n\n```json\n{\n  "servers": {\n    "development": {\n      "url": "development.gigantic-server.com",\n      "description": "Development server",\n      "protocol": "amqp",\n      "protocolVersion": "0.9.1"\n    },\n    "staging": {\n      "url": "staging.gigantic-server.com",\n      "description": "Staging server",\n      "protocol": "amqp",\n      "protocolVersion": "0.9.1"\n    },\n    "production": {\n      "url": "api.gigantic-server.com",\n      "description": "Production server",\n      "protocol": "amqp",\n      "protocolVersion": "0.9.1"\n    }\n  }\n}\n```\n\n```yaml\nservers:\n  development:\n    url: development.gigantic-server.com\n    description: Development server\n    protocol: amqp\n    protocolVersion: 0.9.1\n  staging:\n    url: staging.gigantic-server.com\n    description: Staging server\n    protocol: amqp\n    protocolVersion: 0.9.1\n  production:\n    url: api.gigantic-server.com\n    description: Production server\n    protocol: amqp\n    protocolVersion: 0.9.1\n```\n\nThe following shows how variables can be used for a server configuration:\n\n```json\n{\n  "servers": {\n    "production": {\n      "url": "{username}.gigantic-server.com:{port}/{basePath}",\n      "description": "The production API server",\n      "protocol": "secure-mqtt",\n      "variables": {\n        "username": {\n          "default": "demo",\n          "description": "This value is assigned by the service provider, in this example `gigantic-server.com`"\n        },\n        "port": {\n          "enum": [\n            "8883",\n            "8884"\n          ],\n          "default": "8883"\n        }\n      }\n    }\n  }\n}\n```\n\n```yaml\nservers:\n  production:\n    url: \'{username}.gigantic-server.com:{port}/{basePath}\'\n    description: The production API server\n    protocol: secure-mqtt\n    variables:\n      username:\n        # note! no enum here means it is an open value\n        default: demo\n        description: This value is assigned by the service provider, in this example `gigantic-server.com`\n      port:\n        enum:\n          - \'8883\'\n          - \'8884\'\n        default: \'8883\'\n```\n\n\n#### Server Variable Object\n\nAn object representing a Server Variable for server URL template substitution.\n',
  },
};
