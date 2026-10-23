#!/usr/bin/env node
/**
 * Reports which pieces of OpenAPI or standalone JSON Schema support exist in SwaggerEditor and in
 * the upstream packages it consumes (ApiDOM, apidom-ls, swagger-client, swagger-ui-react).
 * Every check reads files in this repository or its node_modules; nothing is fetched.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { parseCli } from './lib/cli.mjs';

// $schema URIs from https://json-schema.org/specification-links; run verify-urls.mjs on them
// when this table changes.
const DIALECTS = {
  '2020-12': {
    uri: 'https://json-schema.org/draft/2020-12/schema',
    namespace: '@swagger-api/apidom-ns-json-schema-2020-12',
    suffix: '202012',
    renderer: 'JSONSchema202012',
  },
  '2019-09': {
    uri: 'https://json-schema.org/draft/2019-09/schema',
    namespace: '@swagger-api/apidom-ns-json-schema-2019-09',
    suffix: '201909',
    renderer: 'JSONSchema202012',
  },
  'draft-07': {
    uri: 'http://json-schema.org/draft-07/schema#',
    namespace: '@swagger-api/apidom-ns-json-schema-draft-7',
    suffix: 'Draft7',
    renderer: 'JSONSchema202012',
  },
  'draft-06': {
    uri: 'http://json-schema.org/draft-06/schema#',
    namespace: '@swagger-api/apidom-ns-json-schema-draft-6',
    suffix: 'Draft6',
    renderer: 'ModelWrapper (legacy JSONSchema5 plugin; Draft 6 renderer is an open decision)',
  },
  'draft-04': {
    uri: 'http://json-schema.org/draft-04/schema#',
    namespace: '@swagger-api/apidom-ns-json-schema-draft-4',
    suffix: 'Draft4',
    renderer: 'ModelWrapper (legacy JSONSchema5 plugin)',
  },
};

const USAGE = `
Usage:
  node spec-status.mjs --oas <major.minor> [--parent <major.minor>]
  node spec-status.mjs --json-schema <2020-12|2019-09|draft-07|draft-06|draft-04>

  --oas          OpenAPI version line, e.g. 3.2
  --parent       previous OpenAPI line (default: minor - 1); enables the unwired-file scan
  --json-schema  JSON Schema dialect for standalone support
  --root         repository root (default: current directory)
  -h, --help     show this help

Statuses:
  OK        present
  MISSING   required and absent
  UPSTREAM  absent in an upstream package: SwaggerEditor work can't start (or, for JSON Schema,
            only the plan named in the line is blocked)
  DECIDE    present for older versions only, or a choice the tracking doc must record
  NOTE      information

Exit codes: 0 no MISSING/UPSTREAM, 1 MISSING, 3 UPSTREAM (takes precedence), 2 usage error.
`;

const { values } = parseCli(USAGE, {
  options: {
    oas: { type: 'string' },
    parent: { type: 'string' },
    'json-schema': { type: 'string' },
    root: { type: 'string', default: '.' },
  },
  validate: ({ values: v }) => {
    if (!v.oas === !v['json-schema']) return 'exactly one of --oas or --json-schema is required';
    if (v.oas && !/^\d+\.\d+$/.test(v.oas)) return '--oas takes <major.minor>, e.g. 3.2';
    if (v.parent && !/^\d+\.\d+$/.test(v.parent)) return '--parent takes <major.minor>';
    if (v['json-schema'] && !DIALECTS[v['json-schema']])
      return `unknown dialect ${v['json-schema']}`;
    if (!existsSync(join(v.root, 'src/plugins/editor-content-type')))
      return `${v.root} is not a SwaggerEditor checkout`;
    return undefined;
  },
});

const ROOT = values.root;
const results = [];
const report = (status, area, message) => results.push({ status, area, message });

const path = (...segments) => join(ROOT, ...segments);
const read = (...segments) => {
  const file = path(...segments);
  return existsSync(file) && statSync(file).isFile() ? readFileSync(file, 'utf8') : '';
};
const pkg = JSON.parse(read('package.json') || '{}');
const nodeModule = (name) => path('node_modules', name);
const installedVersion = (name) => {
  const manifest = read('node_modules', name, 'package.json');
  return manifest ? JSON.parse(manifest).version : null;
};
const walk = (dir, filter) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full, filter);
    return filter(full) ? [full] : [];
  });
};
const sourceFiles = (...dirs) =>
  dirs.flatMap((dir) => walk(path(dir), (file) => /\.(js|jsx|ts|tsx|mjs|scss)$/.test(file)));
const rel = (file) => relative(ROOT, file);
const check = (condition, area, okMessage, missing, status = 'MISSING') =>
  report(condition ? 'OK' : status, area, condition ? okMessage : missing);
const exportedBlock = (source, name) => {
  const start = source.indexOf(`export const ${name}`);
  if (start === -1) return '';
  const next = source.indexOf('\nexport ', start + 1);
  return source.slice(start, next === -1 ? undefined : next);
};

/** `name` is used outside the module's import statements, i.e. registered, not only imported. */
const isRegistered = (source, name) =>
  new RegExp(`\\b${name.replace(/\$/g, '\\$')}\\b`).test(
    source.replace(/import\s[\s\S]*?from\s*['"][^'"]+['"];?/g, '')
  );
/**
 * apidom packages listed in `dependencies` must share one version; npm resolves the apidom-ls
 * dependency tree against them through `overrides`.
 */
const checkApiDOMVersions = () => {
  const versions = Object.entries(pkg.dependencies ?? {})
    .filter(([name]) => name.startsWith('@swagger-api/apidom-'))
    .map(([name, range]) => [name, range.replace(/^[\^~]/, '')]);
  const distinct = [...new Set(versions.map(([, version]) => version))];
  check(
    distinct.length <= 1,
    'deps',
    `all @swagger-api/apidom-* dependencies at ${distinct[0] ?? '(none)'}`,
    `@swagger-api/apidom-* dependencies differ: ${versions.map(([n, v]) => `${n}@${v}`).join(', ')}`,
    'DECIDE'
  );
  const link = pkg.scripts?.['link:apidom'] ?? '';
  const names = link.split(/\s+/).filter((word) => word.startsWith('@swagger-api/'));
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
  if (duplicates.length > 0)
    report('NOTE', 'deps', `link:apidom lists ${[...new Set(duplicates)].join(', ')} twice`);
};

const swaggerUIBundle = () => read('node_modules/swagger-ui-react/swagger-ui-es-bundle-core.js');

/* ------------------------------------------------------------------------------------------ */
/* OpenAPI                                                                                    */
/* ------------------------------------------------------------------------------------------ */

const oasNames = (version) => {
  const [major, minor] = version.split('.');
  return {
    version,
    major,
    dashed: `${major}-${minor}`, // apidom package suffix: openapi-json-3-2
    compact: `${major}${minor}`, // OpenAPI32, isOAS32
    underscored: `${major}_${minor}`, // openapi3_2 (file name inference)
    selector: `selectIsContentTypeOpenAPI${major}${minor}x`,
    adapters: ['json', 'yaml'].map(
      (format) => `@swagger-api/apidom-parser-adapter-openapi-${format}-${major}-${minor}`
    ),
    namespace: `@swagger-api/apidom-ns-openapi-${major}-${minor}`,
  };
};

const checkOpenAPIUpstream = (n) => {
  const area = 'upstream';
  check(
    existsSync(nodeModule(n.namespace)),
    area,
    `${n.namespace}@${installedVersion(n.namespace)} installed`,
    `${n.namespace} not installed: needs an ApiDOM release with the namespace (/add-spec-version in swagger-api/apidom)`,
    'UPSTREAM'
  );
  n.adapters.forEach((adapter) =>
    check(
      existsSync(nodeModule(adapter)),
      area,
      `${adapter}@${installedVersion(adapter)} installed`,
      `${adapter} not installed: needs an ApiDOM release with the parser adapters`,
      'UPSTREAM'
    )
  );
  const parserFactory = read('node_modules/@swagger-api/apidom-ls/src/parser-factory.mjs');
  check(
    parserFactory.includes(`openapi-json-${n.dashed}`),
    area,
    `apidom-ls ${installedVersion('@swagger-api/apidom-ls')} parses OpenAPI ${n.version} (parser-factory)`,
    `installed apidom-ls (${installedVersion('@swagger-api/apidom-ls')}) doesn't parse OpenAPI ${n.version}: no validation, completion or hover in the editor`,
    'UPSTREAM'
  );
  const strategies = [
    'node_modules/swagger-client/es/resolver/strategies',
    'node_modules/swagger-ui-react/node_modules/swagger-client/es/resolver/strategies',
  ];
  check(
    strategies.some((dir) => existsSync(path(dir, `openapi-${n.dashed}-apidom`))),
    area,
    `swagger-client has the openapi-${n.dashed}-apidom resolve strategy`,
    `swagger-client has no openapi-${n.dashed}-apidom resolve strategy: $ref resolution in the preview falls back to the generic strategy`,
    'UPSTREAM'
  );
  check(
    swaggerUIBundle().includes(`isOAS${n.compact}=`),
    area,
    `swagger-ui-react ${installedVersion('swagger-ui-react')} has the isOAS${n.compact} plugin`,
    `swagger-ui-react ${installedVersion('swagger-ui-react')} has no isOAS${n.compact}: the preview would show "Unable to render this definition" (swagger-ui /add-oas-support)`,
    'UPSTREAM'
  );
};

const checkOpenAPIEditor = (n) => {
  const deps = pkg.dependencies ?? {};
  const overrides = pkg.overrides ?? {};
  const link = pkg.scripts?.['link:apidom'] ?? '';
  // Runtime imports (detection uses the adapters) belong in dependencies. Packages used only by
  // the pre-bundled apidom.worker (apidom-ls, namespaces) belong in devDependencies (#5891).
  n.adapters.forEach((name) =>
    check(name in deps, 'deps', `${name} in dependencies`, `${name} not in dependencies`)
  );
  const runtimeImportsNamespace = sourceFiles('src').some((file) =>
    readFileSync(file, 'utf8').includes(`from '${n.namespace}'`)
  );
  if (runtimeImportsNamespace)
    check(
      n.namespace in deps || n.namespace in (pkg.devDependencies ?? {}),
      'deps',
      `${n.namespace} declared (imported in src)`,
      `${n.namespace} is imported in src but not declared in package.json`
    );
  [n.namespace, ...n.adapters].forEach((name) =>
    check(
      new RegExp(`(^|\\s)${name}(\\s|$)`).test(link),
      'deps',
      `${name} in the link:apidom script`,
      `${name} missing from the link:apidom script (npm run link:apidom)`,
      name === n.namespace ? 'DECIDE' : 'MISSING'
    )
  );
  n.adapters.forEach((name) =>
    check(name in overrides, 'deps', `${name} in overrides`, `${name} not in overrides`)
  );
  checkApiDOMVersions();

  const actions = read('src/plugins/editor-content-type/actions.js');
  n.adapters.forEach((adapter) =>
    check(
      actions.includes(`from '${adapter}'`),
      'detection',
      `actions.js imports detectionRegExp from ${adapter}`,
      `actions.js doesn't import detectionRegExp from ${adapter}`
    )
  );
  const selectors = read('src/plugins/editor-content-type/selectors.js');
  check(
    selectors.includes(`export const ${n.selector}`),
    'detection',
    `${n.selector} defined`,
    `${n.selector} not defined in editor-content-type/selectors.js`
  );
  check(
    isRegistered(read('src/plugins/editor-content-type/index.js'), n.selector),
    'detection',
    `${n.selector} registered in editor-content-type/index.js`,
    `${n.selector} not registered in editor-content-type/index.js (every export of selectors.js used by other plugins must be registered)`
  );
  check(
    exportedBlock(selectors, 'selectInferFileNameFromContent').includes(n.selector) &&
      exportedBlock(selectors, 'selectInferFileNameFromContent').includes(
        `'openapi${n.underscored}'`
      ),
    'detection',
    `selectInferFileNameFromContent names OpenAPI ${n.version} files (openapi${n.underscored})`,
    `selectInferFileNameFromContent doesn't map ${n.selector} to 'openapi${n.underscored}': "Save as" proposes the wrong file name`
  );

  const fixtureSelectors = walk(path('src/plugins/editor-content-fixtures/selectors'), (file) =>
    new RegExp(`selectOpenAPI${n.compact}\\d*\\w*\\.js$`).test(file)
  );
  const fixtureIndex = read('src/plugins/editor-content-fixtures/index.js');
  check(
    fixtureSelectors.length > 0,
    'examples',
    `fixture ${fixtureSelectors.map(rel).join(', ')}`,
    `no src/plugins/editor-content-fixtures/selectors/selectOpenAPI${n.compact}*.js fixture`
  );
  fixtureSelectors.forEach((file) => {
    const name = file.split('/').pop().replace(/\.js$/, '');
    check(
      isRegistered(fixtureIndex, name),
      'examples',
      `${name} registered in editor-content-fixtures/index.js`,
      `${name} not registered in editor-content-fixtures/index.js`
    );
    check(
      read(
        'src/plugins/top-bar/components/FileMenu/items/LoadExampleNestedMenu/LoadExampleNestedMenuHandler.jsx'
      ).includes(name),
      'examples',
      `LoadExampleNestedMenuHandler loads ${name}`,
      `LoadExampleNestedMenuHandler doesn't load ${name}`
    );
  });
  const menuDir = 'src/plugins/top-bar/components/FileMenu/items/LoadExampleNestedMenu/items';
  const menuItems = walk(path(menuDir), (file) =>
    new RegExp(`/OpenAPI${n.compact}\\w*MenuItem\\.jsx?$`).test(file)
  );
  check(
    menuItems.length > 0,
    'examples',
    `Load Example menu item ${menuItems.map(rel).join(', ')}`,
    `no ${menuDir}/OpenAPI${n.compact}*MenuItem.jsx`
  );
  const topBarIndex = read('src/plugins/top-bar/index.js');
  const nestedMenu = read(
    'src/plugins/top-bar/components/FileMenu/items/LoadExampleNestedMenu/LoadExampleNestedMenu.jsx'
  );
  menuItems.forEach((file) => {
    const component = file
      .split('/')
      .pop()
      .replace(/\.jsx?$/, '');
    const systemName = `TopBarFileMenuLoadExampleNestedMenu${component}`;
    check(
      topBarIndex.includes(`${systemName}:`),
      'examples',
      `${systemName} registered in top-bar/index.js`,
      `${systemName} not registered in top-bar/index.js`
    );
    check(
      nestedMenu.includes(`'${systemName}'`),
      'examples',
      `LoadExampleNestedMenu renders ${systemName}`,
      `LoadExampleNestedMenu doesn't render ${systemName}`
    );
  });

  // Consumers that switch on concrete OpenAPI 3.x versions. A version they don't name is either
  // deliberately unsupported (record why) or forgotten.
  const versionGated = sourceFiles('src').filter((file) => {
    if (file.includes('/editor-content-type/')) return false;
    return new RegExp(`selectIsContentTypeOpenAPI${n.major}\\d+x\\(`).test(
      readFileSync(file, 'utf8')
    );
  });
  versionGated.forEach((file) => {
    const source = readFileSync(file, 'utf8');
    if (!source.includes(n.selector))
      report(
        'DECIDE',
        'consumers',
        `${rel(file)} switches on OpenAPI versions but not on ${n.selector} (support it, or record why not)`
      );
  });

  const readme = read('README.md');
  check(
    new RegExp(`OpenAPI [^\\n]*\\b${n.version.replace('.', '\\.')}\\b`).test(readme),
    'docs',
    `README lists OpenAPI ${n.version}`,
    `README.md doesn't list OpenAPI ${n.version} in a supported-versions line`
  );
  check(
    new RegExp(`OpenAPI [^\\n]*\\b${n.version.replace('.', '\\.')}\\b`).test(read('CLAUDE.md')),
    'docs',
    `CLAUDE.md lists OpenAPI ${n.version}`,
    `CLAUDE.md doesn't list OpenAPI ${n.version} in the project overview`
  );

  const e2e = walk(path('test/playwright/e2e'), (file) => file.endsWith('.ts'));
  const e2eHits = e2e.filter((file) => readFileSync(file, 'utf8').includes(`OpenAPI ${n.version}`));
  check(
    e2eHits.length > 0,
    'tests',
    `Playwright specs mention "OpenAPI ${n.version}": ${e2eHits.map(rel).join(', ')}`,
    `no Playwright spec mentions "OpenAPI ${n.version}" (Load Example, preview, detection)`
  );
};

/**
 * Semantic token types apidom-ls emits for OpenAPI that neither Monaco theme maps. Unmapped
 * types render in the default foreground; new spec objects usually bring new token types.
 */
const checkThemeTokens = async () => {
  const tokensFile = path('node_modules/@swagger-api/apidom-ls/src/config/openapi/tokens.mjs');
  if (!existsSync(tokensFile)) {
    report('NOTE', 'theme', 'apidom-ls OpenAPI token list not found; compare themes by hand');
    return;
  }
  const { default: tokens } = await import(pathToFileURL(resolve(tokensFile)).href);
  ['se-vs-light.js', 'se-vs-dark.js'].forEach((file) => {
    const theme = read('src/plugins/editor-monaco/themes', file);
    const unmapped = [...new Set(tokens)].filter(
      (token) => !theme.includes(`'${token}'`) && !new RegExp(`\\b${token}:`).test(theme)
    );
    report(
      unmapped.length === 0 ? 'OK' : 'NOTE',
      'theme',
      unmapped.length === 0
        ? `${file} maps every apidom-ls OpenAPI token type`
        : `${file} has no entry for ${unmapped.length} apidom-ls OpenAPI token type(s): ${unmapped.join(', ')} (check the new version's types are among the intended defaults)`
    );
  });
};

/**
 * Files that name the parent version but not the new one. Mirrors find-unwired.sh of the ApiDOM
 * skills: a hit is wired, deliberately parent-only (record it), or a fixture of the parent.
 */
const checkOpenAPIUnwired = (n, p) => {
  const tokens = (names) => [
    `OpenAPI${names.compact}`,
    `openapi-${names.dashed}`,
    `openapi${names.underscored}`,
    `OpenAPI ${names.version}`,
  ];
  const parentTokens = tokens(p);
  const newTokens = tokens(n);
  const files = [
    ...sourceFiles('src', 'test'),
    path('README.md'),
    path('CLAUDE.md'),
    path('package.json'),
  ].filter((file) => existsSync(file));
  files.forEach((file) => {
    if (new RegExp(`selectOpenAPI${p.compact}\\d|OpenAPI${p.compact}\\w*MenuItem`).test(file))
      return; // the parent's own fixture and menu item
    const source = readFileSync(file, 'utf8');
    const mentionsParent = parentTokens.some((token) => source.includes(token));
    const mentionsNew =
      newTokens.some((token) => source.includes(token)) ||
      new RegExp(`OpenAPI [^\\n]*\\b${n.version.replace('.', '\\.')}\\b`).test(source);
    if (mentionsParent && !mentionsNew)
      report(
        'DECIDE',
        'unwired',
        `${rel(file)} mentions OpenAPI ${p.version} but not ${n.version}`
      );
  });
};

/* ------------------------------------------------------------------------------------------ */
/* JSON Schema                                                                                */
/* ------------------------------------------------------------------------------------------ */

const checkJSONSchemaUpstream = (id, d) => {
  const area = 'upstream';
  check(
    existsSync(nodeModule(d.namespace)),
    area,
    `${d.namespace}@${installedVersion(d.namespace)} installed (refract the preview's parse result)`,
    `${d.namespace} not installed (add it as a dependency; the ApiDOM namespace exists for this dialect)`
  );
  if (existsSync(nodeModule(d.namespace)) && !(d.namespace in (pkg.dependencies ?? {})))
    report(
      'DECIDE',
      area,
      `${d.namespace} is only installed transitively: declare it in dependencies once the preview imports it`
    );
  const adapters = ['json', 'yaml'].map(
    (format) =>
      `@swagger-api/apidom-parser-adapter-json-schema-${format}-${id.replace('draft-0', 'draft-')}`
  );
  adapters.forEach((adapter) =>
    check(
      existsSync(nodeModule(adapter)),
      area,
      `${adapter}@${installedVersion(adapter)} installed`,
      `${adapter} not installed (exists in ApiDOM only for 2020-12): blocks the full plan, not the MVP`,
      'NOTE'
    )
  );
  const parserFactory = read('node_modules/@swagger-api/apidom-ls/src/parser-factory.mjs');
  const lsParses = parserFactory.includes('parser-adapter-json-schema-');
  report(
    lsParses ? 'OK' : 'NOTE',
    area,
    lsParses
      ? 'apidom-ls parser-factory wires JSON Schema adapters'
      : `apidom-ls ${installedVersion('@swagger-api/apidom-ls')} parser-factory doesn't wire JSON Schema adapters: standalone schemas get generic JSON/YAML language features only (full plan needs ApiDOM work first)`
  );
  const lsConfig = path('node_modules/@swagger-api/apidom-ls/src/config/json-schema', id);
  const keywordDirs = existsSync(path(lsConfig, 'json-schema'))
    ? readdirSync(path(lsConfig, 'json-schema')).filter((name) =>
        statSync(path(lsConfig, 'json-schema', name)).isDirectory()
      )
    : [];
  report(
    'NOTE',
    area,
    existsSync(lsConfig)
      ? `apidom-ls config for ${id} covers ${keywordDirs.length} keyword(s): ${keywordDirs.join(', ')}`
      : `apidom-ls has no config/json-schema/${id}`
  );
  const bundle = swaggerUIBundle();
  const renderer = d.renderer.split(' ')[0];
  check(
    bundle.includes(renderer),
    area,
    `swagger-ui-react ${installedVersion('swagger-ui-react')} bundles the ${renderer} renderer`,
    `swagger-ui-react ${installedVersion('swagger-ui-react')} has no ${renderer} renderer`,
    'UPSTREAM'
  );
  if (renderer === 'JSONSchema202012')
    check(
      bundle.includes('withJSONSchema202012SystemContext'),
      area,
      'swagger-ui-react exposes withJSONSchema202012SystemContext (standalone rendering HOC)',
      'swagger-ui-react has no withJSONSchema202012SystemContext',
      'UPSTREAM'
    );
  const ajv = pkg.dependencies?.ajv;
  report(
    ajv ? 'OK' : 'DECIDE',
    area,
    ajv
      ? `ajv ${ajv} is a direct dependency (MVP validation)`
      : `ajv is not a direct dependency (installed transitively: ${installedVersion('ajv') ?? 'no'}); the MVP validation plan adds it`
  );
};

const checkJSONSchemaEditor = (id, d) => {
  const selector = `selectIsContentTypeJSONSchema${d.suffix}`;
  const uriPattern = d.uri
    .replace(/^https?:\/\//, '')
    .replace(/[.#]/g, (c) => `\\${c}`)
    .replace(/\//g, '\\\\?\\/');
  const actions = read('src/plugins/editor-content-type/actions.js');
  check(
    new RegExp(uriPattern).test(actions),
    'detection',
    `actions.js detects $schema ${d.uri}`,
    `actions.js has no detection for $schema ${d.uri}`
  );
  const selectors = read('src/plugins/editor-content-type/selectors.js');
  check(
    selectors.includes(`export const ${selector}`),
    'detection',
    `${selector} defined`,
    `${selector} not defined in editor-content-type/selectors.js`
  );
  check(
    isRegistered(read('src/plugins/editor-content-type/index.js'), selector),
    'detection',
    `${selector} registered in editor-content-type/index.js`,
    `${selector} not registered in editor-content-type/index.js`
  );
  check(
    exportedBlock(selectors, 'selectInferFileNameFromContent').includes('JSONSchema'),
    'detection',
    'selectInferFileNameFromContent names JSON Schema files',
    'selectInferFileNameFromContent ignores JSON Schema: "Save as" names the file "definition"',
    'DECIDE'
  );

  const fixture = `selectJSONSchema${d.suffix}`;
  const fixtures = walk(path('src/plugins/editor-content-fixtures/selectors'), (file) =>
    file.includes(`/${fixture}`)
  );
  check(
    fixtures.length > 0 &&
      fixtures.every((file) =>
        isRegistered(
          read('src/plugins/editor-content-fixtures/index.js'),
          file.split('/').pop().replace(/\.js$/, '')
        )
      ),
    'examples',
    `fixture ${fixtures.map(rel).join(', ')} registered`,
    `no registered ${fixture}*.js fixture`
  );
  const component = `JSONSchema${d.suffix}MenuItem`;
  check(
    read('src/plugins/top-bar/index.js').includes(
      `TopBarFileMenuLoadExampleNestedMenu${component}:`
    ),
    'examples',
    `Load Example menu item ${component} registered`,
    `no TopBarFileMenuLoadExampleNestedMenu${component} in top-bar/index.js`
  );

  const plugin = 'src/plugins/editor-preview-json-schema';
  const pluginIndex = read(plugin, 'index.js') || read(plugin, 'index.ts');
  check(
    pluginIndex !== '',
    'preview',
    `${plugin} exists`,
    `${plugin} doesn't exist: JSON Schema content falls through to the Swagger UI preview`
  );
  if (pluginIndex) {
    check(
      /EditorPreview(Pane)?:\s*\w+/.test(pluginIndex),
      'preview',
      'preview plugin wraps EditorPreview',
      "preview plugin doesn't wrap EditorPreview (or EditorPreviewPane)"
    );
    check(
      pluginIndex.includes('detectContentTypeSuccess'),
      'preview',
      'preview plugin wraps detectContentTypeSuccess (parses on detection)',
      "preview plugin doesn't wrap detectContentTypeSuccess"
    );
    const pluginSources = sourceFiles(plugin)
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');
    check(
      pluginSources.includes(d.renderer.split(' ')[0]),
      'preview',
      `preview plugin renders through ${d.renderer.split(' ')[0]}`,
      `preview plugin doesn't use ${d.renderer.split(' ')[0]} (renderer for ${id})`
    );
    report(
      pluginSources.includes('registerMarkerDataProvider') ? 'OK' : 'DECIDE',
      'validation',
      pluginSources.includes('registerMarkerDataProvider')
        ? 'preview plugin registers a marker data provider (validation)'
        : 'no validation markers for JSON Schema: choose ajv (MVP) or apidom-ls (full plan)'
    );
  }
  check(
    read('src/plugins/swagger-ui-adapter/extensions/core/wrap-components/BaseLayout.jsx').includes(
      'selectIsContentTypeJSONSchema'
    ),
    'preview',
    'swagger-ui-adapter BaseLayout short-circuits JSON Schema',
    "swagger-ui-adapter BaseLayout doesn't short-circuit JSON Schema (SwaggerUI-hosted previews)"
  );
  check(
    /EditorPreviewJSONSchema\w*:/.test(read('src/App.tsx')),
    'exports',
    'SwaggerEditor.plugins exports the JSON Schema preview plugin',
    "src/App.tsx doesn't export the JSON Schema preview plugin in SwaggerEditor.plugins"
  );
  check(
    read('src/presets/monaco/index.js').includes('EditorPreviewJSONSchema'),
    'exports',
    'monaco preset includes the JSON Schema preview plugin',
    "src/presets/monaco/index.js doesn't include the JSON Schema preview plugin"
  );
  const readme = read('README.md');
  check(
    readme.includes('editor-preview-json-schema'),
    'docs',
    'README lists editor-preview-json-schema',
    'README.md plugin list has no editor-preview-json-schema'
  );
  check(
    /JSON Schema[^\n]*\d{4}-\d{2}|JSON Schema[^\n]*[Dd]raft/.test(readme),
    'docs',
    'README states the supported JSON Schema dialects',
    "README.md doesn't state which JSON Schema dialects are supported"
  );
  const e2e = walk(path('test/playwright/e2e'), (file) => /json-schema/i.test(file));
  check(
    e2e.length > 0,
    'tests',
    `Playwright spec ${e2e.map(rel).join(', ')}`,
    'no Playwright spec for the JSON Schema preview (plugin.editor-preview-json-schema.spec.ts)'
  );
};

/* ------------------------------------------------------------------------------------------ */

if (values.oas) {
  const n = oasNames(values.oas);
  const [major, minor] = values.oas.split('.').map(Number);
  const parentVersion = values.parent ?? (minor > 0 ? `${major}.${minor - 1}` : null);
  checkOpenAPIUpstream(n);
  checkOpenAPIEditor(n);
  await checkThemeTokens();
  if (parentVersion) checkOpenAPIUnwired(n, oasNames(parentVersion));
  else report('NOTE', 'unwired', 'no parent version: pass --parent for the unwired-file scan');
} else {
  const id = values['json-schema'];
  checkJSONSchemaUpstream(id, DIALECTS[id]);
  checkJSONSchemaEditor(id, DIALECTS[id]);
}

const order = ['UPSTREAM', 'MISSING', 'DECIDE', 'NOTE', 'OK'];
results
  .sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status))
  .forEach(({ status, area, message }) =>
    console.log(`${status.padEnd(8)} ${area.padEnd(10)} ${message}`)
  );
const count = (status) => results.filter((r) => r.status === status).length;
console.log(`\n${order.map((status) => `${count(status)} ${status}`).join(', ')}`);
if (count('UPSTREAM') > 0) process.exit(3);
if (count('MISSING') > 0) process.exit(1);
