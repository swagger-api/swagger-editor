import ApilintCodes from '../../../codes';

const schemaPropertyNamesLint = {
  code: ApilintCodes.SCHEMA_PROPERTYNAMES,
  source: 'apilint',
  message: 'propertyNames must be a schema',
  severity: 1,
  linterFunction: 'apilintElementOrClass',
  linterParams: ['schema'],
  marker: 'value',
  target: 'propertyNames',
  data: {},
};

export default schemaPropertyNamesLint;
