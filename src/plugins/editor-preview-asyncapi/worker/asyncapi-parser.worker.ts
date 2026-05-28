import { Parser } from '@asyncapi/parser';
import type { ParserOptions } from '@asyncapi/parser/esm/parser';
import { OpenAPISchemaParser } from '@asyncapi/openapi-schema-parser';
import { AvroSchemaParser } from '@asyncapi/avro-schema-parser';
import { ProtoBuffSchemaParser } from '@asyncapi/protobuf-schema-parser';
import * as Comlink from 'comlink';
import Uri from 'urijs';

import { Raml10SchemaParser } from '../util/parsers/raml-1-0-parser.js';

// Uri instances don't survive structured clone. Convert to string before crossing
// the boundary so proxied read/canRead functions receive a plain string instead.
Comlink.transferHandlers.set('URI', {
  canHandle: (obj: unknown): obj is Uri => obj instanceof Uri,
  serialize: (uri: Uri): [string, Transferable[]] => [uri.toString(), []],
  deserialize: (str: string): string => str,
});

export type ResolverMeta = {
  index: number;
  schema: string;
  order: number;
  canRead: boolean | ((uri: URI, ctx: unknown) => boolean);
};

type WorkerParserOptions = Omit<ParserOptions, 'schemaParsers' | '__unstable'> & {
  __unstable?: ParserOptions['__unstable'];
};

let parser: Parser | null = null;

const worker = {
  // resolverMeta and readDispatcher are separate arguments because Comlink only applies
  // proxy transfer handlers to top-level call arguments — functions nested inside a
  // plain object would hit structured clone and throw DataCloneError.
  async init(
    options?: WorkerParserOptions,
    resolverMeta?: ResolverMeta[],
    readDispatcher?: (index: number, uri: string) => Promise<string>
  ) {
    const schemaParsers = [
      OpenAPISchemaParser(),
      AvroSchemaParser(),
      Raml10SchemaParser(),
      ProtoBuffSchemaParser(),
    ];

    const resolvers = resolverMeta?.map((meta) => ({
      schema: meta.schema,
      order: meta.order,
      canRead: meta.canRead,
      read: (uri: Uri) => readDispatcher(meta.index, uri.toString()),
    }));

    const { __unstable, ...rest } = options;

    const restOptions: ParserOptions = {
      ...rest,
      schemaParsers,
      __unstable: resolvers?.length ? { ...__unstable, resolver: { resolvers } } : __unstable,
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
