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
      [
        /^(\s*')([^']*)(')(\s*:)(?=\s*\S)/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@values' }],
      ],
      [/^(\s*')([^']*)(')(\s*:\s*)$/, ['keyword', 'keyword', 'keyword', 'value']],

      // double-quoted keywords
      [
        /^(\s*")([^"]*)(")(\s*:)(?=\s*\S)/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@values' }],
      ],
      [/^(\s*")([^"]*)(")(\s*:\s*)$/, ['keyword', 'keyword', 'keyword', 'value']],

      // nested keywords
      [/^\s{1,}/, '', '@nestedKeywords'],

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

    values: [
      // objects
      [/\s*{/, { token: 'value', next: '@objects' }],
      // arrays
      [/\s*\[/, { token: 'value', next: '@jsonArrays' }],

      // numbers
      [/(\s*)([0-9]+)(\s*,?\s*)$/, ['value', 'value.number', 'value']],
      [/(\s*)([0-9]+\.[0-9]+)(\s*,?\s*)$/, ['value', 'value.number', 'value']],

      // booleans
      [/(\s*)(true|false)(\s*,?\s*)$/, ['value', 'value.boolean', 'value']],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      // quoted values
      [/\s*"/, { token: 'value.string', next: '@stringDoubleQuoted' }],
      [/\s*'/, { token: 'value.string', next: '@stringSingleQuoted' }],

      // unquoted values - catch-all
      [/[^\n]+$/, 'value'],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      [/:/, 'value', '@pop'],

      [/.+$/, '', '@pop'],
      [/.*$/, '', '@pop'],
    ],

    whitespace: [[/[ \t\r\n]+/, '']],

    stringDoubleQuoted: [
      [/[^\\"]+/, 'value.string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'value.string', '@pop'],
    ],

    stringSingleQuoted: [
      [/[^\\']+/, 'value.string'],
      [(/@escapes/, 'string.escape')],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'value.string', '@pop'],
    ],

    nestedKeywords: [
      // single-quoted keywords
      [
        /^(\s*')([^']*)(')(: )/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@values' }],
        '@pop',
      ],
      [/^(\s*')([^']*)(')(:)$/, ['keyword', 'keyword', 'keyword', 'value']],

      // double-quoted keywords
      [
        /^(\s*")([^"]*)(")(: )/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@values' }],
        '@pop',
      ],
      [/^(\s*")([^"]*)(")(:)$/, ['keyword', 'keyword', 'keyword', 'value']],

      // numbers
      [/([0-9]+)(\s*,?)$/, ['value.number', 'value'], '@pop'],
      [/([0-9]+\.[0-9]+)(\s*,?)$/, ['value.number', 'value'], '@pop'],

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

    objectValues: [
      // objects
      [/\s*{/, { token: 'value', next: '@objects' }],
      // arrays
      [/\s*\[/, { token: 'value', next: '@jsonArrays' }],

      // numbers
      [
        /(\s*)([0-9]+\.[0-9]+)(\s*,?\s*)/,
        ['value', 'value.number', { token: 'value', next: '@pop' }],
      ],
      [/(\s*)([0-9]+)(\s*,?\s*)/, ['value', 'value.number', { token: 'value', next: '@pop' }]],

      // booleans
      [/(\s*)(true|false)(\s*,?\s*)/, ['value', 'value.boolean', { token: 'value', next: '@pop' }]],

      // quoted values
      [/\s*"/, { token: 'value.string', next: '@stringDoubleQuoted' }],
      [/\s*'/, { token: 'value.string', next: '@stringSingleQuoted' }],

      // unquoted values - catch-all
      [/[^,}\n]+/, 'value'],

      [/,/, 'value', '@pop'],

      [/(?=})/, 'value', '@pop'],
    ],

    objects: [
      // single-quoted keywords
      [
        /(\s*')([^']*)(')(\s*:)(?=\s*\S)/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@objectValues' }],
      ],
      [
        /(\s*')([^']*)(')(\s*:\s*)$/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@objectValues' }],
      ],

      // double-quoted keywords
      [
        /(\s*")([^"]*)(")(\s*:)(?=\s*\S)/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@objectValues' }],
      ],
      [
        /(\s*")([^"]*)(")(\s*:\s*)$/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@objectValues' }],
      ],

      // objects
      [/\s*{/, { token: 'value', next: '@objects' }],
      // arrays
      [/\s*\[/, { token: 'value', next: '@jsonArrays' }],

      // unquoted values - catch-all
      [/[^,}\n]+/, 'value'],

      [/,/, 'value'],

      [/}/, 'value', '@pop'],
    ],

    // JSON arrays
    jsonArrays: [
      [/\s*{/, { token: 'value', next: '@objects' }],
      [/\s*\[/, { token: 'value', next: '@jsonArrays' }],

      // numbers
      [/(\s*)([0-9]+)(\s*,?\s*)/, ['value', 'value.number', 'value']],
      [/(\s*)([0-9]+\.[0-9]+)(\s*,?\s*)/, ['value', 'value.number', 'value']],

      // booleans
      [/(\s*)(true|false)(\s*,?\s*)/, ['value', 'value.boolean', 'value']],

      // quoted values
      [/\s*"/, { token: 'value.string', next: '@stringDoubleQuoted' }],
      [/\s*'/, { token: 'value.string', next: '@stringSingleQuoted' }],

      // unquoted values - catch-all
      [/[^,\]\n]+/, 'value'],

      [/,/, 'value'],

      [/\]/, 'value', '@pop'],
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
      [/^#.*$/, 'value'],

      // specification extensions
      [/^(x-[^:\s]+)(: )/, ['keyword', { token: 'value', next: '@values' }]],
      [/^(x-[^:\s]+)(:)$/, ['keyword', 'value']],

      // keywords
      [/^([a-zA-Z_$][\w$]*)(: )/, ['keyword', { token: 'value', next: '@values' }]],
      [/^([a-zA-Z_$][\w$]*)(:)$/, ['keyword', 'value']],

      // single-quoted keywords
      [
        /^(\s*')([^']*)(')(: )/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@values' }],
      ],
      [/^(\s*')([^']*)(')(:)$/, ['keyword', 'keyword', 'keyword', 'value']],

      // double-quoted keywords
      [
        /^(\s*")([^"]*)(")(: )/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@values' }],
      ],
      [/^(\s*")([^"]*)(")(:)$/, ['keyword', 'keyword', 'keyword', 'value']],

      // arrays
      [/^\s*-\s/, 'value', '@arrays'],

      // nested keywords
      [/^\s{1,}/, '', '@nestedKeywords'],

      // keywords catch-all
      [/^(\s*[^\s]+)(: )/, ['keyword', { token: 'value', next: '@values' }]],
      [/^(\s*[^\s]+)(:)$/, ['keyword', 'value']],

      // whitespace
      { include: '@whitespace' },

      // strings for todos
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
      [/"/, 'value.string', '@stringDoubleQuoted'],
      [/'/, 'value.string', '@stringSingleQuoted'],
    ],

    values: [
      [/\s*{/, { token: 'value', next: '@objects' }],
      [/\s*\[/, { token: 'value', next: '@jsonArrays' }],

      // numbers
      [/\s*[0-9]+\s*$/, 'value.number'],
      [/\s*[0-9]+(\.[0-9]+)?\s*$/, 'value.number'],

      // booleans
      [/\s*(true|false)\s*$/, 'value.boolean'],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      // quoted values
      [/\s*"/, { token: 'value.string', next: '@stringDoubleQuoted' }],
      [/\s*'/, { token: 'value.string', next: '@stringSingleQuoted' }],

      // unquoted values - catch-all
      [/[^\n]+$/, 'value'],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      [/:/, 'value', '@pop'],

      [/.+$/, '', '@pop'],
      [/.*$/, '', '@pop'],
    ],

    whitespace: [[/[ \t\r\n]+/, '']],

    stringDoubleQuoted: [
      [/[^\\"]+/, 'value.string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'value.string', '@pop'],
    ],

    stringSingleQuoted: [
      [/[^\\']+/, 'value.string'],
      [(/@escapes/, 'string.escape')],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'value.string', '@pop'],
    ],

    nestedKeywords: [
      // specification extensions
      [/(x-[^:\s]+)(: )/, ['keyword', { token: 'value', next: '@values' }]],
      [/(x-[^:\s]+)(:)$/, ['keyword', 'value']],

      // keywords
      [/([a-zA-Z_$][\w$]*)(: )/, ['keyword', { token: 'value', next: '@values' }]],
      [/([a-zA-Z_$][\w$]*)(:)$/, ['keyword', 'value']],

      // single-quoted keywords
      [
        /(\s*')([^']*)(')(: )/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@values' }],
      ],
      [/(\s*')([^']*)(')(:)$/, ['keyword', 'keyword', 'keyword', 'value']],

      // double-quoted keywords
      [
        /(\s*")([^"]*)(")(: )/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@values' }],
      ],
      [/(\s*")([^"]*)(")(:)$/, ['keyword', 'keyword', 'keyword', 'value']],

      // keywords catch-all
      [/(\s*[^\s]+)(: )/, ['keyword', { token: 'value', next: '@values' }]],
      [/(\s*[^\s]+)(:)$/, ['keyword', 'value']],

      // pop state when getting to a new line
      [/^/, '', '@pop'],
      [/.+$/, 'value', '@pop'],
    ],

    arrays: [
      // specification extensions
      [/(x-[^:\s]+)(: )/, ['keyword', { token: 'value', next: '@values' }]],
      [/(x-[^:\s]+)(:)$/, ['keyword', 'value']],

      // keywords
      [/([a-zA-Z_$][\w$]*)(: )/, ['keyword', { token: 'value', next: '@values' }]],
      [/([a-zA-Z_$][\w$]*)(:)$/, ['keyword', 'value']],

      // single-quoted keywords
      [
        /(\s*')([^']*)(')(: )/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@values' }],
      ],
      [/(\s*')([^']*)(')(:)$/, ['keyword', 'keyword', 'keyword', 'value']],

      // double-quoted keywords
      [
        /(\s*")([^"]*)(")(: )/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@values' }],
      ],
      [/(\s*")([^"]*)(")(:)$/, ['keyword', 'keyword', 'keyword', 'value']],

      // keywords catch-all
      [/(\s*[^\s]+)(: )/, ['keyword', { token: 'value', next: '@values' }]],
      [/(\s*[^\s]+)(:)$/, ['keyword', 'value']],

      [/^/, '', '@pop'],

      // numbers
      [/\s*([0-9]+)\s*$/, 'value.number'],
      [/\s*([0-9]+\.[0-9]+)\s*$/, 'value.number'],

      // booleans
      [/\s*(true|false)\s*$/, 'value.boolean'],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      // unquoted values - catch-all
      [/([^\n'"]+)\s*$/, 'value'],

      // quoted values
      [/\s*"/, 'value.string', '@stringDoubleQuoted'],
      [/\s*'/, 'value.string', '@stringSingleQuoted'],

      // pop state when getting to a new line
      [/^/, '', '@pop'],

      [/:/, 'value', '@pop'],

      [/.+$/, '', '@pop'],
      [/.*$/, '', '@pop'],
    ],

    objectValues: [
      // objects
      [/\s*{/, { token: 'value', next: '@objects' }],
      // arrays
      [/\s*\[/, { token: 'value', next: '@jsonArrays' }],

      // numbers
      [
        /(\s*)([0-9]+\.[0-9]+)(\s*,?\s*)/,
        ['value', 'value.number', { token: 'value', next: '@pop' }],
      ],
      [/(\s*)([0-9]+)(\s*,?\s*)/, ['value', 'value.number', { token: 'value', next: '@pop' }]],

      // booleans
      [/(\s*)(true|false)(\s*,?\s*)/, ['value', 'value.boolean', { token: 'value', next: '@pop' }]],

      // quoted values
      [/\s*"/, { token: 'value.string', next: '@stringDoubleQuoted' }],
      [/\s*'/, { token: 'value.string', next: '@stringSingleQuoted' }],

      // unquoted values - catch-all
      [/[^,}\n]+/, 'value'],

      [/,/, 'value', '@pop'],

      [/(?=})/, 'value', '@pop'],
    ],

    objects: [
      // single-quoted keywords
      [
        /(\s*')([^']*)(')(\s*:)(?=\s*\S)/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@objectValues' }],
      ],
      [
        /(\s*')([^']*)(')(\s*:\s*)$/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@objectValues' }],
      ],

      // double-quoted keywords
      [
        /(\s*")([^"]*)(")(\s*:)(?=\s*\S)/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@objectValues' }],
      ],
      [
        /(\s*")([^"]*)(")(\s*:\s*)$/,
        ['keyword', 'keyword', 'keyword', { token: 'value', next: '@objectValues' }],
      ],

      // objects
      [/\s*{/, { token: 'value', next: '@objects' }],
      // arrays
      [/\s*\[/, { token: 'value', next: '@jsonArrays' }],

      // unquoted values - catch-all
      [/[^,}\n]+/, 'value'],

      [/,/, 'value'],

      [/}/, 'value', '@pop'],
    ],

    // JSON arrays
    jsonArrays: [
      [/\s*{/, { token: 'value', next: '@objects' }],
      [/\s*\[/, { token: 'value', next: '@jsonArrays' }],

      // numbers
      [/(\s*)([0-9]+)(\s*,?\s*)/, ['value', 'value.number', 'value']],
      [/(\s*)([0-9]+\.[0-9]+)(\s*,?\s*)/, ['value', 'value.number', 'value']],

      // booleans
      [/(\s*)(true|false)(\s*,?\s*)/, ['value', 'value.boolean', 'value']],

      // quoted values
      [/\s*"/, { token: 'value.string', next: '@stringDoubleQuoted' }],
      [/\s*'/, { token: 'value.string', next: '@stringSingleQuoted' }],

      // unquoted values - catch-all
      [/[^,\]\n]+/, 'value'],

      [/,/, 'value'],

      [/\]/, 'value', '@pop'],
    ],
  },
};
