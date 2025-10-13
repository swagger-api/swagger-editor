import { createRequire } from 'module';

// eslint-disable-next-line import/prefer-default-export
export const require = createRequire(import.meta.url);
