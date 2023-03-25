import makeAfterLoad from './after-load.js';

const EditorMonacoLanguageApiDOMPlugin = (opts = {}) => {
  const isCalledWithGetSystem = typeof opts.getSystem === 'function';
  const options = isCalledWithGetSystem ? {} : opts;
  const plugin = () => ({
    afterLoad: makeAfterLoad(options),
  });

  return isCalledWithGetSystem ? plugin(opts) : plugin;
};

export default EditorMonacoLanguageApiDOMPlugin;
