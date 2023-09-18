import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
});
const { window } = jsdom;

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.performance = window.performance;
global.performance.markResourceTiming = () => {};

window.clearImmediate = clearImmediate;
window.cancelAnimationFrame = window.clearTimeout;
window.requestAnimationFrame = (cb) => window.setTimeout(cb, 0);

