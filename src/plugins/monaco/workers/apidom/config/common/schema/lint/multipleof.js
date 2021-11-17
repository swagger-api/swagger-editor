import ApilintCodes from '../../../codes';

const schemaMultipleOfLint = {
  code: ApilintCodes.SCHEMA_MULTIPLEOF,
  source: 'apilint',
  message: "multipleOf' value must be a number > 0",
  severity: 1,
  linterFunction: 'apilintNumber',
  linterParams: [false, true, false],
  marker: 'value',
  target: 'multipleOf',
  data: {},
};

export default schemaMultipleOfLint;
