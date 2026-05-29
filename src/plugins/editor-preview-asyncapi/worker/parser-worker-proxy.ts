/* eslint-disable no-underscore-dangle */

import * as Comlink from 'comlink';
import type { ParserOptions } from '@asyncapi/parser/esm/parser';
import type { Resolver } from '@asyncapi/parser/esm/resolver';

import AsyncAPIParserWorkerConstructor from './asyncapi-parser.worker.ts?worker';
import type { AsyncAPIParserWorker, ResolverMeta } from './asyncapi-parser.worker';

let proxy: Comlink.Remote<AsyncAPIParserWorker> | null = null;
let initPromise: Promise<void> | null = null;
// Held at module scope to prevent the Comlink proxy from being GC'd between parse calls.
let readDispatcher: ((index: number, uri: string) => Promise<string>) | undefined;

const getParserProxy = async (): Promise<Comlink.Remote<AsyncAPIParserWorker>> => {
  if (!proxy) {
    proxy = Comlink.wrap<AsyncAPIParserWorker>(new AsyncAPIParserWorkerConstructor());
  }
  return proxy;
};

export const reinitParserProxy = async (parserOptions?: ParserOptions): Promise<void> => {
  const proxy = await getParserProxy();
  // Serialize concurrent reinits: wait for any in-progress init before starting a new one.
  if (initPromise !== null) await initPromise;

  const resolvers: Resolver[] = parserOptions?.__unstable?.resolver?.resolvers ?? [];

  // Serializable metadata — schema, order, canRead are all plain data.
  const resolverMeta: ResolverMeta[] = resolvers.map((r: Resolver, index: number) => ({
    index,
    schema: r.schema,
    order: r.order,
    canRead:
      typeof r.canRead === 'boolean'
        ? r.canRead
        : (uri, ctx) => !!(r.canRead as (uri: URI, ctx?: unknown) => boolean)(uri, ctx),
  }));

  // A single proxied dispatcher replaces per-resolver Comlink.proxy() wrappers.
  // Passing it as a top-level argument lets Comlink handle the MessagePort transfer;
  // nested Comlink.proxy() values inside a plain object can't be structured-cloned.
  readDispatcher = resolvers.length
    ? Comlink.proxy(async (index: number, uri: string): Promise<string> => {
        return resolvers[index].read({ toString: () => uri, valueOf: () => uri } as URI);
      })
    : undefined;

  // Strip the resolver functions from options so only serializable data is passed.
  const plainOptions: Record<string, unknown> = {
    ...parserOptions,
    __unstable: parserOptions?.__unstable
      ? { ...parserOptions.__unstable, resolver: undefined }
      : undefined,
  };

  initPromise = proxy.init(
    plainOptions,
    resolverMeta.length ? resolverMeta : undefined,
    readDispatcher
  );
  await initPromise;
};

export default getParserProxy;
