import ApilintCodes from '../../../codes';

const schemaMaxItemsNonArrayLint = {
  code: ApilintCodes.SCHEMA_MAXITEMS_NONARRAY,
  source: 'apilint',
  message: 'maxItems has no effect on non arrays',
  severity: 2,
  linterFunction: 'missingField',
  linterParams: ['maxItems'],
  marker: 'key',
  markerTarget: 'maxItems',
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
        message: 'remove maxItems',
        action: 'removeChild',
        functionParams: ['maxItems'],
        target: 'parent',
      },
    ],
  },
};

export default schemaMaxItemsNonArrayLint;
