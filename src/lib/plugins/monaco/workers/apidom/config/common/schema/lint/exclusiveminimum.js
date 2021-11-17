import ApilintCodes from '../../../codes';

const schemaExclusiveMinimumLint = {
  code: ApilintCodes.SCHEMA_EXCLUSIVEMINUMUM,
  source: 'apilint',
  message: "exclusiveMinimum' value must be a number",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^-?\\d*\\.{0,1}\\d+$', 'number'],
  marker: 'value',
  target: 'exclusiveMinimum',
  data: {},
};

export default schemaExclusiveMinimumLint;
