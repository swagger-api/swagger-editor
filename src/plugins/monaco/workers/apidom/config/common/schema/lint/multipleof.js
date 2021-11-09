import ApilintCodes from '../../../codes';

const schemaMultipleOfLint = {
  code: ApilintCodes.SCHEMA_MULTIPLEOF,
  source: 'apilint',
  message: "multipleOf' value must be a number",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^-?\\d*\\.{0,1}\\d+$', 'number'],
  marker: 'value',
  target: 'multipleOf',
  data: {},
};

export default schemaMultipleOfLint;
