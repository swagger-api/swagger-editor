import ApilintCodes from '../../../codes';

const infoDescriptionLint = {
  code: ApilintCodes.INFO_DESCRIPTION,
  source: 'apilint',
  message: "should always have a 'description'",
  severity: 1,
  linterFunction: 'hasRequiredField',
  linterParams: ['description'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'description' field",
        action: 'addChild',
        snippetYaml: 'description: \n  ',
        snippetJson: '"description": "",\n    ',
      },
    ],
  },
};

export default infoDescriptionLint;
