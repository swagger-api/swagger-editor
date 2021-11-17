import ApilintCodes from '../../../codes';

const schemaMinLengthNonStringLint = {
  code: ApilintCodes.SCHEMA_MINLENGTH_NONSTRING,
  source: 'apilint',
  message: 'minLength has no effect on non strings',
  severity: 2,
  linterFunction: 'missingField',
  linterParams: ['minLength'],
  marker: 'key',
  markerTarget: 'minLength',
  conditions: [
    {
      targets: [{ path: 'type' }],
      function: 'apilintContainsValue',
      negate: true,
      params: ['string'],
    },
  ],
  data: {
    quickFix: [
      {
        message: 'remove minLength',
        action: 'removeChild',
        functionParams: ['minLength'],
        target: 'parent',
      },
    ],
  },
};

export default schemaMinLengthNonStringLint;
