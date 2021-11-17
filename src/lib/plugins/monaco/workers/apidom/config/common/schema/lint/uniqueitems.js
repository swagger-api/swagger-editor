import ApilintCodes from '../../../codes';

const schemaUniqueItemsLint = {
  code: ApilintCodes.SCHEMA_UNIQUEITEMS,
  source: 'apilint',
  message: 'uniqueItems must be a boolean',
  severity: 1,
  linterFunction: 'apilintType',
  linterParams: ['boolean'],
  marker: 'value',
  target: 'uniqueItems',
  data: {},
};

export default schemaUniqueItemsLint;
