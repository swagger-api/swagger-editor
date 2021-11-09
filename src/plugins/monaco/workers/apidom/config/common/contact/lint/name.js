import ApilintCodes from '../../../codes';

const contactNameLint = {
  code: ApilintCodes.CONTACT_NAME,
  source: 'apilint',
  message: "should always have a 'name'",
  severity: 1,
  linterFunction: 'hasRequiredField',
  linterParams: ['name'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'name' field",
        function: 'addName',
        action: 'addChild',
        snippetYaml: 'name: \n    ',
        snippetJson: '"name": "",\n      ',
      },
    ],
  },
};

export default contactNameLint;
