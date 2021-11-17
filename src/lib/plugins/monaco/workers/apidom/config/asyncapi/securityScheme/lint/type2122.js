import ApilintCodes from '../../../codes';

const securitySchemeTypeLint2122 = {
  code: ApilintCodes.ASYNCAPI_SECURITYSCHEME_TYPE_2122,
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

export default securitySchemeTypeLint2122;
