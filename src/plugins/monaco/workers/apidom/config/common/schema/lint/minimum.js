import ApilintCodes from '../../../codes';

const schemaMinimumOfLint = {
  code: ApilintCodes.SCHEMA_MINUMUM,
  source: 'apilint',
  message: "minimum' value must be a number",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^-?\\d*\\.{0,1}\\d+$', 'number'],
  marker: 'value',
  target: 'minimum',
  data: {},
};

export default schemaMinimumOfLint;
