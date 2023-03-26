import lazyMonacoContribution, {
  isLanguageRegistered,
  apidomDefaults,
} from './language/monaco.contribution.js';

const makeAfterLoad =
  ({ createData = {} } = {}) =>
  (system) => {
    if (isLanguageRegistered()) return;

    lazyMonacoContribution({ createData });
    system.editorActions.setLanguage(apidomDefaults.getLanguageId());
  };

export default makeAfterLoad;
