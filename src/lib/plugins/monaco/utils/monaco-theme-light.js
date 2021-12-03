const lightThemeMap = {
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

export default function getStyleMetadataLight(type, modifiers) {
  let color = 5;
  if (modifiers && modifiers.length > 0) {
    color = lightThemeMap[type][modifiers[0]] ? lightThemeMap[type][modifiers[0]] : 5;
  } else {
    color = lightThemeMap[type];
    if (!color) {
      color = lightThemeMap[type] && lightThemeMap[type].default ? lightThemeMap[type].default : 5;
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
// monaco.editor.setTheme('vs');
// editor._themeService._theme.getTokenStyleMetadata = getStyleMetadataLight;

export const themes = {
  seVsLight: {
    base: 'vs', // can also be vs-dark or hc-black
    inherit: true, // can also be false to completely replace the builtin rules
    rules: [
      // top-level tokens: bold dark grey with purple tint
      { token: 'info', foreground: '#000033', fontStyle: 'bold' },
      { token: 'spec-version', foreground: '#000033', fontStyle: 'bold' },
      { token: 'servers', foreground: '#000033', fontStyle: 'bold' },
      { token: 'paths', foreground: '#000033', fontStyle: 'bold' },
      { token: 'components', foreground: '#000033', fontStyle: 'bold' },
      { token: 'channels', foreground: '#000033', fontStyle: 'bold' },
      // operation tokens: swagger-ui-post=green, swagger-ui-get=blue
      { token: 'operation', foreground: '#66afce', fontStyle: 'bold' }, // light blue
      { token: 'operation.httpMethod-GET', foreground: '#006699', fontStyle: 'bold' }, // blue-grey
      { token: 'operation.httpMethod-POST', foreground: '#339966', fontStyle: 'bold' }, // dark teal
      // parameters tokens: purple
      { token: 'parameters', foreground: '#993399', fontStyle: 'italic' },
      { token: 'parameter', foreground: '#993399', fontStyle: 'italic' },
      { token: 'components-parameters', foreground: '#993399', fontStyle: 'bold' }, // bug, not rendering as bold
      // other tokens with purple
      { token: 'components-messages', foreground: '#993399', fontStyle: 'bold' },
      // reference & $refs tokens: orange
      { token: 'reference-element', foreground: '#cc3300', fontStyle: 'bold' },
      { token: 'reference-value', foreground: '#ff5500', fontStyle: 'italic' },
      // components/{schemas}/schema: bold olive green
      { token: 'components-schemas', foreground: '#666633', fontStyle: 'bold' },
      { token: 'schema', foreground: '#666633', fontStyle: 'bold' },
      // pathItem & channelItem: bold olive green
      { token: 'pathItem', foreground: '#666633', fontStyle: 'bold' },
      { token: 'channelItem', foreground: '#666633', fontStyle: 'bold' },
      // request & response: olive green
      { token: 'requestBody', foreground: '#666633', fontStyle: 'italic' },
      { token: 'responses', foreground: '#666633', fontStyle: 'italic' },
      { token: 'content', foreground: '#666633' },
      { token: 'mediaType', foreground: '#666633' },
      { token: 'response', foreground: '#666633' },
      { token: 'server', foreground: '#666633' },
      // plain value: green
      { token: 'value', foreground: '#339933' },
      { token: 'value.string', foreground: '#339933' },
      { token: 'value.number', foreground: '#339933' },
      // plain key: pumpkin
      { token: 'key.string', foreground: '#cc6600' },
      { token: 'key.number', foreground: '#cc6600' },
      // tbd misc tokens: sky blue
      { token: 'api-version', foreground: '#0099cc' }, // version inside of info object
      { token: 'server-url', foreground: '#0099cc' },
      // tbd unverified tokens, sky blue
      { token: 'version', foreground: '#000033' },
      { token: 'title', foreground: '#000033' },
      { token: 'openapi', foreground: '#000033', fontStyle: 'bold' },
      { token: 'specVersion', foreground: '#000033' },
      { token: 'asyncApiVersion', foreground: '#000033' },
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
      'editor.background': '#fdf6e3',
      'editor.foreground': '#383a42',
      'editorLineNumber.foreground': '#9D9D9F',
      'editorLineNumber.activeForeground': '#383A42',
      'editorHoverWidget.background': '#fdf6e3',
      'editorHoverWidget.border': '#9D9D9F',
      'minimap.background': '#fdf6e3',
    },
  },
};

/**
 * One Light, bg: #fafafa, color: #383a42
 * purple-magenta #a626a4
 * reddish-orange other: #e45649
 * brown numeric: #b76b01
 * green quoted: #50a14f
 * blue: #4078f2
 * grey: #a0a1a7
 */

/**
 * Atom Light, bg: white, color: 555
 * teal: #008080
 * dark blue: #458
 * reddish string/num: #d14
 * brown: #900
 * grey: #999988
 */

/**
 * solarized light, bg: #fdf6e3 color: #657b83 highlight?: #e8e4d9
 * olive green keyword: #859900
 * teal: #2aa198
 * blue: #268bd2
 * purple-magenta: #d33682
 * dark grey string text: #657b83
 * grey: #93a1a1
 */

/**
 * One Dark; bg: #282c34, color: #abb2bf
 * purple keyword: #c678dd
 * blue: #61afef
 * reddish: #e06c75
 * green: #98c379
 * orange: #d19a66
 * grey: #5c6370
 */

/**
 * Atom dark, bg: #1d1f21, color: c5c8c6
 * light blue keyword: #96CBFE
 * olive type (function): #CFCB90
 * tan function: #FFD2A7
 * light purple parameter function, other: #C6C5FE
 * light green quoted: #A8FF60
 * pink numeric & boolean: #FF73FD
 */

/**
 * solarized dark, bg: #002b36 color: #839496 highlight?: #e8e4d9
 * olive green keyword: #859900
 * teal: #2aa198
 * blue: #268bd2
 * purple-magenta: #d33682
 * dark gray? plain text?: #657b83
 * grey: #93a1a1
 */

/**
 * keyword
 * other
 * quoted/string
 * numeric/boolean
 * comment
 * default/unknown color
 */
