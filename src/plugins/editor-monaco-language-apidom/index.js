import makeAfterLoad from './after-load.js';
import { getWorker } from './language/monaco.contribution.js';

const EditorMonacoLanguageApiDOMPlugin = (opts = {}) => {
  const isCalledWithGetSystem = typeof opts.getSystem === 'function';
  const options = isCalledWithGetSystem ? {} : opts;
  const plugin = () => ({
    afterLoad: makeAfterLoad(options),
    fn: {
      getApiDOMWorker: getWorker,
    },
  });

  return isCalledWithGetSystem ? plugin(opts) : plugin;
};

export default EditorMonacoLanguageApiDOMPlugin;
