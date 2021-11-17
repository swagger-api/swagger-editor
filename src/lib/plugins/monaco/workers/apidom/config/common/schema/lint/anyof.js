import ApilintCodes from '../../../codes';

const schemaAnyOfLint = {
  code: ApilintCodes.SCHEMA_ANYOF,
  source: 'apilint',
  message: 'anyOf must be a non-empty array of schemas',
  severity: 1,
  linterFunction: 'apilintArrayOfElementsOrClasess',
  linterParams: [['schema'], true],
  marker: 'key',
  target: 'anyOf',
  data: {},
};

export default schemaAnyOfLint;
