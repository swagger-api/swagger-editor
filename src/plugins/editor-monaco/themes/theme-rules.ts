type ThemeColors = {
  keyword: string;
  value: string;
};

const themeRules = (colors: ThemeColors) => {
  const plainKey = colors.keyword;
  const plainValue = colors.value;

  return [
    // tokens for OpenAPI 2.0 Object: bold
    { token: 'swagger-host', foreground: colors.keyword },
    { token: 'swagger-base-path', foreground: colors.keyword },
    { token: 'swagger-schemes', foreground: colors.keyword },
    { token: 'swagger-consumes', foreground: colors.keyword },
    { token: 'swagger-produces', foreground: colors.keyword },
    { token: 'swagger-security', foreground: colors.keyword },
    { token: 'swagger-tags', foreground: colors.keyword },
    { token: 'definitions', foreground: colors.keyword },
    { token: 'parameterDefinitions', foreground: colors.keyword },
    { token: 'responseDefinitions', foreground: colors.keyword },
    { token: 'securityDefinitions', foreground: colors.keyword },
    { token: 'externalDocumentation', foreground: colors.keyword },
    { token: 'operation-consumes', foreground: colors.keyword },
    { token: 'operation-produces', foreground: colors.keyword },
    // top-level tokens for OpenAPI 3.x.y Object: bold
    { token: 'openapi', foreground: colors.keyword },
    { token: 'info', foreground: colors.keyword },
    { token: 'jsonSchemaDialect', foreground: colors.keyword },
    { token: 'servers', foreground: colors.keyword },
    { token: 'paths', foreground: colors.keyword },
    { token: 'webhooks', foreground: colors.keyword },
    { token: 'components', foreground: colors.keyword },
    { token: 'security', foreground: colors.keyword },
    { token: 'tags', foreground: colors.keyword },
    { token: 'tag', foreground: colors.keyword },
    // additional top-level tokens for AsyncAPI Object: bold
    { token: 'spec-version', foreground: colors.keyword }, // e.g. asyncapi
    { token: 'channels', foreground: colors.keyword },
    { token: 'components-messages', foreground: colors.keyword },
    { token: 'messages', foreground: colors.keyword },
    { token: 'message', foreground: colors.keyword },
    { token: 'operation', foreground: colors.keyword },
    { token: 'operation.httpMethod-GET', foreground: colors.keyword },
    { token: 'operation.httpMethod-POST', foreground: colors.keyword },
    { token: 'parameters', foreground: colors.keyword },
    { token: 'parameter', foreground: colors.keyword },
    { token: 'components-parameters', foreground: colors.keyword },
    { token: 'reference-element', foreground: colors.keyword },
    { token: 'reference-value', foreground: colors.value },
    { token: 'components-schemas', foreground: colors.keyword },
    { token: 'schema', foreground: colors.keyword },
    { token: 'pathItem', foreground: colors.keyword },
    { token: 'channelItem', foreground: colors.keyword },
    { token: 'requestBody', foreground: colors.keyword },
    { token: 'responses', foreground: colors.keyword },
    { token: 'components-responses', foreground: colors.keyword },
    { token: 'components-request-bodies', foreground: colors.keyword },
    { token: 'content', foreground: colors.keyword },
    { token: 'mediaType', foreground: colors.keyword },
    { token: 'response', foreground: colors.keyword },
    { token: 'server', foreground: colors.keyword },
    // additional components
    { token: 'components-examples', foreground: colors.keyword },
    { token: 'components-headers', foreground: colors.keyword },
    { token: 'components-links', foreground: colors.keyword },
    { token: 'components-security-schemes', foreground: colors.keyword },
    { token: 'components-callbacks', foreground: colors.keyword },
    { token: 'components-pathItems', foreground: colors.keyword },
    { token: 'components-path-items', foreground: colors.keyword },
    // plain value
    { token: 'value', foreground: plainValue },
    { token: 'value.string', foreground: plainValue },
    { token: 'value.number', foreground: plainValue },
    // plain key
    { token: 'key.string', foreground: plainKey },
    { token: 'key.number', foreground: plainKey },
    // token key/value pair
    { token: 'api-version', foreground: colors.keyword }, // version inside of info object
    { token: 'server-url', foreground: colors.keyword },
    // token object
    { token: 'callback', foreground: colors.keyword },
    { token: 'contact', foreground: colors.keyword },
    { token: 'discriminator', foreground: colors.keyword },
    { token: 'example', foreground: colors.keyword }, // only when examples.example
    { token: 'examples', foreground: colors.keyword },
    { token: 'header', foreground: colors.keyword },
    { token: 'license', foreground: colors.keyword },
    { token: 'oAuthFlow', foreground: colors.keyword },
    { token: 'oAuthFlows', foreground: colors.keyword },
    { token: 'operation-example', foreground: colors.keyword },
    { token: 'operation-callbacks', foreground: colors.keyword },
    { token: 'securityScheme', foreground: colors.keyword },
    { token: 'server-variables', foreground: colors.keyword },
    { token: 'messageTrait', foreground: colors.keyword },
    { token: 'operationTrait', foreground: colors.keyword },
    // tokens exist in apidom-ls, but not working in editor
    { token: 'version', foreground: colors.keyword },
    { token: 'title', foreground: colors.keyword },
    { token: 'specVersion', foreground: colors.keyword },
    { token: 'asyncApiVersion', foreground: colors.keyword },
    { token: 'openapi-reference', foreground: colors.keyword },
    { token: 'reference', foreground: colors.keyword },
    { token: 'asyncapi-reference', foreground: colors.keyword },
    { token: 'json-reference', foreground: colors.keyword },
    { token: 'xml', foreground: colors.keyword },
    { token: '$ref', foreground: colors.keyword },
    { token: 'keyword', foreground: colors.keyword }, // orange and bold for keywords
    { token: '', foreground: colors.value },
    // { token: 'invalid', foreground: '#FF0000' },
    // { token: 'invalid.apidom', foreground: '#FF0000' },
    // { token: 'identifier', foreground: '#FF0000' },
  ];
};

export default themeRules;
