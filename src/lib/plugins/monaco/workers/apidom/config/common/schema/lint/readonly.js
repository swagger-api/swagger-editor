import ApilintCodes from '../../../codes';

const schemaReadOnlyLint = {
  code: ApilintCodes.SCHEMA_READONLY,
  source: 'apilint',
  message: 'readOnly must be a boolean',
  severity: 1,
  linterFunction: 'apilintType',
  linterParams: ['boolean'],
  marker: 'value',
  target: 'readOnly',
  data: {},
};

export default schemaReadOnlyLint;
