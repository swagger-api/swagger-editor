import { Map } from 'immutable';

import {
  selectIsContentTypeJSONSchema,
  selectIsContentTypeJSONSchema202012,
  selectInferFileNameFromContent,
  selectInferFileNameWithExtensionFromContent,
} from './selectors.js';

const JSON_SCHEMA_2020_12 = 'https://json-schema.org/draft/2020-12/schema';
const state = (contentType) => Map({ contentType });

describe('JSON Schema content type selectors', () => {
  test.each(['json', 'yaml'])('match JSON Schema 2020-12 %s', (format) => {
    const contentType = `application/schema+${format};version=${JSON_SCHEMA_2020_12}`;

    expect(selectIsContentTypeJSONSchema(state(contentType))).toBe(true);
    expect(selectIsContentTypeJSONSchema202012(state(contentType))).toBe(true);
  });

  test('match another dialect as JSON Schema but not as 2020-12', () => {
    const contentType = 'application/schema+json;version=http://json-schema.org/draft-07/schema#';

    expect(selectIsContentTypeJSONSchema(state(contentType))).toBe(true);
    expect(selectIsContentTypeJSONSchema202012(state(contentType))).toBe(false);
  });

  test.each(['application/json', 'text/yaml'])('do not match %s', (contentType) => {
    expect(selectIsContentTypeJSONSchema(state(contentType))).toBe(false);
    expect(selectIsContentTypeJSONSchema202012(state(contentType))).toBe(false);
  });
});

describe('selectInferFileNameFromContent', () => {
  test.each([
    [`application/schema+json;version=${JSON_SCHEMA_2020_12}`, 'schema', 'schema.json'],
    [`application/schema+yaml;version=${JSON_SCHEMA_2020_12}`, 'schema', 'schema.yaml'],
    ['application/vnd.oai.openapi+yaml;version=3.1.1', 'openapi3_1', 'openapi3_1.yaml'],
    ['application/vnd.oai.openapi+json;version=3.2.0', 'openapi3_2', 'openapi3_2.json'],
    ['application/vnd.aai.asyncapi+yaml;version=2.6.0', 'asyncapi2', 'asyncapi2.yaml'],
    ['application/json', 'definition', 'definition.json'],
    ['text/yaml', 'definition', 'definition.yaml'],
  ])('names %s content %s', (contentType, fileName, fileNameWithExtension) => {
    expect(selectInferFileNameFromContent(state(contentType))).toBe(fileName);
    expect(selectInferFileNameWithExtensionFromContent(state(contentType))).toBe(
      fileNameWithExtension
    );
  });
});
