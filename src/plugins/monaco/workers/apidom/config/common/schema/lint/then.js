import ApilintCodes from '../../../codes';

const schemaThenLint = {
  code: ApilintCodes.SCHEMA_THEN,
  source: 'apilint',
  message: '"then" must be a schema',
  severity: 1,
  linterFunction: 'apilintElementOrClass',
  linterParams: ['schema'],
  marker: 'value',
  target: 'then',
  data: {},
};

export default schemaThenLint;
