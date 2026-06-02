import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');

const isDependencyInstall = packageRoot.split(path.sep).includes('node_modules');
const shouldPatch =
  !isDependencyInstall && path.resolve(process.env.INIT_CWD || process.cwd()) === packageRoot;

if (shouldPatch) {
  execSync('patch-package', { stdio: 'inherit' });
}
