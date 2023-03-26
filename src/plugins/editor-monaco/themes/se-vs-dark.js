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

export const getStyleMetadataDark = (type, modifiers) => {
  let color = 5;

  if (modifiers && modifiers.length > 0) {
    color = darkThemeMap[type][modifiers[0]] ? darkThemeMap[type][modifiers[0]] : 5;
  } else {
    color = darkThemeMap[type];
    if (!color) {
      color = darkThemeMap[type] && darkThemeMap[type].default ? darkThemeMap[type].default : 5;
    }
  }

  return {
    foreground: color,
    bold: false,
    underline: false,
    italic: false,
  };
};

export default {
  base: 'vs-dark',
  inherit: true,
  rules: [
    // top-level tokens for OpenAPI Object: bold, with light purple-white
    { token: 'openapi', foreground: '#d0d0e3', fontStyle: 'bold' },
    { token: 'info', foreground: '#d0d0e3', fontStyle: 'bold' },
    { token: 'jsonSchemaDialect', foreground: '#d0d0e3', fontStyle: 'bold' },
    { token: 'servers', foreground: '#d0d0e3', fontStyle: 'bold' },
    { token: 'paths', foreground: '#d0d0e3', fontStyle: 'bold' },
    { token: 'webhooks', foreground: '#d0d0e3', fontStyle: 'bold' },
    { token: 'components', foreground: '#d0d0e3', fontStyle: 'bold' },
    { token: 'security', foreground: '#d0d0e3', fontStyle: 'bold' },
    { token: 'tags', foreground: '#d0d0e3', fontStyle: 'bold' },
    { token: 'externalDocumentation', foreground: '#d0d0e3', fontStyle: 'bold' },
    // additional top-level tokens for AsyncAPI Object: bold, with light purple-white
    { token: 'spec-version', foreground: '#d0d0e3', fontStyle: 'bold' }, // e.g. asyncapi
    { token: 'channels', foreground: '#d0d0e3', fontStyle: 'bold' },
    // operation tokens: swagger-ui-post=green, swagger-ui-get=blue
    { token: 'operation', foreground: '#66afce', fontStyle: 'bold' }, // light blue
    { token: 'operation.httpMethod-GET', foreground: '#0099ff', fontStyle: 'bold' }, // blue
    { token: 'operation.httpMethod-POST', foreground: '#00cc99', fontStyle: 'bold' }, // teal
    // parameters tokens: purple
    { token: 'parameters', foreground: '#C678DD', fontStyle: 'italic' },
    { token: 'parameter', foreground: '#C678DD', fontStyle: 'italic' },
    { token: 'components-parameters', foreground: '#C678DD', fontStyle: 'bold' },
    // messages tokens: purple
    { token: 'components-messages', foreground: '#C678DD', fontStyle: 'bold' },
    { token: 'messages', foreground: '#C678DD', fontStyle: 'italic' },
    { token: 'message', foreground: '#C678DD' },
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
    { token: 'components-responses', foreground: '#ceca84', fontStyle: 'bold' },
    { token: 'components-request-bodies', foreground: '#ceca84', fontStyle: 'bold' },
    { token: 'content', foreground: '#ceca84' },
    { token: 'mediaType', foreground: '#ceca84' },
    { token: 'response', foreground: '#ceca84' },
    { token: 'server', foreground: '#ceca84' },
    // additional components: bold olive green
    { token: 'components-examples', foreground: '#ceca84', fontStyle: 'bold' },
    { token: 'components-headers', foreground: '#ceca84', fontStyle: 'bold' },
    { token: 'components-links', foreground: '#ceca84', fontStyle: 'bold' },
    { token: 'components-security-schemes', foreground: '#ceca84', fontStyle: 'bold' },
    { token: 'components-callbacks', foreground: '#ceca84', fontStyle: 'bold' },
    { token: 'components-pathItems', foreground: '#ceca84', fontStyle: 'bold' },
    { token: 'components-path-items', foreground: '#ceca84', fontStyle: 'bold' },
    // plain value: green
    { token: 'value', foreground: '#98C379' },
    { token: 'value.string', foreground: '#98C379' },
    { token: 'value.number', foreground: '#98C379' },
    // plain key: pinkish-orange, which appears light orange
    { token: 'key.string', foreground: '#e8b9bb' },
    { token: 'key.number', foreground: '#e8b9bb' },
    // misc token key/value pair: sky blue
    { token: 'api-version', foreground: '#1de2fa' }, // version inside of info object
    { token: 'server-url', foreground: '#1de2fa' },
    // misc token object: sky blue
    { token: 'callback', foreground: '#1de2fa' },
    { token: 'contact', foreground: '#1de2fa' },
    { token: 'discriminator', foreground: '#1de2fa' },
    { token: 'example', foreground: '#1de2fa' }, // only when examples.example
    { token: 'examples', foreground: '#1de2fa' },
    { token: 'header', foreground: '#1de2fa' },
    { token: 'license', foreground: '#1de2fa' },
    { token: 'oAuthFlow', foreground: '#1de2fa' },
    { token: 'oAuthFlows', foreground: '#1de2fa' },
    { token: 'operation-example', foreground: '#1de2fa' },
    { token: 'operation-callbacks', foreground: '#1de2fa' },
    { token: 'securityScheme', foreground: '#1de2fa' },
    { token: 'server-variables', foreground: '#1de2fa' },
    { token: 'messageTrait', foreground: '#1de2fa' },
    { token: 'operationTrait', foreground: '#1de2fa' },
    // tokens exist in apidom-ls, but not working in editor, sky blue
    { token: 'version', foreground: '#1de2fa' },
    { token: 'title', foreground: '#1de2fa' },
    { token: 'specVersion', foreground: '#1de2fa' },
    { token: 'asyncApiVersion', foreground: '#1de2fa' },
    // tokens exist in apidom-ls, but not working in editor, may be orange-ish to match other reference(s)
    { token: 'openapi-reference', foreground: '#ff9966' },
    { token: 'reference', foreground: '#ff9966' },
    { token: 'Asyncapi-reference', foreground: '#ff9966' },
    { token: 'json-reference', foreground: '#ff9966' },
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
};
