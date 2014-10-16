'use strict';

PhonicsApp.config(function ($provide) {
  $provide.constant('snippets', [
    {
      name: 'swagger',
      trigger: 'sw',
      path: [],
      content: [
        'swagger: "2.0"',
        '${1}'
      ].join('\n')
    },

    {
      name: 'info',
      trigger: 'info',
      path: [],
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
        '    url: ${9:http://opensource.org/licenses/MIT}',
        '${10}'
      ].join('\n')
    },

    {
      name: 'paths',
      trigger: 'pa',
      path: [],
      content: [
        'paths:',
        '  ${1}'
      ].join('\n')
    },

    {
      name: 'definitions',
      trigger: 'def',
      path: [],
      content: [
        'definitions:',
        '  ${1}'
      ].join('\n')
    },

    {
      name: 'path',
      trigger: 'path',
      path: ['paths'],
      content: [
        '${1} :',
        '  ${2}'
      ].join('\n')
    },

    {
      name: 'operation',
      trigger: 'op',
      path: ['paths', '*'],
      content: [
        '${1:operationName}:',
        '  summary: ${2}',
        '  description: ${2}',
        '  responses:',
        '    ${3:response}',
        '  parameters:',
        '    ${4:parameter}',
        '  tags: ${5:[]}',
        '${6}'
      ].join('\n')
    },

    {
      name: 'parameter',
      trigger: 'param',
      path: ['paths', '*', '*'],
      content: [
        '- name: ${1:parameter_name}',
        '  in: ${2:in}',
        '  description: ${3:description}',
        '  schema:',
        '    ${4:schema}',
        '${5}'
      ].join('\n')
    },

    {
      name: 'response',
      trigger: 'resp',
      path: ['paths', '*', '*'],
      content: [
        '${1:code}:',
        '  description: ${2}',
        '  schema: ${3}',
        '${4}'
      ].join('\n')
    }
  ]);
});
