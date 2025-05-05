import * as monaco from 'monaco-editor';
import { registerMarkerDataProvider as registerMarkerDataProviderGeneric } from 'monaco-marker-data-provider';

export const registerMarkerDataProvider = registerMarkerDataProviderGeneric.bind(
  globalThis,
  monaco
);

export const makeDeferred = () => {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};
