import lazyMonacoContribution from './monaco.contribution.js';

function afterLoad(system) {
  const { monaco, fn } = system;
  const usingEditorMonacoPlugin = typeof monaco !== 'undefined';
  const usingEditorMonacoLanguageApiDOMPlugin = typeof fn.getApiDOMWorker !== 'undefined';
  const pluginAPI = this.statePlugins.editorPreviewAsyncAPI;

  if (usingEditorMonacoPlugin && usingEditorMonacoLanguageApiDOMPlugin) {
    if (pluginAPI.disposables) pluginAPI.disposables.dispose();
    // monaco.* APIs implicitly initialize standalone services when called before explicit initialization
    system.monacoInitializationDeferred().promise.then(() => {
      pluginAPI.disposables = lazyMonacoContribution({ system });
    });
  }
}

export default afterLoad;
