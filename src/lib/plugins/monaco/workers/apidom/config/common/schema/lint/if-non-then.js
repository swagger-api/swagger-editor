import ApilintCodes from '../../../codes';

const schemaIfNonThenLint = {
  code: ApilintCodes.SCHEMA_IF_NONTHEN,
  source: 'apilint',
  message: '"if" has no effect without a "then"',
  severity: 2,
  linterFunction: 'missingField',
  linterParams: ['if'],
  marker: 'key',
  markerTarget: 'if',
  conditions: [
    {
      function: 'missingField',
      params: ['then'],
    },
  ],
  data: {
    quickFix: [
      {
        message: 'remove if',
        action: 'removeChild',
        functionParams: ['if'],
        target: 'parent',
      },
    ],
  },
};

export default schemaIfNonThenLint;
