import gitDescribe from 'git-describe';

import paths from '../../paths.js';

export default () => {
  try {
    return gitDescribe.gitDescribeSync(paths.appPath);
  } catch (e) {
    console.error('getDescribeSync error:', e);
    return {
      hash: 'noGit',
      dirty: false,
    };
  }
};
