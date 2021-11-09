import ApilintCodes from '../../../codes';

const schema$RefLint = {
  code: ApilintCodes.SCHEMA_REF,
  source: 'apilint',
  message: "'$ref' value must be a valid URI-reference",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^[a-zA-Z]{1}[a-zA-Z0-9\\.\\+\\-]*\\:?[\\S|^\\:]*$'],
  marker: 'value',
  target: '$ref',
  data: {},
};

export default schema$RefLint;
