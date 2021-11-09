const contactCompleteYaml = {
  completion: [
    {
      label: 'name',
      kind: 10,
      insertText: 'name: $1\n',
      insertTextFormat: 2,
      documentation: 'Add `name` property',
    },
    {
      label: 'url',
      kind: 10,
      insertText: 'url: $1\n',
      insertTextFormat: 2,
      documentation: 'Add `url` property',
    },
    {
      label: 'email',
      kind: 10,
      insertText: 'email: $1\n',
      insertTextFormat: 2,
      documentation: 'Add `email` property',
    },
  ],
};

export default contactCompleteYaml;
