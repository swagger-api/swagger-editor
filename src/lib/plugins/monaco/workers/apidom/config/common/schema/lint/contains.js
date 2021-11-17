import ApilintCodes from '../../../codes';

const schemaContainsLint = {
  code: ApilintCodes.SCHEMA_CONTAINS,
  source: 'apilint',
  message: 'contains must be a schema',
  severity: 1,
  linterFunction: 'apilintElementOrClass',
  linterParams: ['schema'],
  marker: 'value',
  target: 'contains',
  data: {},
};

export default schemaContainsLint;
