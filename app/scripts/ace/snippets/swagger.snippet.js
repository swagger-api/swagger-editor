PhonicsApp.config(function ($provide) {
  $provide.constant('snippets', [
    {
      name: 'parameter',
      content: [
        '- name: ${1:parameter_name}',
        '  in: ${2:in}',
        'description: ${3:description}',
        'schema:',
        '  ${4:schema}'
      ].join('\n'),
      trigger: 'param'
    }
  ]);
});
