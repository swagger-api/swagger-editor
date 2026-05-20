/* eslint-disable no-underscore-dangle */

import { Parser } from '@asyncapi/parser';
import type { ParserOptions } from '@asyncapi/parser/esm/parser';
import { OpenAPISchemaParser } from '@asyncapi/openapi-schema-parser';
import { AvroSchemaParser } from '@asyncapi/avro-schema-parser';
import { ProtoBuffSchemaParser } from '@asyncapi/protobuf-schema-parser';
import * as Comlink from 'comlink';
import Uri from 'urijs';

import { Raml10SchemaParser } from '../util/parsers/raml-1-0-parser.js';

// Uri class instances don't survive structured clone. Register a transfer handler so
// Comlink automatically converts Uri → string when the parser calls a proxied resolver
// function with a Uri argument. The main thread read/canRead functions receive the string
// and their uri.toString() calls work as expected.
Comlink.transferHandlers.set('URI', {
  canHandle: (obj: unknown): obj is Uri => obj instanceof Uri,
  serialize: (uri: Uri): [string, Transferable[]] => [uri.toString(), []],
  deserialize: (str: string): string => str,
});

type WorkerParserOptions = Omit<ParserOptions, 'schemaParsers' | '__unstable'> & {
  __unstable?: ParserOptions['__unstable'];
};

let parser: Parser | null = null;

const worker = {
  async init(options: WorkerParserOptions = {}) {
    const schemaParsers = [
      OpenAPISchemaParser(),
      AvroSchemaParser(),
      Raml10SchemaParser(),
      ProtoBuffSchemaParser(),
    ];

    const { __unstable, ...rest } = options;

    const restOptions: ParserOptions = {
      ...rest,
      schemaParsers,
      __unstable,
    };

    parser = new Parser(restOptions);
  },

  async parse(content: string, parseOptions: Record<string, unknown> = {}) {
    if (!parser) {
      await worker.init();
    }
    const parseResult = await parser.parse(content, parseOptions);

    return {
      schema: parseResult.document ? parseResult.document.json() : null,
      diagnostics: parseResult.diagnostics ?? [],
    };
  },
};

export type AsyncAPIParserWorker = typeof worker;

Comlink.expose(worker);
