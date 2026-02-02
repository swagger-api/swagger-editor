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

export const apiDOMMonarchLanguageDef = {
  // set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: 'invalid',
  keywords: ['swagger', 'info', 'host', 'basePath', 'tags', 'schemes', 'paths', 'externalDocs'],
  typeKeywords: ['description', 'title', 'termsOfService'],
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  // the main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [
        /[a-zA-Z_$][\w$]*/,
        {
          cases: {
            '@keywords': { token: 'keyword' },
            '@typeKeywords': { token: 'type' },
            '@default': 'identifier',
          },
        },
      ],
      // whitespace
      { include: '@whitespace' },
      // strings for todos
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
      [/"/, 'string', '@string'],
    ],
    whitespace: [[/[ \t\r\n]+/, '']],
    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop'],
    ],
  },
};

export const monarchLanguageDef = {
  // set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: 'invalid',
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  // the main tokenizer for our languages
  tokenizer: {
    root: [
      [/^#.*$/, 'plain.value'],

      // objects
      [/\s*{/, { token: 'plain.value', next: '@objects' }],

      // specification extensions
      [/^(x-[^:\s]+)(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/^(x-[^:\s]+)(:)$/, ['plain.keyword', 'plain.value']],

      // keywords
      [/^([a-zA-Z_$][\w$]*)(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/^([a-zA-Z_$][\w$]*)(:)$/, ['plain.keyword', 'plain.value']],

      // single-quoted keywords
      [/^(\s*'[^']*')(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/^(\s*'[^']*')(:)$/, ['plain.keyword', 'plain.value']],

      // double-quoted keywords
      [/^(\s*"[^"]*")(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/^(\s*"[^"]*")(:)$/, ['plain.keyword', 'plain.value']],

      // arrays
      [/^\s*-\s/, 'plain.value', '@arrays'],

      // nested keywords
      [/^\s{1,}/, '', '@nestedKeywords'],

      // keywords catch-all
      [/^(\s*[^\s]+)(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/^(\s*[^\s]+)(:)$/, ['plain.keyword', 'plain.value']],

      // whitespace
      { include: '@whitespace' },

      // strings for todos
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
      [/"/, 'plain.value.string', '@stringDoubleQuoted'],
      [/'/, 'plain.value.string', '@stringSingleQuoted'],
    ],

    values: [
      [/\s*{/, { token: 'plain.value', next: '@objects' }],
      [/\s*\[/, { token: 'plain.value', next: '@jsonArrays' }],

      // numbers
      [/\s*[0-9]+\s*$/, 'plain.value.number'],
      [/\s*[0-9]+(\.[0-9]+)?\s*$/, 'plain.value.number'],

      // booleans
      [/\s*(true|false)\s*$/, 'plain.value.boolean'],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      // quoted values
      [/\s*"/, { token: 'plain.value.string', next: '@stringDoubleQuoted' }],
      [/\s*'/, { token: 'plain.value.string', next: '@stringSingleQuoted' }],

      // unquoted values - catch-all
      [/[^\n]+$/, 'plain.value'],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      [/:/, 'plain.value', '@pop'],

      [/.+$/, '', '@pop'],
      [/.*$/, '', '@pop'],
    ],

    whitespace: [[/[ \t\r\n]+/, '']],

    stringDoubleQuoted: [
      [/[^\\"]+/, 'plain.value.string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'plain.value.string', '@pop'],
    ],

    stringSingleQuoted: [
      [/[^\\']+/, 'plain.value.string'],
      [(/@escapes/, 'string.escape')],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'plain.value.string', '@pop'],
    ],

    nestedKeywords: [
      // specification extensions
      [/(x-[^:\s]+)(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/(x-[^:\s]+)(:)$/, ['plain.keyword', 'plain.value']],

      // keywords
      [/([a-zA-Z_$][\w$]*)(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/([a-zA-Z_$][\w$]*)(:)$/, ['plain.keyword', 'plain.value']],

      // single-quoted keywords
      [/(\s*'[^']*')(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/(\s*'[^']*')(:)$/, ['plain.keyword', 'plain.value']],

      // double-quoted keywords
      [/(\s*"[^"]*")(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/(\s*"[^"]*")(:)$/, ['plain.keyword', 'plain.value']],

      // keywords catch-all
      [/(\s*[^\s]+)(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/(\s*[^\s]+)(:)$/, ['plain.keyword', 'plain.value']],

      // pop state when getting to a new line
      [/^/, '', '@pop'],
      [/.+$/, 'plain.value', '@pop'],
    ],

    arrays: [
      // specification extensions
      [/(x-[^:\s]+)(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/(x-[^:\s]+)(:)$/, ['plain.keyword', 'plain.value']],

      // keywords
      [/([a-zA-Z_$][\w$]*)(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/([a-zA-Z_$][\w$]*)(:)$/, ['plain.keyword', 'plain.value']],

      // single-quoted keywords
      [/(\s*'[^']*')(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/(\s*'[^']*')(:)$/, ['plain.keyword', 'plain.value']],

      // double-quoted keywords
      [/(\s*"[^"]*")(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/(\s*"[^"]*")(:)$/, ['plain.keyword', 'plain.value']],

      // keywords catch-all
      [/(\s*[^\s]+)(: )/, ['plain.keyword', { token: 'plain.value', next: '@values' }]],
      [/(\s*[^\s]+)(:)$/, ['plain.keyword', 'plain.value']],

      [/^/, '', '@pop'],

      // numbers
      [/\s*([0-9]+)\s*$/, 'plain.value.number'],
      [/\s*([0-9]+\.[0-9]+)\s*$/, 'plain.value.number'],

      // booleans
      [/\s*(true|false)\s*$/, 'plain.value.boolean'],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      // unquoted values - catch-all
      [/([^\n'"]+)\s*$/, 'plain.value'],

      // quoted values
      [/\s*"/, 'plain.value.string', '@stringDoubleQuoted'],
      [/\s*'/, 'plain.value.string', '@stringSingleQuoted'],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      [/:/, 'plain.value', '@pop'],

      [/.+$/, '', '@pop'],
      [/.*$/, '', '@pop'],
    ],

    objectValues: [
      // objects
      [/\s*{/, { token: 'plain.value', next: '@objects' }],
      // arrays
      [/\s*\[/, { token: 'plain.value', next: '@jsonArrays' }],

      // numbers
      [
        /(\s*)([0-9]+\.[0-9]+)(\s*,?\s*)/,
        ['plain.value', 'plain.value.number', { token: 'plain.value', next: '@pop' }],
      ],
      [
        /(\s*)([0-9]+)(\s*,?\s*)/,
        ['plain.value', 'plain.value.number', { token: 'plain.value', next: '@pop' }],
      ],

      // booleans
      [
        /(\s*)(true|false)(\s*,?\s*)/,
        ['plain.value', 'plain.value.boolean', { token: 'plain.value', next: '@pop' }],
      ],

      // quoted values
      [/\s*"/, { token: 'plain.value.string', next: '@stringDoubleQuoted' }],
      [/\s*'/, { token: 'plain.value.string', next: '@stringSingleQuoted' }],

      // unquoted values - catch-all
      [/[^,}\n]+/, 'plain.value'],

      [/,/, 'plain.value', '@pop'],

      [/(?=})/, 'plain.value', '@pop'],
    ],

    objects: [
      // single-quoted keywords
      [
        /(\s*'[^']*'\s*)(:)(?=\s*\S)/,
        ['plain.keyword', { token: 'plain.value', next: '@objectValues' }],
      ],
      [
        /(\s*'[^']*')(\s*:\s*)$/,
        ['plain.keyword', { token: 'plain.value', next: '@objectValues' }],
      ],

      // double-quoted keywords
      [
        /(\s*"[^"]*")(\s*:)(?=\s*\S)/,
        ['plain.keyword', { token: 'plain.value', next: '@objectValues' }],
      ],
      [
        /(\s*"[^"]*")(\s*:\s*)$/,
        ['plain.keyword', { token: 'plain.value', next: '@objectValues' }],
      ],

      // objects
      [/\s*{/, { token: 'plain.value', next: '@objects' }],
      // arrays
      [/\s*\[/, { token: 'plain.value', next: '@jsonArrays' }],

      // unquoted values - catch-all
      [/[^,}\n]+/, 'plain.value'],

      [/,/, 'plain.value'],

      [/}/, 'plain.value', '@pop'],
    ],

    // JSON arrays
    jsonArrays: [
      [/\s*{/, { token: 'plain.value', next: '@objects' }],
      [/\s*\[/, { token: 'plain.value', next: '@jsonArrays' }],

      // numbers
      [/(\s*)([0-9]+)(\s*,?\s*)/, ['plain.value', 'plain.value.number', 'plain.value']],
      [/(\s*)([0-9]+\.[0-9]+)(\s*,?\s*)/, ['plain.value', 'plain.value.number', 'plain.value']],

      // booleans
      [/(\s*)(true|false)(\s*,?\s*)/, ['plain.value', 'plain.value.boolean', 'plain.value']],

      // quoted values
      [/\s*"/, { token: 'plain.value.string', next: '@stringDoubleQuoted' }],
      [/\s*'/, { token: 'plain.value.string', next: '@stringSingleQuoted' }],

      // unquoted values - catch-all
      [/[^,\]\n]+/, 'plain.value'],

      [/,/, 'plain.value'],

      [/\]/, 'plain.value', '@pop'],
    ],
  },
};
