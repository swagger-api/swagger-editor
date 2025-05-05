import makeAfterLoad from './after-load.js';
import {
  getJsonPointerPosition,
  getJsonPointerPositionStarted,
  getJsonPointerPositionSuccess,
  getJsonPointerPositionFailure,
} from './actions/get-json-pointer-position.js';
import { getWorker } from './language/monaco.contribution.js';
import { monarchLanguageDef, languageId } from './language/apidom.js';

const EditorMonacoLanguageApiDOMPlugin = (opts = {}) => {
  const isCalledWithGetSystem = typeof opts.getSystem === 'function';
  const options = isCalledWithGetSystem ? {} : opts;
  const plugin = () => ({
    afterLoad: makeAfterLoad(options),
    rootInjects: {
      apiDOMMonarchLanguageDef: monarchLanguageDef,
      apiDOMLanguageId: languageId,
    },
    fn: {
      getApiDOMWorker: getWorker,
    },
    statePlugins: {
      editor: {
        actions: {
          getJsonPointerPosition,
          getJsonPointerPositionStarted,
          getJsonPointerPositionSuccess,
          getJsonPointerPositionFailure,
        },
      },
    },
  });

  return isCalledWithGetSystem ? plugin(opts) : plugin;
};

export default EditorMonacoLanguageApiDOMPlugin;
