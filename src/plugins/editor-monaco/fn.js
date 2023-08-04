import * as monaco from 'monaco-editor';
import { registerMarkerDataProvider as registerMarkerDataProviderGeneric } from 'monaco-marker-data-provider';

export const registerMarkerDataProvider = registerMarkerDataProviderGeneric.bind(
  globalThis,
  monaco
);

/**
 * Handy util for waiting util certain condition is met
 * or maximum waiting time is reached.
 *
 * @param condition
 * @param interval
 * @param maxWait
 * @returns {Promise<unknown>}
 */
export const waitUntil = async (condition, { interval = 100, maxWait = 2500 } = {}) => {
  return new Promise((resolve, reject) => {
    const intervalID = setInterval(async () => {
      if (!(await condition())) {
        return;
      }

      clearInterval(intervalID);
      resolve();
    }, interval);

    setTimeout(() => {
      clearInterval(intervalID);
      reject(new Error('Waited long enough!'));
    }, maxWait);
  });
};

export const makeDeferred = () => {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};
