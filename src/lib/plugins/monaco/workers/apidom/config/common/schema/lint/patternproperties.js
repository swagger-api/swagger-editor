import ApilintCodes from '../../../codes';

const schemaPatternPropertiesLint = {
  code: ApilintCodes.SCHEMA_PATTERNPROPERTIES,
  source: 'apilint',
  message: 'patternProperties members must be schemas',
  severity: 1,
  linterFunction: 'apilintChildrenOfElementsOrClasess',
  linterParams: ['schema'],
  marker: 'key',
  markerTarget: 'patternProperties',
  target: 'patternProperties',
  data: {},
};

export default schemaPatternPropertiesLint;
