import ApilintCodes from '../../../codes';

const schemaMinLengthLint = {
  code: ApilintCodes.SCHEMA_MINLENGTH,
  source: 'apilint',
  message: 'minLength must be a non-negative integer',
  severity: 1,
  linterFunction: 'apilintNumber',
  linterParams: [true, true, true],
  marker: 'value',
  target: 'minLength',
  data: {},
};

export default schemaMinLengthLint;
