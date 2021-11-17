import ApilintCodes from '../../../codes';

const rootInfoLint = {
  code: ApilintCodes.ROOT_INFO,
  source: 'apilint',
  message: "should always have a 'info' section",
  severity: 1,
  linterFunction: 'hasRequiredField',
  linterParams: ['info'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'info' section",
        action: 'addChild',
        snippetYaml: 'info: \n  $1\n',
        snippetJson: '"info": {\n  $1\n},\n',
      },
    ],
  },
};

export default rootInfoLint;
