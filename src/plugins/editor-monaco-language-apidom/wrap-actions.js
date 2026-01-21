import { createSafeActionWrapper } from '../util/fn.js';

// eslint-disable-next-line import/prefer-default-export
export const detectContentTypeSuccess = createSafeActionWrapper(
  (oriAction, system) =>
    async ({ contentType }) => {
      const {
        monaco,
        apiDOMLanguageId,
        apiDOMMonarchLanguageDefYAML,
        apiDOMMonarchLanguageDefJSON,
        fn,
        editorSelectors,
      } = system;
      const usingEditorMonacoPlugin = typeof monaco !== 'undefined';
      const usingEditorMonacoLanguageApiDOMPlugin = typeof apiDOMLanguageId !== 'undefined';

      if (!usingEditorMonacoPlugin || !usingEditorMonacoLanguageApiDOMPlugin) {
        return;
      }

      await fn.waitUntil(() => !!editorSelectors.selectEditor());

      if (contentType.includes('json')) {
        monaco.languages.setMonarchTokensProvider(apiDOMLanguageId, apiDOMMonarchLanguageDefJSON);
      } else {
        monaco.languages.setMonarchTokensProvider(apiDOMLanguageId, apiDOMMonarchLanguageDefYAML);
      }
    }
);
