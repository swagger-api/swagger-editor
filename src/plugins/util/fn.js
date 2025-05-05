import ShortUniqueId from 'short-unique-id';

export const generateRequestId = () => {
  return generateRequestId.uid.randomUUID();
};
generateRequestId.uid = new ShortUniqueId({ length: 10 });

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
waitUntil.MAX_WAIT = 2147483647; // https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value

const requestIdleCallbackPolyfill = (callback) => {
  const start = Date.now();

  return globalThis.setTimeout(() => {
    callback({
      didTimeout: false,
      timeoutRemaining() {
        return Math.max(0, 50 - (Date.now() - start));
      },
    });
  }, 1);
};

const cancelIdleCallbackPolyfill = (handle) => globalThis.clearTimeout(handle);

export const requestIdleCallback = globalThis.requestIdleCallback
  ? (...args) => globalThis.requestIdleCallback(...args)
  : requestIdleCallbackPolyfill;

export const cancelIdleCallback = globalThis.cancelIdleCallback
  ? (...args) => globalThis.cancelIdleCallback(...args)
  : cancelIdleCallbackPolyfill;
