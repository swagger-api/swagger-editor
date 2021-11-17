import ApilintCodes from '../../../codes';

const schema$RefLint = {
  code: ApilintCodes.SCHEMA_REF,
  source: 'apilint',
  message: "'$ref' value must be a valid URI-reference",
  severity: 1,
  linterFunction: 'apilintValidURI',
  marker: 'value',
  target: '$ref',
  data: {},
};

export default schema$RefLint;
