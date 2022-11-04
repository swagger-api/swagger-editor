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
  'components-request-bodies': 17,
  'components-examples': 17,
  'components-headers': 17,
  'components-security-schemes': 17,
  'components-links': 17,
  'components-callbacks': 17,
  'components-path-items': 17,
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
  tags: 6,
  webhooks: 6,
  contact: 6,
  license: 6,
  externalDocumentation: 6,
  'server-description': 6,
  'server-variables': 6,
  'operation-callbacks': 6,
  callback: 6,
  messageTraits: 17,
  operationTraits: 17,
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
      // top-level tokens for OpenAPI Object: bold dark grey with purple tint
      { token: 'openapi', foreground: '#000033', fontStyle: 'bold' },
      { token: 'info', foreground: '#000033', fontStyle: 'bold' },
      { token: 'jsonSchemaDialect', foreground: '#000033', fontStyle: 'bold' },
      { token: 'servers', foreground: '#000033', fontStyle: 'bold' },
      { token: 'paths', foreground: '#000033', fontStyle: 'bold' },
      { token: 'webhooks', foreground: '#000033', fontStyle: 'bold' },
      { token: 'components', foreground: '#000033', fontStyle: 'bold' },
      { token: 'security', foreground: '#000033', fontStyle: 'bold' },
      { token: 'tags', foreground: '#000033', fontStyle: 'bold' },
      { token: 'externalDocumentation', foreground: '#000033', fontStyle: 'bold' },
      // additional top-level tokens for AsyncAPI Object: bold dark grey with purple tint
      { token: 'spec-version', foreground: '#000033', fontStyle: 'bold' }, // e.g. asyncapi
      { token: 'channels', foreground: '#000033', fontStyle: 'bold' },
      // operation tokens: swagger-ui-post=green, swagger-ui-get=blue
      { token: 'operation', foreground: '#66afce', fontStyle: 'bold' }, // light blue
      { token: 'operation.httpMethod-GET', foreground: '#006699', fontStyle: 'bold' }, // blue-grey
      { token: 'operation.httpMethod-POST', foreground: '#339966', fontStyle: 'bold' }, // dark teal
      // parameters tokens: purple
      { token: 'parameters', foreground: '#993399', fontStyle: 'italic' },
      { token: 'parameter', foreground: '#993399', fontStyle: 'italic' },
      { token: 'components-parameters', foreground: '#993399', fontStyle: 'bold' },
      // messages tokens: purple
      { token: 'components-messages', foreground: '#993399', fontStyle: 'bold' },
      { token: 'messages', foreground: '#993399', fontStyle: 'italic' },
      { token: 'message', foreground: '#993399' },
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
      { token: 'components-responses', foreground: '#666633', fontStyle: 'bold' },
      { token: 'components-request-bodies', foreground: '#666633', fontStyle: 'bold' },
      { token: 'content', foreground: '#666633' },
      { token: 'mediaType', foreground: '#666633' },
      { token: 'response', foreground: '#666633' },
      { token: 'server', foreground: '#666633' },
      // additional components: bold olive green
      { token: 'components-examples', foreground: '#666633', fontStyle: 'bold' },
      { token: 'components-headers', foreground: '#666633', fontStyle: 'bold' },
      { token: 'components-links', foreground: '#666633', fontStyle: 'bold' },
      { token: 'components-security-schemes', foreground: '#666633', fontStyle: 'bold' },
      { token: 'components-callbacks', foreground: '#666633', fontStyle: 'bold' },
      { token: 'components-pathItems', foreground: '#666633', fontStyle: 'bold' },
      { token: 'components-path-items', foreground: '#666633', fontStyle: 'bold' },
      // plain value: green
      { token: 'value', foreground: '#339933' },
      { token: 'value.string', foreground: '#339933' },
      { token: 'value.number', foreground: '#339933' },
      // plain key: pumpkin
      { token: 'key.string', foreground: '#cc6600' },
      { token: 'key.number', foreground: '#cc6600' },
      // misc token key/value pair: sky blue
      { token: 'api-version', foreground: '#0099cc' }, // version inside of info object
      { token: 'server-url', foreground: '#0099cc' },
      // misc token object: sky blue
      { token: 'callback', foreground: '#0099cc' },
      { token: 'contact', foreground: '#0099cc' },
      { token: 'discriminator', foreground: '#0099cc' },
      { token: 'example', foreground: '#0099cc' }, // only when examples.example
      { token: 'examples', foreground: '#0099cc' },
      { token: 'header', foreground: '#0099cc' },
      { token: 'license', foreground: '#0099cc' },
      { token: 'oAuthFlow', foreground: '#0099cc' },
      { token: 'oAuthFlows', foreground: '#0099cc' },
      { token: 'operation-example', foreground: '#0099cc' },
      { token: 'operation-callbacks', foreground: '#0099cc' },
      { token: 'securityScheme', foreground: '#0099cc' },
      { token: 'server-variables', foreground: '#0099cc' },
      { token: 'messageTrait', foreground: '#0099cc' },
      { token: 'operationTrait', foreground: '#0099cc' },
      // tokens exist in apidom-ls, but not working in editor, sky blue
      { token: 'version', foreground: '#0099cc' },
      { token: 'title', foreground: '#0099cc' },
      { token: 'specVersion', foreground: '#0099cc' },
      { token: 'asyncApiVersion', foreground: '#0099cc' },
      // tokens exist in apidom-ls, but not working in editor, may be orange-ish to match other reference(s)
      { token: 'openapi-reference', foreground: '#ff9966' },
      { token: 'reference', foreground: '#ff9966' },
      { token: 'Asyncapi-reference', foreground: '#ff9966' },
      { token: 'json-reference', foreground: '#ff9966' },
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
