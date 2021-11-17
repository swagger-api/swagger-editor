import ApilintCodes from '../../../codes';

const schemaEnumLint = {
  code: ApilintCodes.SCHEMA_ENUM,
  source: 'apilint',
  message: "enum' value must be an array with unique values",
  severity: 1,
  linterFunction: 'apilintUniqueArray',
  marker: 'value',
  target: 'enum',
  data: {},
};

export default schemaEnumLint;
