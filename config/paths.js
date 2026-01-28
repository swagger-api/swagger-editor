import path from 'path';
import fs from 'fs';
import { readFileSync } from 'fs';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

// Simple replacement for react-dev-utils/getPublicUrlOrPath
const getPublicUrlOrPath = (isDevelopment, homepage, envPublicUrl) => {
  // PUBLIC_URL env var takes precedence
  if (envPublicUrl) {
    return envPublicUrl.endsWith('/') ? envPublicUrl : envPublicUrl + '/';
  }

  // In development, always use root
  if (isDevelopment) {
    return '/';
  }

  // In production, use homepage from package.json if available
  if (homepage) {
    const packageJson = JSON.parse(readFileSync(resolveApp('package.json'), 'utf-8'));
    if (packageJson.homepage) {
      return packageJson.homepage.endsWith('/') ? packageJson.homepage : packageJson.homepage + '/';
    }
  }

  // Default to root
  return '/';
};

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  true, // Check package.json for homepage
  process.env.PUBLIC_URL
);

const distPath = process.env.DIST_PATH || 'dist';
const isBuildingBundle =
  process.env.BUILD_ESM_BUNDLE === 'true' || process.env.BUILD_UMD_BUNDLE === 'true';
const isRunningE2ETests = process.env.E2E_TESTS === 'true';

export const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const paths = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appDist: resolveApp(distPath),
  appPublic: resolveApp(isRunningE2ETests ? 'test/cypress/static' : 'public'),
  appHtml: resolveApp(isRunningE2ETests ? 'test/cypress/static/index.html' : 'public/index.html'),
  appIndexJs: resolveModule(resolveApp, isBuildingBundle ? 'src/App' : 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appNodeModules: resolveApp('node_modules'),
  appWebpackCache: resolveApp('node_modules/.cache'),
  appTsBuildInfoFile: resolveApp('node_modules/.cache/tsconfig.tsbuildinfo'),
  publicUrlOrPath,
};

export default paths;
