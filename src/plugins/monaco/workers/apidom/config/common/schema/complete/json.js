const jsonSchemaCompleteJson = {
  completion: [
    {
      label: 'type',
      kind: 10,
      insertText: '"type": "$1",\n',
      insertTextFormat: 2,
      documentation: 'Add `type` property',
    },
    {
      label: 'minimum',
      kind: 10,
      insertText: '"minimum": $1,\n',
      insertTextFormat: 2,
      documentation: 'Add `minimum` property',
    },
    {
      label: 'properties',
      kind: 10,
      insertText: '"properties": {\n  $1\n},\n',
      insertTextFormat: 2,
      documentation: 'Add `properties`',
    },
  ],
};

export default jsonSchemaCompleteJson;
