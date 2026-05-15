import { createLogger } from 'vite';

export const logger = createLogger();
const loggerWarn = logger.warn.bind(logger);
logger.warn = (msg, options) => {
  if (msg.includes('has been externalized for browser compatibility')) return;
  loggerWarn(msg, options);
};

export const sharedOnwarn = (warning, warn) => {
  // Monaco VSCode API uses import.meta.url guarded by globalThis.location?.href — safe to ignore.
  if (warning.code === 'EMPTY_IMPORT_META') return;
  // web-tree-sitter uses direct eval internally — cannot be changed.
  if (warning.code === 'EVAL') return;
  warn(warning);
};
