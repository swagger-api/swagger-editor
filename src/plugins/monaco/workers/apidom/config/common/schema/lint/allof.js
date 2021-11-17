import ApilintCodes from '../../../codes';

const schemaAllOfLint = {
  code: ApilintCodes.SCHEMA_ALLOF,
  source: 'apilint',
  message: 'allOf must be a non-empty array of schemas',
  severity: 1,
  linterFunction: 'apilintArrayOfElementsOrClasess',
  linterParams: [['schema'], true],
  marker: 'key',
  target: 'allOf',
  data: {},
};

export default schemaAllOfLint;
