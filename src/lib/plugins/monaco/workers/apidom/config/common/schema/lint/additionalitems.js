import ApilintCodes from '../../../codes';

const schemaAdditionalItemsLint = {
  code: ApilintCodes.SCHEMA_ADDITIONALITEMS,
  source: 'apilint',
  message: 'additionalItems must be a schema',
  severity: 1,
  linterFunction: 'apilintElementOrClass',
  linterParams: ['schema'],
  marker: 'value',
  target: 'additionalItems',
  data: {},
};

export default schemaAdditionalItemsLint;
