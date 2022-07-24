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
