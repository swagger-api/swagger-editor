import * as Comlink from 'comlink';
import type { ParserOptions } from '@asyncapi/parser/esm/parser';
import type { Resolver } from '@asyncapi/parser/esm/resolver';

import AsyncAPIParserWorkerConstructor from './asyncapi-parser.worker.ts?worker';
import type { AsyncAPIParserWorker } from './asyncapi-parser.worker';

let proxy: Comlink.Remote<AsyncAPIParserWorker> | null = null;

// Wrap resolver functions with Comlink.proxy() so they remain on the main thread
// (preserving access to store, document, config, etc.) but are callable from the worker.
// Plain data properties (schema, order, boolean canRead) are copied as-is.
const wrapResolvers = (parserOptions?: ParserOptions): Record<string, unknown> | undefined => {
  const resolvers = parserOptions?.__unstable?.resolver?.resolvers;
  if (!resolvers?.length) return parserOptions as Record<string, unknown> | undefined;

  return {
    ...parserOptions,
    __unstable: {
      ...parserOptions!.__unstable,
      resolver: {
        ...parserOptions!.__unstable!.resolver,
        resolvers: resolvers.map((r: Resolver) => ({
          schema: r.schema,
          order: r.order,
          canRead:
            typeof r.canRead === 'function'
              ? Comlink.proxy(r.canRead.bind(r))
              : r.canRead,
          read: Comlink.proxy(r.read.bind(r)),
        })),
      },
    },
  };
};

const getParserProxy = async (
  parserOptions?: ParserOptions
): Promise<Comlink.Remote<AsyncAPIParserWorker>> => {
  if (!proxy) {
    proxy = Comlink.wrap<AsyncAPIParserWorker>(new AsyncAPIParserWorkerConstructor());
    await proxy.init(wrapResolvers(parserOptions));
  }
  return proxy;
};

export default getParserProxy;
