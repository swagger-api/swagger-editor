import ApilintCodes from '../../../codes';

const rootIdLint = {
  code: ApilintCodes.ROOT_ID,
  source: 'apilint',
  message: "'id' value must be a valid URI",
  severity: 1,
  linterFunction: 'apilintValueRegex',
  linterParams: ['^[a-zA-Z]{1}[a-zA-Z0-9\\.\\+\\-]*\\:?[\\S|^\\:]*$'],
  marker: 'value',
  target: 'id',
  data: {},
};

export default rootIdLint;
