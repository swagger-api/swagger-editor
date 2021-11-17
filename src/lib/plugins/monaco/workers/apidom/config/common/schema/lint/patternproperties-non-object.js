import ApilintCodes from '../../../codes';

const schemaPatternPropertiesNonObjectLint = {
  code: ApilintCodes.SCHEMA_PATTERNPROPERTIES_NONOBJECT,
  source: 'apilint',
  message: 'patternProperties has no effect on non objects',
  severity: 2,
  linterFunction: 'missingField',
  linterParams: ['patternProperties'],
  marker: 'key',
  markerTarget: 'patternProperties',
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
        message: 'remove patternProperties',
        action: 'removeChild',
        functionParams: ['patternProperties'],
        target: 'parent',
      },
    ],
  },
};

export default schemaPatternPropertiesNonObjectLint;
