import { detectContentType } from './actions.js';
import * as fn from './fn.js';

const JSON_SCHEMA_2020_12 = 'https://json-schema.org/draft/2020-12/schema';
const JSON_SCHEMA_JSON = `application/schema+json;version=${JSON_SCHEMA_2020_12}`;
const JSON_SCHEMA_YAML = `application/schema+yaml;version=${JSON_SCHEMA_2020_12}`;

/**
 * Runs the real detection thunk against a minimal system and returns the detected content type.
 */
const detect = async (content) => {
  const editorActions = {
    detectContentTypeStarted: vi.fn(),
    detectContentTypeSuccess: vi.fn(({ contentType }) => contentType),
    detectContentTypeFailure: vi.fn(({ error }) => `failure: ${error.message}`),
  };
  const system = { editorActions, fn: { ...fn, generateRequestId: () => 'request-id' } };

  return detectContentType(content)(system);
};

const toJSON = (document) => JSON.stringify(document, null, 2);

describe('detectContentType: standalone JSON Schema 2020-12', () => {
  describe('root $schema', () => {
    test('detects a JSON document', async () => {
      const content = toJSON({ $schema: JSON_SCHEMA_2020_12, type: 'object' });

      expect(await detect(content)).toBe(JSON_SCHEMA_JSON);
    });

    test.each([
      ['unquoted', `$schema: ${JSON_SCHEMA_2020_12}\ntype: object\n`],
      ['single-quoted', `'$schema': '${JSON_SCHEMA_2020_12}'\ntype: object\n`],
      ['double-quoted', `"$schema": "${JSON_SCHEMA_2020_12}"\ntype: object\n`],
      ['not the first key', `title: Pet\ntype: object\n$schema: ${JSON_SCHEMA_2020_12}\n`],
    ])('detects a YAML document (%s)', async (_, content) => {
      expect(await detect(content)).toBe(JSON_SCHEMA_YAML);
    });

    test('detects a document whose embedded schema resource declares another dialect', async () => {
      const content = toJSON({
        $schema: JSON_SCHEMA_2020_12,
        $defs: {
          legacy: {
            $id: 'https://example.com/legacy',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'string',
          },
        },
      });

      expect(await detect(content)).toBe(JSON_SCHEMA_JSON);
    });

    describe('with an empty fragment', () => {
      const withEmptyFragment = `${JSON_SCHEMA_2020_12}#`;

      test('detects a JSON document', async () => {
        const content = toJSON({ $schema: withEmptyFragment, type: 'object' });

        expect(await detect(content)).toBe(JSON_SCHEMA_JSON);
      });

      test.each([
        ['unquoted', `$schema: ${withEmptyFragment}\ntype: object\n`],
        ['single-quoted', `'$schema': '${withEmptyFragment}'\ntype: object\n`],
        ['double-quoted', `"$schema": "${withEmptyFragment}"\ntype: object\n`],
      ])('detects a YAML document (%s)', async (_, content) => {
        expect(await detect(content)).toBe(JSON_SCHEMA_YAML);
      });
    });

    describe('other identifiers', () => {
      test.each([
        ['a non-empty fragment', `${JSON_SCHEMA_2020_12}#meta`],
        ['a JSON Pointer fragment', `${JSON_SCHEMA_2020_12}#/$defs/a`],
        ['two fragment delimiters', `${JSON_SCHEMA_2020_12}##`],
        ['a trailing slash', `${JSON_SCHEMA_2020_12}/`],
        ['the http scheme', 'http://json-schema.org/draft/2020-12/schema'],
        ['the http scheme and an empty fragment', 'http://json-schema.org/draft/2020-12/schema#'],
      ])('keeps documents whose root $schema has %s plain JSON/YAML', async (_, $schema) => {
        expect(await detect(toJSON({ $schema, type: 'object' }))).toBe('application/json');
        expect(await detect(`$schema: '${$schema}'\ntype: object\n`)).toBe('text/yaml');
        expect(await detect(`$schema: ${$schema}\ntype: object\n`)).toBe('text/yaml');
      });
    });

    test('detects a document with properties named like API description fields', async () => {
      const content = toJSON({
        $schema: JSON_SCHEMA_2020_12,
        type: 'object',
        properties: {
          openapi: { type: 'string' },
          swagger: { type: 'string' },
          asyncapi: { type: 'string' },
          arazzo: { type: 'string' },
        },
      });

      expect(await detect(content)).toBe(JSON_SCHEMA_JSON);
    });
  });

  describe('nested $schema only', () => {
    test('keeps a JSON document plain JSON', async () => {
      const content = toJSON({
        type: 'object',
        properties: { a: { $schema: JSON_SCHEMA_2020_12, type: 'string' } },
      });

      expect(await detect(content)).toBe('application/json');
    });

    test('keeps a YAML document plain YAML', async () => {
      const content = `type: object\nproperties:\n  a:\n    $schema: ${JSON_SCHEMA_2020_12}\n    type: string\n`;

      expect(await detect(content)).toBe('text/yaml');
    });

    test('keeps a JSON document whose root declares another dialect plain JSON', async () => {
      const content = toJSON({
        $schema: 'http://json-schema.org/draft-07/schema#',
        definitions: {
          modern: { $id: 'https://example.com/modern', $schema: JSON_SCHEMA_2020_12 },
        },
      });

      expect(await detect(content)).toBe('application/json');
    });

    test('keeps a YAML document whose root $schema only starts with the 2020-12 URI plain YAML', async () => {
      const content = `$schema: ${JSON_SCHEMA_2020_12}s\ntype: object\n`;

      expect(await detect(content)).toBe('text/yaml');
    });
  });

  describe('OpenAPI documents whose schemas carry $schema', () => {
    const schemas = { Pet: { $schema: JSON_SCHEMA_2020_12, type: 'object' } };

    test.each(['3.1.1', '3.2.0'])('detects OpenAPI %s JSON as OpenAPI', async (version) => {
      const content = toJSON({
        openapi: version,
        info: { title: 'Pets', version: '1.0.0' },
        components: { schemas },
      });

      expect(await detect(content)).toBe(`application/vnd.oai.openapi+json;version=${version}`);
    });

    test.each(['3.1.1', '3.2.0'])('detects OpenAPI %s YAML as OpenAPI', async (version) => {
      const content = `openapi: ${version}\ninfo:\n  title: Pets\n  version: 1.0.0\ncomponents:\n  schemas:\n    Pet:\n      $schema: ${JSON_SCHEMA_2020_12}\n      type: object\n`;

      expect(await detect(content)).toBe(`application/vnd.oai.openapi+yaml;version=${version}`);
    });

    test('detects OpenAPI 3.1 with a root $schema as OpenAPI', async () => {
      const content = toJSON({
        openapi: '3.1.1',
        $schema: JSON_SCHEMA_2020_12,
        info: { title: 'Pets', version: '1.0.0' },
        paths: {},
      });

      expect(await detect(content)).toBe('application/vnd.oai.openapi+json;version=3.1.1');
    });
  });

  describe('API descriptions with a root $schema', () => {
    test.each([
      ['an OpenAPI version no adapter detects', { openapi: '3.3.0' }],
      ['OpenAPI 4.0.0', { openapi: '4.0.0' }],
      ['an unknown Swagger version', { swagger: '3.0' }],
      ['an AsyncAPI version no branch detects', { asyncapi: '4.0.0' }],
      ['Arazzo 1.0.1', { arazzo: '1.0.1', info: { title: 'Flows', version: '1.0.0' } }],
      ['an openapi field of any value', { openapi: null }],
      ['an arazzo field of any value', { arazzo: { version: 1 } }],
    ])('keeps a JSON document with %s plain JSON', async (_, fields) => {
      const content = toJSON({ $schema: JSON_SCHEMA_2020_12, ...fields, type: 'object' });

      expect(await detect(content)).toBe('application/json');
    });

    test.each([
      ['OpenAPI 4.0.0', 'openapi: 4.0.0'],
      ['an unknown Swagger version', "swagger: '3.0'"],
      ['an AsyncAPI version no branch detects', 'asyncapi: 4.0.0'],
      ['Arazzo 1.0.1', 'arazzo: 1.0.1'],
    ])('keeps a YAML document with %s plain YAML', async (_, field) => {
      const content = `${field}\n$schema: ${JSON_SCHEMA_2020_12}\ntype: object\n`;

      expect(await detect(content)).toBe('text/yaml');
    });

    test('keeps API descriptions with an empty-fragment root $schema plain JSON/YAML', async () => {
      const $schema = `${JSON_SCHEMA_2020_12}#`;

      expect(await detect(toJSON({ arazzo: '1.0.1', $schema }))).toBe('application/json');
      expect(await detect(toJSON({ openapi: '4.0.0', $schema }))).toBe('application/json');
      expect(await detect(`openapi: 4.0.0\n$schema: ${$schema}\n`)).toBe('text/yaml');
      expect(await detect(`arazzo: 1.0.1\n'$schema': '${$schema}'\n`)).toBe('text/yaml');
    });

    test('detects AsyncAPI 3.1.0 with a root $schema as AsyncAPI', async () => {
      const content = `asyncapi: 3.1.0\n$schema: ${JSON_SCHEMA_2020_12}\ninfo:\n  title: Events\n  version: 1.0.0\n`;

      expect(await detect(content)).toBe('application/vnd.aai.asyncapi+yaml;version=3.1.0');
    });
  });
});

describe('isJSONSchemaDocumentJSON / isJSONSchemaDocumentYAML', () => {
  test.each([
    ['invalid JSON', '{"$schema": '],
    ['an array root', toJSON([{ $schema: JSON_SCHEMA_2020_12 }])],
    ['a string root', toJSON(JSON_SCHEMA_2020_12)],
  ])('reject %s', (_, content) => {
    expect(fn.isJSONSchemaDocumentJSON(content, JSON_SCHEMA_2020_12)).toBe(false);
    expect(fn.isJSONSchemaDocumentYAML(content, JSON_SCHEMA_2020_12)).toBe(false);
  });

  test('reject a root $schema of another dialect', () => {
    const content = toJSON({ $schema: 'https://json-schema.org/draft/2019-09/schema' });

    expect(fn.isJSONSchemaDocumentJSON(content, JSON_SCHEMA_2020_12)).toBe(false);
    expect(fn.isJSONSchemaDocumentYAML(content, JSON_SCHEMA_2020_12)).toBe(false);
  });

  test('reject a root $schema that is not a string', () => {
    const content = toJSON({ $schema: { $id: JSON_SCHEMA_2020_12 } });

    expect(fn.isJSONSchemaDocumentJSON(content, JSON_SCHEMA_2020_12)).toBe(false);
    expect(fn.isJSONSchemaDocumentYAML(content, JSON_SCHEMA_2020_12)).toBe(false);
  });

  test.each([
    ['the document adds', toJSON({ $schema: `${JSON_SCHEMA_2020_12}#` }), JSON_SCHEMA_2020_12],
    [
      'the dialect URI has',
      toJSON({ $schema: 'http://json-schema.org/draft-07/schema' }),
      'http://json-schema.org/draft-07/schema#',
    ],
  ])('accept an empty fragment %s', (_, content, dialect) => {
    expect(fn.isJSONSchemaDocumentJSON(content, dialect)).toBe(true);
    expect(fn.isJSONSchemaDocumentYAML(content, dialect)).toBe(true);
  });
});
