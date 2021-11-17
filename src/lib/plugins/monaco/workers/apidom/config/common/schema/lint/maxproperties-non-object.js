import ApilintCodes from '../../../codes';

const schemaMaxPropertiesNonObjectLint = {
  code: ApilintCodes.SCHEMA_MAXPROPERTIES_NONOBJECT,
  source: 'apilint',
  message: 'maxProperties has no effect on non objects',
  severity: 2,
  linterFunction: 'missingField',
  linterParams: ['maxProperties'],
  marker: 'key',
  markerTarget: 'maxProperties',
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
        message: 'remove maxProperties',
        action: 'removeChild',
        functionParams: ['maxProperties'],
        target: 'parent',
      },
    ],
  },
};

export default schemaMaxPropertiesNonObjectLint;
