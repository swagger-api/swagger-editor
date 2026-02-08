import getGitDescription from './getGitDescription.js';

export default () => {
  const gitInfo = getGitDescription();
  const raw = {
    PACKAGE_VERSION: process.env.REACT_APP_VERSION,
    GIT_COMMIT: gitInfo.hash,
    GIT_DIRTY: gitInfo.dirty,
    BUILD_TIME: new Date().toUTCString(),
  };
  const stringified = {
    buildInfo: Object.keys(raw).reduce((buildInfo, key) => {
      return { ...buildInfo, [key]: JSON.stringify(raw[key]) };
    }, {}),
  };

  return { raw, stringified };
};
