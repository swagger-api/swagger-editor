import ApilintCodes from '../../../codes';

const schemaPatternPropertiesKeyLint = {
  code: ApilintCodes.SCHEMA_PATTERNPROPERTIES_KEY,
  source: 'apilint',
  message: 'patternProperties keys must be valid regex',
  severity: 1,
  linterFunction: 'apilintKeyIsRegex',
  marker: 'key',
  target: 'patternProperties',
  markerTarget: 'patternProperties',
  data: {},
};

export default schemaPatternPropertiesKeyLint;
