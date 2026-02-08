import makeAfterLoad from './after-load.js';
import {
  getJsonPointerPosition,
  getJsonPointerPositionStarted,
  getJsonPointerPositionSuccess,
  getJsonPointerPositionFailure,
} from './actions/get-json-pointer-position.js';
import { getWorker } from './language/monaco.contribution.js';
import { monarchLanguageDef, apiDOMMonarchLanguageDef, languageId } from './language/apidom.js';
import EditorWrapper from './extensions/editor-monaco/wrap-components/EditorWrapper.jsx';

const defaultOptions = {
  useApiDOMSyntaxHighlighting: false,
};

const EditorMonacoLanguageApiDOMPlugin = (opts = defaultOptions) => {
  const isCalledWithGetSystem = typeof opts.getSystem === 'function';
  const options = isCalledWithGetSystem ? defaultOptions : opts;
  const plugin = () => ({
    afterLoad: makeAfterLoad(options),
    rootInjects: {
      monarchLanguageDef,
      apiDOMMonarchLanguageDef,
      apiDOMLanguageId: languageId,
    },
    wrapComponents: {
      Editor: EditorWrapper(options),
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
