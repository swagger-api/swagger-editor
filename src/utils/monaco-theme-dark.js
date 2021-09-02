const darkThemeMap = {
  parameter: 5,
  specVersion: 6,
  version: 6,
  info: 6,
  operation: {
    default: 7,
    'httpMethod-GET': 5, // light blue
    'httpMethod-POST': 7, // light green
  },
  key: {
    string: 0,
    number: 5,
  },
  value: {
    string: 0,
    number: 5,
  },
  pathItem: 13,
  components: 9,
  'components-parameters': 17,
  'components-schemas': 17,
  'components-messages': 17,
  'openapi-reference': 9,
  'server-url': 0,
  'Asyncapi-reference': 9,
  'json-reference': 9,
  'reference-element': 7,
  'reference-value': 13,
  content: 5,
  mediaType: 5,
  openapi: 6,
  parameters: 17,
  paths: 17,
  reference: 9,
  requestBody: 12,
  response: 12,
  responses: 17,
  schema: 9,
  server: 5,
  servers: 17,
  title: 6,
  asyncApiVersion: 6,
  channelItem: 13,
  channels: 17,
};

export default function getStyleMetadataDark(type, modifiers) {
  let color = 5;
  if (modifiers && modifiers.length > 0) {
    color = darkThemeMap[type][modifiers[0]] ? darkThemeMap[type][modifiers[0]] : 5;
  } else {
    color = darkThemeMap[type];
    if (!color) {
      color = darkThemeMap[type] && darkThemeMap[type].default ? darkThemeMap[type].default : 5;
    }
  }
  const style = {
    foreground: color,
    bold: false,
    underline: false,
    italic: false,
  };
  return style;
}

// After creating editor in component, where 'monaco' is a loaded import,
// monaco.editor.setTheme('vs-dark');
// editor._themeService._theme.getTokenStyleMetadata = getStyleMetadataDark

export const themes = {
  seVsDark: {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'info', foreground: '#1de2fa', fontStyle: 'bold' },
      { token: 'version', foreground: '#1de2fa' },
      { token: 'title', foreground: '#1de2fa' },
      { token: 'openapi', foreground: '#1de2fa', fontStyle: 'bold' },
      { token: 'specVersion', foreground: '#1de2fa' },
      { token: 'asyncApiVersion', foreground: '#1de2fa' },

      { token: 'components', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'components-parameters', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'components-schemas', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'components-messages', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'parameters', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'paths', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'responses', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'servers', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'channels', foreground: '#d0d0e3', fontStyle: 'bold' },

      { token: 'openapi-reference', foreground: '#ff2328', fontStyle: 'bold' },
      { token: 'reference', foreground: '#ff2328', fontStyle: 'bold' },
      { token: 'Asyncapi-reference', foreground: '#ff2328', fontStyle: 'bold' },
      { token: 'json-reference', foreground: '#ff2328', fontStyle: 'bold' },
      { token: 'reference-element', foreground: '#ff2328', fontStyle: 'bold' },

      { token: 'reference-value', foreground: '#ff2328', fontStyle: 'italic' },

      { token: 'server-url', foreground: '#ceca84' },
      { token: 'content', foreground: '#ceca84' },
      { token: 'mediaType', foreground: '#ceca84' },

      { token: 'requestBody', foreground: '#ceca84' },
      { token: 'response', foreground: '#ceca84' },
      { token: 'server', foreground: '#ceca84' },

      { token: 'parameter', foreground: '#ceca84' },

      { token: 'schema', foreground: '#ceca84', fontStyle: 'bold' },

      { token: 'channelItem', foreground: '#ceca84' },

      { token: 'key.string', foreground: '#e8b9bb', fontStyle: 'bold' },
      { token: 'key.number', foreground: '#e8b9bb', fontStyle: 'bold' },

      { token: 'pathItem', foreground: '#66afce', fontStyle: 'italic' }, // light blue

      { token: 'operation', foreground: '#66afce', fontStyle: 'bold' },
      { token: 'operation.httpMethod-POST', foreground: '#C678DD', fontStyle: 'bold' },
      { token: 'operation.httpMethod-GET', foreground: '#D19A66', fontStyle: 'bold' },

      { token: 'value', foreground: '#98C379' }, // green
      { token: 'value.string', foreground: '#98C379' }, // green
      { token: 'value.number', foreground: '#98C379', fontStyle: 'bold' }, // green
    ],
    colors: {
      'editor.background': '#282c34',
      'editor.foreground': '#abb2bf',
      'editorLineNumber.foreground': '#636D83',
      'editorLineNumber.activeForeground': '#ABB2BF',
      'editorHoverWidget.background': '#282c34',
      'editorHoverWidget.border': '#636D83',
      'minimap.background': '#282c34',
    },
  },
};
