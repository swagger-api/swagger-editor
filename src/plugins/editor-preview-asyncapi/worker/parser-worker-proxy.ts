import * as Comlink from 'comlink';

import AsyncAPIParserWorkerConstructor from './asyncapi-parser.worker.ts?worker';
import type { AsyncAPIParserWorker } from './asyncapi-parser.worker';

let proxy: Comlink.Remote<AsyncAPIParserWorker> | null = null;

const getParserProxy = (): Comlink.Remote<AsyncAPIParserWorker> => {
  if (!proxy) {
    proxy = Comlink.wrap<AsyncAPIParserWorker>(new AsyncAPIParserWorkerConstructor());
  }
  return proxy;
};

export default getParserProxy;
