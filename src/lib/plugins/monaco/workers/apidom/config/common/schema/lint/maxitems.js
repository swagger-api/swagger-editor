import ApilintCodes from '../../../codes';

const schemaMaxItemsLint = {
  code: ApilintCodes.SCHEMA_MAXITEMS,
  source: 'apilint',
  message: 'maxItems must be a non-negative integer',
  severity: 1,
  linterFunction: 'apilintNumber',
  linterParams: [true, true, true],
  marker: 'value',
  target: 'maxItems',
  data: {},
};

export default schemaMaxItemsLint;
