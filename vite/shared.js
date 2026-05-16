import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { createLogger } from 'vite';

export const logger = createLogger();
const loggerWarn = logger.warn.bind(logger);
logger.warn = (msg, options) => {
  if (msg.includes('has been externalized for browser compatibility')) return;
  loggerWarn(msg, options);
};

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));

const gitExec = (cmd) => {
  try {
    return execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return null;
  }
};

export const buildDefines = () => ({
  PACKAGE_VERSION: JSON.stringify(pkg.version),
  GIT_COMMIT: JSON.stringify(gitExec('git rev-parse --short HEAD') ?? 'unknown'),
  GIT_DIRTY: String((gitExec('git status --porcelain') ?? '').length > 0),
  BUILD_TIME: JSON.stringify(new Date().toISOString()),
});

export const sharedOnwarn = (warning, warn) => {
  // Monaco VSCode API uses import.meta.url guarded by globalThis.location?.href — safe to ignore.
  if (warning.code === 'EMPTY_IMPORT_META') return;
  // web-tree-sitter uses direct eval internally — cannot be changed.
  if (warning.code === 'EVAL') return;
  warn(warning);
};
