const darkThemeMap = {
  parameter: 5,
  specVersion: 6,
  version: 6,
  'api-version': 6,
  'spec-version': 6,
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
      // set of blue colors
      { token: 'info', foreground: '#1de2fa', fontStyle: 'bold' }, // sky blue
      { token: 'version', foreground: '#1de2fa' }, // sky blue
      { token: 'spec-version', foreground: '#1de2fa' }, // sky blue
      { token: 'api-version', foreground: '#1de2fa' }, // sky blue
      { token: 'title', foreground: '#1de2fa' }, // sky blue
      { token: 'openapi', foreground: '#1de2fa', fontStyle: 'bold' }, // sky blue
      { token: 'specVersion', foreground: '#1de2fa' }, // sky blue
      { token: 'asyncApiVersion', foreground: '#1de2fa' }, // sky blue
      { token: 'pathItem', foreground: '#66afce', fontStyle: 'italic' }, // light blue
      { token: 'operation', foreground: '#66afce', fontStyle: 'bold' }, // light blue
      { token: 'operation.httpMethod-POST', foreground: '#336699', fontStyle: 'bold' }, // blue jeans
      { token: 'operation.httpMethod-GET', foreground: '#3366cc', fontStyle: 'bold' }, // violet blue
      // set of purple colors
      { token: 'components', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'components-parameters', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'components-schemas', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'components-messages', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'parameters', foreground: '#cc00ff', fontStyle: 'italic' },
      { token: 'parameter', foreground: '#cc00ff', fontStyle: 'italic' },
      { token: 'paths', foreground: '#C678DD', fontStyle: 'bold' },
      { token: 'responses', foreground: '#cc00ff', fontStyle: 'bold' },
      { token: 'servers', foreground: '#C678DD', fontStyle: 'bold' },
      { token: 'channels', foreground: '#d0d0e3', fontStyle: 'italic' },
      // set of orange colors
      { token: 'openapi-reference', foreground: '#ff9966' }, // not verified
      { token: 'reference', foreground: '#ff9966' }, // not verified
      { token: 'Asyncapi-reference', foreground: '#ff9966' }, // not verified
      { token: 'json-reference', foreground: '#ff9966' }, // not verified
      { token: 'reference-element', foreground: '#ff5500', fontStyle: 'bold' },
      { token: 'reference-value', foreground: '#ffddcc', fontStyle: 'italic' },
      // set of green colors
      { token: 'server-url', foreground: '#ceca84' },
      { token: 'content', foreground: '#ceca84' },
      { token: 'mediaType', foreground: '#ceca84' },
      { token: 'requestBody', foreground: '#ceca84' },
      { token: 'response', foreground: '#ceca84' },
      { token: 'server', foreground: '#ceca84' },
      // { token: 'parameter', foreground: '#ceca84' }, // dupe of above
      { token: 'schema', foreground: '#ceca84', fontStyle: 'bold' }, // e.g. components/schema
      { token: 'channelItem', foreground: '#ceca84' },
      { token: 'value', foreground: '#98C379' }, // green
      { token: 'value.string', foreground: '#98C379' }, // green
      { token: 'value.number', foreground: '#98C379', fontStyle: 'bold' }, // green
      // set of pink colors (avoid red)
      { token: 'key.string', foreground: '#e8b9bb' },
      { token: 'key.number', foreground: '#e8b9bb' },
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

/**
 * #66afce : light blue
 * #336699 : blue jeans
 * #3366cc : violet blue
 * #1de2fa : sky blue
 * #D19A66 : brown
 * #e8b9bb : pink
 * #ff2328 : red
 * #d0d0e3 : light purple, almost white
 * #C678DD : purple
 * #cc00ff : purple bright
 * #98C379 : green
 * #608d3f : dark green
 * #ceca84 : olive
 * #a49f41 : dark olive
 * #ff5500 : orange
 * #ff9966 : light orange, to replace red
 * #ffddcc : very light orange
 */

// metadata of specification, e.g. openapi, asyncapi - bold
// info section - bold
// servers section - bold
// paths section - bold
// paths - actual path - italic

// path/operation - may be bold, may be different colors
// paths/parameters, paths/requestBody, paths/responses - should be same font color/type

// components section - bold
// components/schemas - bold
// components/parameters - bold ; this token recognition needs to get fixed. currently evaluated as "parameters"
// components/messages - bold

// components/securitySchemes
// security
