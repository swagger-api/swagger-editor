import ApilintCodes from '../../../codes';

const schemaWriteOnlyLint = {
  code: ApilintCodes.SCHEMA_WRITEONLY,
  source: 'apilint',
  message: 'writeOnly must be a boolean',
  severity: 1,
  linterFunction: 'apilintType',
  linterParams: ['boolean'],
  marker: 'value',
  target: 'writeOnly',
  data: {},
};

export default schemaWriteOnlyLint;
