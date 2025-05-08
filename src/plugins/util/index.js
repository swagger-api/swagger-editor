import {
  generateRequestId,
  waitUntil,
  requestIdleCallback,
  cancelIdleCallback,
  createSafeActionWrapper,
} from './fn.js';

const UtilPlugin = () => ({
  fn: {
    generateRequestId,
    waitUntil,
    requestIdleCallback,
    cancelIdleCallback,
  },
});

export { createSafeActionWrapper };
export default UtilPlugin;
