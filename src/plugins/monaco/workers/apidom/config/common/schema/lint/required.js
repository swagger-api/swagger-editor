import ApilintCodes from '../../../codes';

const schemaRequiredLint = {
  code: ApilintCodes.SCHEMA_REQUIRED,
  source: 'apilint',
  message: 'required must be an array of strings',
  severity: 1,
  linterFunction: 'apilintArrayOfType',
  linterParams: ['string'],
  marker: 'key',
  target: 'required',
  data: {},
};

export default schemaRequiredLint;
