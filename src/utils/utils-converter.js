export function getFileName({ options }) {
  if (options.isSwagger2) {
    return 'swagger';
  }
  if (options.isOAS3) {
    return 'openapi';
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
    return 'swagger';
  }
  if (options.isOAS3) {
    return 'openapi';
  }
  return 'unknown';
}

export function hasParserErrors({ errors }) {
  // expect errrors = props.errSelectors.allErrors()
  return errors.filter((err) => err.get('source') === 'parser').size > 0;
}
