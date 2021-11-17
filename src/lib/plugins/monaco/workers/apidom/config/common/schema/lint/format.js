import ApilintCodes from '../../../codes';

const schemaFormatLint = {
  code: ApilintCodes.SCHEMA_PATTERN,
  source: 'apilint',
  message: "format' value must be a string",
  severity: 1,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'format',
  data: {},
};

export default schemaFormatLint;
