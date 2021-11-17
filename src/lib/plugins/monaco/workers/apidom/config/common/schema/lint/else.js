import ApilintCodes from '../../../codes';

const schemaElseLint = {
  code: ApilintCodes.SCHEMA_ELSE,
  source: 'apilint',
  message: '"else" must be a schema',
  severity: 1,
  linterFunction: 'apilintElementOrClass',
  linterParams: ['schema'],
  marker: 'value',
  target: 'else',
  data: {},
};

export default schemaElseLint;
