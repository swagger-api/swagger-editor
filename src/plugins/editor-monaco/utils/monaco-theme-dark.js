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
      // top-level tokens: bold, with light purple-white
      { token: 'info', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'spec-version', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'servers', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'paths', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'components', foreground: '#d0d0e3', fontStyle: 'bold' },
      { token: 'channels', foreground: '#d0d0e3', fontStyle: 'bold' },
      // operation tokens: swagger-ui-post=green, swagger-ui-get=blue
      { token: 'operation', foreground: '#66afce', fontStyle: 'bold' }, // light blue
      { token: 'operation.httpMethod-GET', foreground: '#0099ff', fontStyle: 'bold' }, // blue
      { token: 'operation.httpMethod-POST', foreground: '#00cc99', fontStyle: 'bold' }, // teal
      // parameters tokens: purple
      { token: 'parameters', foreground: '#C678DD', fontStyle: 'italic' },
      { token: 'parameter', foreground: '#C678DD', fontStyle: 'italic' },
      { token: 'components-parameters', foreground: '#C678DD', fontStyle: 'bold' }, // bug, not rendering as bold
      // other tokens with purple
      { token: 'components-messages', foreground: '#C678DD', fontStyle: 'bold' },
      // reference & $refs tokens: orange
      { token: 'reference-element', foreground: '#ff5500', fontStyle: 'bold' },
      { token: 'reference-value', foreground: '#ffddcc', fontStyle: 'italic' },
      // components/{schemas}/schema: bold olive green
      { token: 'components-schemas', foreground: '#ceca84', fontStyle: 'bold' },
      { token: 'schema', foreground: '#ceca84', fontStyle: 'bold' },
      // pathItem & channelItem: bold olive green
      { token: 'pathItem', foreground: '#ceca84', fontStyle: 'bold' },
      { token: 'channelItem', foreground: '#ceca84', fontStyle: 'bold' },
      // request & response: olive green
      { token: 'requestBody', foreground: '#ceca84', fontStyle: 'italic' },
      { token: 'responses', foreground: '#ceca84', fontStyle: 'italic' },
      { token: 'content', foreground: '#ceca84' },
      { token: 'mediaType', foreground: '#ceca84' },
      { token: 'response', foreground: '#ceca84' },
      { token: 'server', foreground: '#ceca84' },
      // plain value: green
      { token: 'value', foreground: '#98C379' },
      { token: 'value.string', foreground: '#98C379' },
      { token: 'value.number', foreground: '#98C379' },
      // plain key: pinkish-orange, which appears light orange
      { token: 'key.string', foreground: '#e8b9bb' },
      { token: 'key.number', foreground: '#e8b9bb' },
      // tbd misc tokens: sky blue
      { token: 'api-version', foreground: '#1de2fa' }, // version inside of info object
      { token: 'server-url', foreground: '#1de2fa' },
      // tbd unverified tokens, sky blue
      { token: 'version', foreground: '#1de2fa' },
      { token: 'title', foreground: '#1de2fa' },
      { token: 'openapi', foreground: '#1de2fa', fontStyle: 'bold' },
      { token: 'specVersion', foreground: '#1de2fa' },
      { token: 'asyncApiVersion', foreground: '#1de2fa' },
      // tbd unverified tokens, may be orange-ish to match other reference(s)
      { token: 'openapi-reference', foreground: '#ff9966' },
      { token: 'reference', foreground: '#ff9966' },
      { token: 'Asyncapi-reference', foreground: '#ff9966' },
      { token: 'json-reference', foreground: '#ff9966' },
      // NYI, color tbd
      // { token: 'securitySchemes', foreground: '#ff9966' }, // also components/securitySchemes
      // { token: 'links', foreground: '#ff9966' }, // also components/links
      // { token: 'security', foreground: '#ff9966' },
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
 * #e8b9bb : pinkish-orange
 * #ff2328 : red
 * #d0d0e3 : light purple-white
 * #C678DD : purple
 * #cc00ff : purple bright
 * #98C379 : green
 * #608d3f : dark green
 * #ceca84 : olive
 * #a49f41 : dark olive
 * #00cc99 : teal
 * #ff5500 : orange
 * #ff9966 : light orange
 * #ffddcc : very light orange
 */
