import ApilintCodes from '../../../codes';

const schemaPropertiesNonObjectLint = {
  code: ApilintCodes.SCHEMA_PROPERTIES_NONOBJECT,
  source: 'apilint',
  message: 'properties has no effect on non objects',
  severity: 2,
  linterFunction: 'missingField',
  linterParams: ['properties'],
  marker: 'key',
  markerTarget: 'properties',
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
        message: 'remove properties',
        action: 'removeChild',
        functionParams: ['properties'],
        target: 'parent',
      },
    ],
  },
};

export default schemaPropertiesNonObjectLint;
