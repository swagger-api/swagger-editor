import lazyMonacoContribution, { isLanguageRegistered } from './language/monaco.contribution.js';

const makeAfterLoad =
  ({ createData = {} } = {}) =>
  () => {
    if (isLanguageRegistered()) return;

    lazyMonacoContribution({ createData });
  };

export default makeAfterLoad;
