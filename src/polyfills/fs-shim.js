/**
 * Minimal fs polyfill for browser environment
 * @asyncapi/parser imports fs.readFile but it's only used in Node.js contexts
 * This shim allows the module to be bundled while preventing runtime usage
 */

const notSupported = (method) => {
  throw new Error(`fs.${method} is not supported in browser environment`);
};

export const readFile = () => notSupported('readFile');
export const writeFile = () => notSupported('writeFile');
export const readFileSync = () => notSupported('readFileSync');
export const writeFileSync = () => notSupported('writeFileSync');
export const promises = {
  readFile: () => notSupported('promises.readFile'),
  writeFile: () => notSupported('promises.writeFile'),
};

export default {
  readFile,
  writeFile,
  readFileSync,
  writeFileSync,
  promises,
};
