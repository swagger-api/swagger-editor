import ApilintCodes from '../../../codes';

const schemaDescriptionLint = {
  code: ApilintCodes.SCHEMA_PATTERN,
  source: 'apilint',
  message: "description' value must be a string",
  severity: 1,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'description',
  data: {},
};

export default schemaDescriptionLint;
