import ApilintCodes from '../../../codes';

const schemaTitleLint = {
  code: ApilintCodes.SCHEMA_PATTERN,
  source: 'apilint',
  message: "title' value must be a string",
  severity: 1,
  linterFunction: 'apilintType',
  linterParams: ['string'],
  marker: 'value',
  target: 'title',
  data: {},
};

export default schemaTitleLint;
