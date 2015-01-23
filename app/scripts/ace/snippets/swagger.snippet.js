'use strict';

SwaggerEditor.config(function ($provide) {
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
        '/${1}:',
        '  ${2}'
      ].join('\n')
    },

    {
      name: 'get',
      trigger: 'get',
      path: ['paths', '*'],
      content: [
        '${1:get}:',
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
      name: 'post',
      trigger: 'post',
      path: ['paths', '.'],
      content: [
        '${1:post}:',
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
      name: 'put',
      trigger: 'put',
      path: ['paths', '.'],
      content: [
        '${1:put}:',
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
      name: 'delete',
      trigger: 'delete',
      path: ['paths', '.'],
      content: [
        '${1:delete}:',
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
      name: 'patch',
      trigger: 'patch',
      path: ['paths', '.'],
      content: [
        '${1:patch}:',
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
      name: 'options',
      trigger: 'options',
      path: ['paths', '.'],
      content: [
        '${1:options}:',
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
      path: ['paths', '.', '.', 'parameters'],
      content: [
        '- name: ${1:parameter_name}',
        '  in: ${2:in}',
        '  description: ${3:description}',
        '  type: ${4:string}',
        '${5}'
      ].join('\n')
    },

    {
      name: 'response',
      trigger: 'resp',
      path: ['paths', '.', '.', 'responses'],
      content: [
        '${1:code}:',
        '  description: ${2}',
        '  schema: ${3}',
        '${4}'
      ].join('\n')
    },

    {
      name: '200',
      trigger: '200',
      path: ['paths', '.', '.', 'responses'],
      content: [
        '200:',
        '  description: ${1}',
        '  schema:',
        '    type: ${2}',
        '${4}'
      ].join('\n')
    },

    {
      name: 'model',
      trigger: 'mod|def',
      regex: 'mod|def',
      path: ['definitions'],
      content: [
        '${1:ModelName}:',
        '  properties:',
        '    ${2}'
      ]
    }
  ]);
});
