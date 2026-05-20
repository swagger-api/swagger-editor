import { Parser } from '@asyncapi/parser';
import { OpenAPISchemaParser } from '@asyncapi/openapi-schema-parser';
import { AvroSchemaParser } from '@asyncapi/avro-schema-parser';
import { ProtoBuffSchemaParser } from '@asyncapi/protobuf-schema-parser';
import * as Comlink from 'comlink';

import { Raml10SchemaParser } from '../util/parsers/raml-1-0-parser.js';

const worker = {
  async parse(content: string, options: Record<string, unknown> = {}) {
    const { parserOptions, parseOptions } = options as {
      parserOptions?: Record<string, unknown>;
      parseOptions?: Record<string, unknown>;
    };
    const schemaParsers = [
      OpenAPISchemaParser(),
      AvroSchemaParser(),
      Raml10SchemaParser(),
      ProtoBuffSchemaParser(),
    ];
    const parser = new Parser({ schemaParsers, ...(parserOptions ?? options) });
    const parseResult = await parser.parse(content, parseOptions ?? options);

    return {
      schema: parseResult.document ? parseResult.document.json() : null,
      diagnostics: parseResult.diagnostics ?? [],
    };
  },
};

export type AsyncAPIParserWorker = typeof worker;

Comlink.expose(worker);
