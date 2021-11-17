import ApilintCodes from '../../../codes';

const schemaPropertyNamesNonObjectLint = {
  code: ApilintCodes.SCHEMA_PROPERTYNAMES_NONOBJECT,
  source: 'apilint',
  message: 'propertyNames has no effect on non objects',
  severity: 2,
  linterFunction: 'missingField',
  linterParams: ['propertyNames'],
  marker: 'key',
  markerTarget: 'propertyNames',
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
        message: 'remove propertyNames',
        action: 'removeChild',
        functionParams: ['propertyNames'],
        target: 'parent',
      },
    ],
  },
};

export default schemaPropertyNamesNonObjectLint;
