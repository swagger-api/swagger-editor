import ApilintCodes from '../../../codes';

const schemaPropertiesObjectLint = {
  code: ApilintCodes.SCHEMA_PROPERTIES_OBJECT,
  source: 'apilint',
  message: 'properties must be an object',
  severity: 1,
  linterFunction: 'apilintType',
  linterParams: ['object'],
  marker: 'value',
  target: 'properties',
  data: {},
};

export default schemaPropertiesObjectLint;
