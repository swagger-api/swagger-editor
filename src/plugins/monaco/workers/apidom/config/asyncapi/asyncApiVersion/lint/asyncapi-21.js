import ApilintCodes from '../../../codes';

const asyncapiVersionLint21 = {
  code: ApilintCodes.ASYNCAPI_ASYNCAPIVERSION_21,
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

export default asyncapiVersionLint21;
