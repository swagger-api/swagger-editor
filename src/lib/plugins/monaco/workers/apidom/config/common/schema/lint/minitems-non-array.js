import ApilintCodes from '../../../codes';

const schemaMinItemsNonArrayLint = {
  code: ApilintCodes.SCHEMA_MINITEMS_NONARRAY,
  source: 'apilint',
  message: 'minItems has no effect on non arrays',
  severity: 2,
  linterFunction: 'missingField',
  linterParams: ['minItems'],
  marker: 'key',
  markerTarget: 'minItems',
  conditions: [
    {
      targets: [{ path: 'type' }],
      function: 'apilintContainsValue',
      negate: true,
      params: ['array'],
    },
  ],
  data: {
    quickFix: [
      {
        message: 'remove minItems',
        action: 'removeChild',
        functionParams: ['minItems'],
        target: 'parent',
      },
    ],
  },
};

export default schemaMinItemsNonArrayLint;
