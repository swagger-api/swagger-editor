import ApilintCodes from '../../../codes';

const asyncapiVersionLint22 = {
  code: ApilintCodes.ASYNCAPI_ASYNCAPIVERSION_22,
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

export default asyncapiVersionLint22;
