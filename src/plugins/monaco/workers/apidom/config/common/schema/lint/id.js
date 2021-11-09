import ApilintCodes from '../../../codes';

const schema$IdLint = {
  code: ApilintCodes.SCHEMA_ID,
  source: 'apilint',
  message: "'$id' value must be a valid URI-reference",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^[a-zA-Z]{1}[a-zA-Z0-9\\.\\+\\-]*\\:?[\\S|^\\:]*$'],
  marker: 'value',
  target: '$id',
  data: {},
};

export default schema$IdLint;
