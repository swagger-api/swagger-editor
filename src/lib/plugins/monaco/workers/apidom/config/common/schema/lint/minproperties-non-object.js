import ApilintCodes from '../../../codes';

const schemaMinPropertiesNonObjectLint = {
  code: ApilintCodes.SCHEMA_MINPROPERTIES_NONOBJECT,
  source: 'apilint',
  message: 'minProperties has no effect on non objects',
  severity: 2,
  linterFunction: 'missingField',
  linterParams: ['minProperties'],
  marker: 'key',
  markerTarget: 'minProperties',
  conditions: [
    {
      targets: [{ path: 'type' }],
      function: 'apilintContainsValue',
      negate: true,
      params: ['object'],
    },
  ],
  data: {
    quickFix: [
      {
        message: 'remove minProperties',
        action: 'removeChild',
        functionParams: ['minProperties'],
        target: 'parent',
      },
    ],
  },
};

export default schemaMinPropertiesNonObjectLint;
