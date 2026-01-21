import * as monaco from 'monaco-editor';

export const languageId = 'apidom';

export const conf = {
  comments: {
    lineComment: '#',
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],

  onEnterRules: [
    {
      beforeText: /:\s*$/,
      action: { indentAction: monaco.languages.IndentAction.Indent },
    },
    {
      beforeText: /-\s+\w*$/,
      action: { indentAction: monaco.languages.IndentAction.None, appendText: '- ' },
    },
    {
      beforeText: /-\s*$/,
      action: { indentAction: monaco.languages.IndentAction.None, appendText: '- ' },
    },
  ],
};

export const monarchLanguageDefJSON = {
  // set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: 'invalid',
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  // the main tokenizer for our languages
  tokenizer: {
    root: [
      // single-quoted keywords
      [/^\s*'([^']*)'(?=:)/, 'keyword'],

      // double-quoted keywords
      [/^\s*"([^"]*)"(?=:)/, 'keyword'],

      // nested keywords
      [/^\s{1,}/, '', '@nestedKeywords'],

      // numbers
      [/(:)( )([0-9]+)(\s*,?)$/, ['value', '', 'value.number', 'value']],
      [/(:)( )([0-9]+\.[0-9]+)\s*(\s*,?)$/, ['value', '', 'value.number', 'value']],

      // booleans
      [/(:)( )(true|false)(\s*,?)$/, ['value', '', 'value.boolean', 'value']],

      // unquoted values - catch-all
      [/(:)( )([^\n'"]+)\s*$/, ['value', '', 'value']],

      // quoted values
      [/(:)( )(")/, ['value', '', { token: 'value.string', next: '@stringDoubleQuoted' }]],
      [/(:)( )(')/, ['value', '', { token: 'value.string', next: '@stringSingleQuoted' }]],

      [/:/, 'value'],
      [/,/, 'value'],

      // whitespace
      { include: '@whitespace' },

      // strings for todos
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
      [/"/, 'value.string', '@stringDoubleQuoted'],
      [/'/, 'value.string', '@stringSingleQuoted'],
      // brackets
      // eslint-disable-next-line no-useless-escape
      [/[()\[\]{}]/, 'value'],
    ],

    whitespace: [[/[ \t\r\n]+/, '']],

    stringDoubleQuoted: [
      [/x-[^:\s]+/, 'value.string'],
      [/[a-zA-Z_$][\w$]*/, 'value.string'],
      [/[^\\"]+/, 'value.string'],
      [(/@escapes/, 'string.escape')],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'value.string', '@pop'],
    ],

    stringSingleQuoted: [
      [/x-[^:\s]+/, 'value.string'],
      [/[a-zA-Z_$][\w$]*/, 'value.string'],
      [/[^\\']+/, 'value.string'],
      [(/@escapes/, 'string.escape')],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'value.string', '@pop'],
    ],

    nestedKeywords: [
      // single-quoted keywords
      [/^\s*'([^']*)'(?=: )/, 'keyword'],

      // double-quoted keywords
      [/^\s*"([^"]*)"(?=: )/, 'keyword'],

      // numbers
      [/([0-9]+)(\s*,?)$/, ['value.number', 'value'], '@pop'],
      [/([0-9]+\.[0-9]+)\s*(\s*,?)$/, ['value.number', 'value'], '@pop'],

      // booleans
      [/(true|false)(\s*,?)$/, ['value.boolean', 'value'], '@pop'],

      // quoted values
      [/"/, 'value.string', '@stringDoubleQuoted'],
      [/'/, 'value.string', '@stringSingleQuoted'],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      // invalid or value ?
      [/:/, 'value', '@pop'],

      [/.+$/, 'value', '@pop'],
    ],
  },
};

export const monarchLanguageDefYAML = {
  // set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: 'invalid',
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  // the main tokenizer for our languages
  tokenizer: {
    root: [
      // specification extensions
      [/x-[^:\s]+(?=:)/, 'keyword'],

      // keywords
      [/^[a-zA-Z_$][\w$]*/, 'keyword'],

      // single-quoted keywords
      [/^\s*'([^']*)'(?=:)/, 'keyword'],

      // double-quoted keywords
      [/^\s*"([^"]*)"(?=:)/, 'keyword'],

      // keywords catch-all
      [/^\s*([^\s:]+)(?=:)/, 'keyword'],

      // arrays
      [/^\s*-\s/, 'value', '@arrays'],

      // nested keywords
      [/^\s{1,}/, '', '@nestedKeywords'],

      // numbers
      [/(:)( )([0-9]+)\b$/, ['value', '', 'value.number']],
      [/(:)( )([0-9]+\.[0-9]+)\s*$/, ['value', '', 'value.number']],

      // booleans
      [/(:)( )(true|false)\b$/, ['value', '', 'value.boolean']],

      // unquoted values - catch-all
      [/(:)( )([^\n'"]+)\s*$/, ['value', '', 'value']],

      // quoted values
      [/(:)( )(")/, ['value', '', { token: 'value.string', next: '@stringDoubleQuoted' }]],
      [/(:)( )(')/, ['value', '', { token: 'value.string', next: '@stringSingleQuoted' }]],

      [/:/, 'value'],

      // whitespace
      { include: '@whitespace' },

      // strings for todos
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
      [/"/, 'value.string', '@stringDoubleQuoted'],
      [/'/, 'value.string', '@stringSingleQuoted'],
    ],

    whitespace: [[/[ \t\r\n]+/, '']],

    stringDoubleQuoted: [
      [/x-[^:\s]+/, 'value.string'],
      [/[a-zA-Z_$][\w$]*/, 'value.string'],
      [/[^\\"]+/, 'value.string'],
      [(/@escapes/, 'string.escape')],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'value.string', '@pop'],
    ],

    stringSingleQuoted: [
      [/x-[^:\s]+/, 'value.string'],
      [/[a-zA-Z_$][\w$]*/, 'value.string'],
      [/[^\\']+/, 'value.string'],
      [(/@escapes/, 'string.escape')],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'value.string', '@pop'],
    ],

    nestedKeywords: [
      // specification extensions
      [/(x-[^:\s]+)(?=: )/, 'keyword'],

      // keywords
      [/([a-zA-Z_$][\w$]*)\s*(?=: )/, 'keyword'],

      // single-quoted keywords
      [/^\s*'([^']*)'(?=: )/, 'keyword'],

      // double-quoted keywords
      [/^\s*"([^"]*)"(?=: )/, 'keyword'],

      // numbers
      [/(:)( )([0-9]+)\b$/, ['value', '', 'value.number'], '@pop'],
      [/(:)( )([0-9]+\.[0-9]+)\s*\b$/, ['value', '', 'value.number'], '@pop'],

      // booleans
      [/(:)( )(true|false)\b$/, ['value', '', 'value.boolean'], '@pop'],

      // unquoted values - catch-all
      [/(:)( )([^\n'"]+)\s*$/, ['value', '', 'value'], '@pop'],

      // quoted values
      [/"/, 'value.string', '@stringDoubleQuoted'],
      [/'/, 'value.string', '@stringSingleQuoted'],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      [/:/, 'value', '@pop'],

      [/.+$/, 'value', '@pop'],
    ],

    arrays: [
      /**
       * TODO: handle cases where element of an array is a string with colon, e.g. - write:pets
       * currently `write:` will be tokenized as keyword, which is not correct
       * note that we still need to handle objects in arrays,
       * so we cannot change (?=:) to (?=: ), e.g.
       * - some_keyword:
       *    another_keyword: value
       */

      // specification extensions
      [/x-[^:\s]+(?=:)/, 'keyword'],

      // keywords
      [/([a-zA-Z_$][\w$]*)\s*(?=:)/, 'keyword'],

      // numbers
      [/(:)( )([0-9]+)\b$/, ['value', '', 'value.number']],
      [/(:)( )([0-9]+\.[0-9]+)\s*\b$/, ['value', '', 'value.number']],
      [/([0-9]+)\b$/, 'value.number'],
      [/([0-9]+\.[0-9]+)\s*\b$/, 'value.number'],

      // booleans
      [/(:)( )(true|false)\b$/, ['value', '', 'value.boolean']],
      [/(true|false)\b$/, 'value.boolean'],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      // unquoted values - catch-all
      [/(:)( )([^\n'"]+)\s*\b$/, ['value', '', 'value']],
      [/([^\n'"]+)\s*$/, 'value'],

      // quoted values
      [/"/, 'value.string', '@stringDoubleQuoted'],
      [/'/, 'value.string', '@stringSingleQuoted'],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      [/:/, 'value', '@pop'],

      [/.+$/, '', '@pop'],
      [/.*$/, '', '@pop'],
    ],
  },
};
