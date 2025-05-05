import lazyMonacoContribution from './monaco.contribution.js';
import { selectClipboardRange } from './selectors.js';

function afterLoad(system) {
  const { monaco, fn } = system;
  const usingEditorMonacoPlugin = typeof monaco !== 'undefined';
  const pluginAPI = this.statePlugins.editorMonacoYAMLPaste;

  if (usingEditorMonacoPlugin) {
    if (pluginAPI.disposables) pluginAPI.disposables.dispose();
    pluginAPI.disposables = lazyMonacoContribution({ system });

    if (typeof fn.createSystemSelector === 'function') {
      pluginAPI.selectors.selectClipboardRange = fn.createSystemSelector(selectClipboardRange);
    }
  }
}

export default afterLoad;
