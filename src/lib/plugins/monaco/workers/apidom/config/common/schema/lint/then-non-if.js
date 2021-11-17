import ApilintCodes from '../../../codes';

const schemaThenNonIfLint = {
  code: ApilintCodes.SCHEMA_THEN_NONIF,
  source: 'apilint',
  message: '"then" has no effect without a "if"',
  severity: 2,
  linterFunction: 'missingField',
  linterParams: ['then'],
  marker: 'key',
  markerTarget: 'then',
  conditions: [
    {
      function: 'missingField',
      params: ['if'],
    },
  ],
  data: {
    quickFix: [
      {
        message: 'remove then',
        action: 'removeChild',
        functionParams: ['then'],
        target: 'parent',
      },
    ],
  },
};

export default schemaThenNonIfLint;
