import path from 'path';
import fs from 'fs';
import getPublicUrlOrPath from 'react-dev-utils/getPublicUrlOrPath.js';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  resolveApp('package.json').homepage,
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
