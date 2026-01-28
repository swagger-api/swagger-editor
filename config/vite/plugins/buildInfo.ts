import type { Plugin } from 'vite';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface BuildInfo {
  PACKAGE_VERSION: string;
  GIT_COMMIT: string;
  GIT_DIRTY: boolean;
  BUILD_TIME: number;
  BUILD_HASH: string;
}

const getBuildInfo = (): BuildInfo => {
  const packageJsonPath = resolve(__dirname, '../../../package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  let gitCommit = 'unknown';
  let gitDirty = false;

  try {
    // Get git commit hash
    gitCommit = execSync('git rev-parse --short HEAD', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();

    // Check if working directory is dirty
    const status = execSync('git status --porcelain', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    gitDirty = status.trim().length > 0;
  } catch (error) {
    // Git not available or not a git repository
    console.warn('Could not retrieve git information:', error);
  }

  // Generate a hash similar to webpack's __webpack_hash__
  const buildHash = `${gitCommit}-${Date.now().toString(36)}`;

  return {
    PACKAGE_VERSION: packageJson.version,
    GIT_COMMIT: gitCommit,
    GIT_DIRTY: gitDirty,
    BUILD_TIME: Date.now(),
    BUILD_HASH: buildHash,
  };
};

export const createBuildInfoPlugin = (): Plugin => {
  const buildInfo = getBuildInfo();

  return {
    name: 'vite-plugin-build-info',
    config() {
      return {
        define: {
          // Define as global buildInfo (not process.env.buildInfo)
          buildInfo: JSON.stringify(buildInfo),
          // Also define __webpack_hash__ for backwards compatibility
          __webpack_hash__: JSON.stringify(buildInfo.BUILD_HASH),
        },
      };
    },
  };
};
