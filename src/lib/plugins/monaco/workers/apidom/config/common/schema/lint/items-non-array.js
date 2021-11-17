import ApilintCodes from '../../../codes';

const schemaItemsNonArrayLint = {
  code: ApilintCodes.SCHEMA_ITEMS_NONARRAY,
  source: 'apilint',
  message: 'items has no effect on non arrays',
  severity: 2,
  linterFunction: 'missingField',
  linterParams: ['items'],
  marker: 'key',
  markerTarget: 'items',
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
        message: 'remove items',
        action: 'removeChild',
        functionParams: ['items'],
        target: 'parent',
      },
    ],
  },
};

export default schemaItemsNonArrayLint;
