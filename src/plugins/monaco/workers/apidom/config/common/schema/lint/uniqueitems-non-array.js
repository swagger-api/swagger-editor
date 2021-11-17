import ApilintCodes from '../../../codes';

const schemaUniqueItemsNonArrayLint = {
  code: ApilintCodes.SCHEMA_UNIQUEITEMS_NONARRAY,
  source: 'apilint',
  message: 'uniqueItems has no effect on non arrays',
  severity: 2,
  linterFunction: 'missingField',
  linterParams: ['uniqueItems'],
  marker: 'key',
  markerTarget: 'uniqueItems',
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
        message: 'remove uniqueItems',
        action: 'removeChild',
        functionParams: ['uniqueItems'],
        target: 'parent',
      },
    ],
  },
};

export default schemaUniqueItemsNonArrayLint;
