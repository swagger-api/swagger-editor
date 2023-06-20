import lazyMonacoContribution from './monaco.contribution.js';

const afterLoad = (system) => {
  const { monaco, fn } = system;
  const hasEditorMonacoPlugin = typeof monaco !== 'undefined';
  const hasEditorMonacoLanguageApiDOMPlugin = typeof fn.getApiDOMWorker !== 'undefined';

  if (hasEditorMonacoPlugin && hasEditorMonacoLanguageApiDOMPlugin) {
    lazyMonacoContribution({ system });
  }
};

export default afterLoad;
