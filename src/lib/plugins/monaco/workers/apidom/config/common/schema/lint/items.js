import ApilintCodes from '../../../codes';

const schemaItemsLint = {
  code: ApilintCodes.SCHEMA_ITEMS,
  source: 'apilint',
  message: 'items must be a schema or array of schemas',
  severity: 1,
  linterFunction: 'apilintElementOrClass',
  linterParams: [['schema', 'array']],
  marker: 'value',
  target: 'items',
  data: {},
};

export default schemaItemsLint;
