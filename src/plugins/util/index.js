import { generateRequestId, waitUntil, requestIdleCallback, cancelIdleCallback } from './fn.js';

const UtilPlugin = () => ({
  fn: {
    generateRequestId,
    waitUntil,
    requestIdleCallback,
    cancelIdleCallback,
  },
});

export default UtilPlugin;
