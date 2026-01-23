import lazyMonacoContribution, {
  isLanguageRegistered,
  apidomDefaults,
} from './language/monaco.contribution.js';

const makeAfterLoad =
  ({ createData = {}, useApiDOMSyntaxHighlighting = false } = {}) =>
  (system) => {
    if (isLanguageRegistered()) return;

    lazyMonacoContribution({ createData, system, useApiDOMSyntaxHighlighting });
    system.editorActions.setLanguage(apidomDefaults.getLanguageId());
  };

export default makeAfterLoad;
