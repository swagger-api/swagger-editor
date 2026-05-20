/* eslint-disable no-underscore-dangle */

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

  const wrappedResolvers = resolvers.map((resolver: Resolver) => ({
    ...resolver,
    canRead:
      typeof resolver.canRead === 'function'
        ? Comlink.proxy(resolver.canRead.bind(resolver))
        : resolver.canRead,
    read: Comlink.proxy(resolver.read.bind(resolver)),
  }));

  return {
    ...parserOptions,
    __unstable: {
      ...parserOptions.__unstable,
      resolver: { ...parserOptions.__unstable.resolver, resolvers: wrappedResolvers },
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
