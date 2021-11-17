import ApilintCodes from '../../../codes';

const schemaOneOfLint = {
  code: ApilintCodes.SCHEMA_ONEOF,
  source: 'apilint',
  message: 'oneOf must be a non-empty array of schemas',
  severity: 1,
  linterFunction: 'apilintArrayOfElementsOrClasess',
  linterParams: [['schema'], true],
  marker: 'key',
  target: 'oneOf',
  data: {},
};

export default schemaOneOfLint;
