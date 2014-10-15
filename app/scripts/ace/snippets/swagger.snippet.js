'use strict';

PhonicsApp.config(function ($provide) {
  $provide.constant('snippets', [
    {
      name: 'parameter',
      trigger: 'param',
      content: [
        '- name: ${1:parameter_name}',
        '  in: ${2:in}',
        'description: ${3:description}',
        'schema:',
        '  ${4:schema}'
      ].join('\n')
    },

    {
      name: 'info',
      trigger: 'info',
      content: [
        'info:',
        '  version: ${1:0.0.0}',
        '  title: ${2:title}',
        '  description: ${3:description}',
        '  termsOfService: ${4:terms}',
        '  contact:',
        '    name: ${5}',
        '    url: ${6}',
        '    email: ${7}',
        '  license:',
        '    name: ${8:MIT}',
        '    url: ${9:http://opensource.org/licenses/MIT}'
      ].join('\n')
    }
  ]);
});
