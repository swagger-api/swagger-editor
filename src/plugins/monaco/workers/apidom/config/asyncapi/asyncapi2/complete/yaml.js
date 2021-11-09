const asyncapiRootCompleteYaml = {
  completion: [
    {
      label: 'info',
      kind: 10,
      insertText: 'info: \n  $1\n',
      insertTextFormat: 2,
      documentation: 'Add `info` section',
    },
    {
      label: 'asyncapi',
      kind: 10,
      insertText: 'asyncapi: $1\n',
      insertTextFormat: 2,
      documentation: 'Add `asyncapi` property',
    },
    {
      label: 'channels',
      kind: 10,
      insertText: 'channels: \n  $1\n',
      insertTextFormat: 2,
      documentation: 'Add `channels` section',
    },
    {
      label: 'servers',
      kind: 10,
      insertText: 'servers: \n  $1\n',
      insertTextFormat: 2,
      documentation: 'Add `servers` section',
    },
    {
      label: 'components',
      kind: 10,
      insertText: 'components: \n  $1\n',
      insertTextFormat: 2,
      documentation: 'Add `components` section',
    },
    {
      label: 'tags',
      kind: 10,
      insertText: 'tags: \n  $1\n',
      insertTextFormat: 2,
      documentation: 'Add `tags` section',
    },
    {
      label: 'externalDocs',
      kind: 10,
      insertText: 'externalDocs: \n  $1\n',
      insertTextFormat: 2,
      documentation: 'Add `externalDocs` section',
    },
  ],
};

export default asyncapiRootCompleteYaml;
