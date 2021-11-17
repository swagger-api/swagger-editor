import ApilintCodes from '../../../codes';

const schemaMaxPropertiesLint = {
  code: ApilintCodes.SCHEMA_MAXPROPERTIES,
  source: 'apilint',
  message: 'maxProperties must be a non-negative integer',
  severity: 1,
  linterFunction: 'apilintNumber',
  linterParams: [true, true, true],
  marker: 'value',
  target: 'maxProperties',
  data: {},
};

export default schemaMaxPropertiesLint;
