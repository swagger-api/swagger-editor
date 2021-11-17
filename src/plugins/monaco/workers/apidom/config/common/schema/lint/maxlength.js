import ApilintCodes from '../../../codes';

const schemaMaxLengthLint = {
  code: ApilintCodes.SCHEMA_MAXLENGTH,
  source: 'apilint',
  message: 'maxLength must be a non-negative integer',
  severity: 1,
  linterFunction: 'apilintNumber',
  linterParams: [true, true, true],
  marker: 'value',
  target: 'maxLength',
  data: {},
};

export default schemaMaxLengthLint;
