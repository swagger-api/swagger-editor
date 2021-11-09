import ApilintCodes from '../../../codes';

const rootChannelsLint = {
  code: ApilintCodes.ASYNCAPI_ROOT_CHANNELS,
  source: 'apilint',
  message: "should always have a 'channels' section",
  severity: 1,
  linterFunction: 'hasRequiredField',
  linterParams: ['channels'],
  marker: 'key',
  data: {
    quickFix: [
      {
        message: "add 'channels' section",
        action: 'addChild',
        snippetYaml: 'channels: \n  $1\n',
        snippetJson: '"channels": {\n  $1\n},\n',
      },
    ],
  },
};

export default rootChannelsLint;
