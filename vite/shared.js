import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { createLogger } from 'vite';

export const logger = createLogger();
const loggerWarn = logger.warn.bind(logger);
logger.warn = (msg, options) => {
  if (msg.includes('has been externalized for browser compatibility')) return;
  loggerWarn(msg, options);
};

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));

const gitExec = (args) => {
  const result = spawnSync('git', args, { stdio: ['pipe', 'pipe', 'ignore'] });
  if (result.error || result.status !== 0) return null;
  return result.stdout.toString().trim();
};

export const buildDefines = () => ({
  PACKAGE_VERSION: JSON.stringify(pkg.version),
  GIT_COMMIT: JSON.stringify(gitExec(['rev-parse', '--short', 'HEAD']) ?? 'unknown'),
  GIT_DIRTY: String((gitExec(['status', '--porcelain']) ?? '').length > 0),
  BUILD_TIME: JSON.stringify(new Date().toISOString()),
});

export const sharedOnwarn = (warning, warn) => {
  // Monaco VSCode API uses import.meta.url guarded by globalThis.location?.href — safe to ignore.
  if (warning.code === 'EMPTY_IMPORT_META') return;
  // web-tree-sitter uses direct eval internally — cannot be changed.
  if (warning.code === 'EVAL') return;
  warn(warning);
};
