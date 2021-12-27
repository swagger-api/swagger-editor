export function getFileName({ options }) {
  if (options.isSwagger2) {
    return 'swagger2';
  }
  if (options.isOAS2) {
    return 'openapi2';
  }
  if (options.isOAS3) {
    return 'openapi3_0';
  }
  if (options.isOAS3_1) {
    return 'openapi3_1';
  }
  if (options.isAsyncApi2) {
    return 'asyncapi2';
  }
  return 'file';
}

export function getDefinitionLanguage({ data }) {
  // expect data typeof String
  if (data.trim()[0] === '{') {
    return 'json';
  }
  return 'yaml';
}

export function getDefinitionVersion({ options }) {
  if (options.isSwagger2) {
    return 'swagger2';
  }
  if (options.isOAS2) {
    return 'openapi2';
  }
  if (options.isOAS3) {
    return 'openapi3_0';
  }
  if (options.isOAS3_1) {
    return 'openapi3_1';
  }
  if (options.isAsyncApi2) {
    return 'asyncapi2';
  }
  return 'unknown';
}

export function hasParserErrors({ errors }) {
  // expect errrors = props.errSelectors.allErrors()
  return errors.filter((err) => err.get('source') === 'parser').size > 0;
}
