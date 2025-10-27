import jest from 'jest';
import { execSync } from 'child_process';

import '../config/env.js';

process.on('unhandledRejection', (err) => {
  throw err;
});

const argv = process.argv.slice(2);

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

if (
  !process.env.CI &&
  argv.indexOf('--watchAll') === -1 &&
  argv.indexOf('--watchAll=false') === -1
) {
  const hasSourceControl = isInGitRepository();
  argv.push(hasSourceControl ? '--watch' : '--watchAll');
}

jest.run(argv);
