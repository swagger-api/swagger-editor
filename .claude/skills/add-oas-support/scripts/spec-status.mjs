#!/usr/bin/env node
/**
 * Reports which pieces of OpenAPI, standalone JSON Schema or other spec family (AsyncAPI, A2A,
 * Arazzo) support exist in SwaggerEditor and in the upstream packages it consumes (ApiDOM,
 * apidom-ls, swagger-client, swagger-ui-react).
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
    adapters: [
      '@swagger-api/apidom-parser-adapter-json-schema-json-2020-12',
      '@swagger-api/apidom-parser-adapter-json-schema-yaml-2020-12',
    ],
    suffix: '202012',
  },
  '2019-09': {
    uri: 'https://json-schema.org/draft/2019-09/schema',
    namespace: '@swagger-api/apidom-ns-json-schema-2019-09',
    suffix: '201909',
  },
  'draft-07': {
    uri: 'http://json-schema.org/draft-07/schema#',
    namespace: '@swagger-api/apidom-ns-json-schema-draft-7',
    suffix: 'Draft7',
  },
  'draft-06': {
    uri: 'http://json-schema.org/draft-06/schema#',
    namespace: '@swagger-api/apidom-ns-json-schema-draft-6',
    suffix: 'Draft6',
  },
  'draft-04': {
    uri: 'http://json-schema.org/draft-04/schema#',
    namespace: '@swagger-api/apidom-ns-json-schema-draft-4',
    suffix: 'Draft4',
  },
};

// Spec families other than OpenAPI and JSON Schema (/add-spec-support). Package names follow
// ApiDOM's pattern: apidom-ns-{id}-{major}, apidom-parser-adapter-{id}-{json,yaml}-{major}.
// `prefix` names editor code: selectIsContentType{prefix}, select{prefix}...JSON/YAML fixtures,
// {prefix}...MenuItem. `versionedNames` adds the version digits to fixture and menu-item names
// (AsyncAPI31PetstoreMenuItem); families with one version line leave them out.
const SPEC_FAMILIES = {
  asyncapi: { title: 'AsyncAPI', prefix: 'AsyncAPI', versionedNames: true },
  a2a: { title: 'A2A', prefix: 'A2A', versionedNames: false },
  arazzo: { title: 'Arazzo', prefix: 'Arazzo', versionedNames: true },
};
// Family selectors in editor-content-type; a consumer naming two of them enumerates families.
const FAMILY_SELECTOR =
  /selectIsContentType(OpenAPI|AsyncAPI|APIDesignSystems|JSONSchema|A2A|Arazzo)\(/g;

const USAGE = `
Usage:
  node spec-status.mjs --oas <major.minor> [--parent <major.minor>]
  node spec-status.mjs --json-schema <2020-12|2019-09|draft-07|draft-06|draft-04>
    [--swagger-ui-plugin <key> --swagger-ui-version <major.minor.patch>]
  node spec-status.mjs --spec <${Object.keys(SPEC_FAMILIES).join('|')}> --version <major.minor>

  --oas                OpenAPI version line, e.g. 3.2
  --parent             previous OpenAPI line (default: minor - 1); enables the unwired-file scan
  --json-schema        JSON Schema dialect for standalone support
  --swagger-ui-plugin  with --json-schema: registration key of the Swagger UI plugin that renders
                       standalone JSON Schema natively (JSONSchemaDocument, decision 7 of
                       swagger-ui's /add-json-schema-support)
  --swagger-ui-version with --json-schema: the first swagger-ui release that renders the dialect
                       (from the same skill's hand-off); without both flags the upstream check
                       reports UPSTREAM
  --spec               other spec family (/add-spec-support); add a row to SPEC_FAMILIES for a
                       new one
  --version            version line of --spec, e.g. 3.1 for AsyncAPI, 1.0 for A2A
  --root               repository root (default: current directory)
  -h, --help           show this help

Statuses:
  OK        present
  MISSING   required and absent
  UPSTREAM  absent in an upstream package: SwaggerEditor work can't start. For JSON Schema this
            is Swagger UI's native rendering; apidom-ls parsing the dialect is MISSING in area
            "language" instead, because only the language-features PR needs it
  DECIDE    present for older versions only, or a choice the tracking doc must record
  NOTE      information

Exit codes: 0 no MISSING/UPSTREAM, 1 MISSING, 3 UPSTREAM (takes precedence), 2 usage error.
`;

const { values } = parseCli(USAGE, {
  options: {
    oas: { type: 'string' },
    parent: { type: 'string' },
    'json-schema': { type: 'string' },
    'swagger-ui-plugin': { type: 'string' },
    'swagger-ui-version': { type: 'string' },
    spec: { type: 'string' },
    version: { type: 'string' },
    root: { type: 'string', default: '.' },
  },
  validate: ({ values: v }) => {
    if ([v.oas, v['json-schema'], v.spec].filter(Boolean).length !== 1)
      return 'exactly one of --oas, --json-schema or --spec is required';
    if ((v['swagger-ui-plugin'] || v['swagger-ui-version']) && !v['json-schema'])
      return '--swagger-ui-plugin and --swagger-ui-version go with --json-schema';
    if (v['swagger-ui-version'] && !/^\d+\.\d+\.\d+$/.test(v['swagger-ui-version']))
      return '--swagger-ui-version takes <major.minor.patch>, e.g. 5.31.0';
    if (v.spec && !SPEC_FAMILIES[v.spec])
      return `unknown spec family ${v.spec}: add it to SPEC_FAMILIES in spec-status.mjs`;
    if (v.spec && !/^\d+\.\d+$/.test(v.version ?? ''))
      return '--spec needs --version <major.minor>, e.g. 1.0';
    if (v.version && !v.spec) return '--version goes with --spec (use --oas X.Y for OpenAPI)';
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

/**
 * ApiDOM packages of one spec version. Runtime imports (detection uses the adapters) belong in
 * dependencies and overrides; packages used only by the pre-bundled apidom.worker (apidom-ls,
 * namespaces) belong in devDependencies (#5891). All of them go in the link:apidom script.
 */
const checkApiDOMPackages = (namespace, adapters) => {
  const deps = pkg.dependencies ?? {};
  const overrides = pkg.overrides ?? {};
  const link = pkg.scripts?.['link:apidom'] ?? '';
  adapters.forEach((name) =>
    check(name in deps, 'deps', `${name} in dependencies`, `${name} not in dependencies`)
  );
  const runtimeImportsNamespace = sourceFiles('src').some((file) =>
    readFileSync(file, 'utf8').includes(`from '${namespace}'`)
  );
  if (runtimeImportsNamespace)
    check(
      namespace in deps || namespace in (pkg.devDependencies ?? {}),
      'deps',
      `${namespace} declared (imported in src)`,
      `${namespace} is imported in src but not declared in package.json`
    );
  [namespace, ...adapters].forEach((name) =>
    check(
      new RegExp(`(^|\\s)${name}(\\s|$)`).test(link),
      'deps',
      `${name} in the link:apidom script`,
      `${name} missing from the link:apidom script (npm run link:apidom)`,
      name === namespace ? 'DECIDE' : 'MISSING'
    )
  );
  adapters.forEach((name) =>
    check(name in overrides, 'deps', `${name} in overrides`, `${name} not in overrides`)
  );
  checkApiDOMVersions();
};

/**
 * Example fixture selectors (editor-content-fixtures/selectors/select{name}*.js) and Load Example
 * menu items ({name}*MenuItem.jsx), each registered and wired into the menu. `name` is e.g.
 * OpenAPI32, AsyncAPI31 or A2A.
 */
const checkExamples = (name) => {
  const fixtureSelectors = walk(path('src/plugins/editor-content-fixtures/selectors'), (file) =>
    new RegExp(`/select${name}\\w*\\.js$`).test(file)
  );
  const fixtureIndex = read('src/plugins/editor-content-fixtures/index.js');
  check(
    fixtureSelectors.length > 0,
    'examples',
    `fixture ${fixtureSelectors.map(rel).join(', ')}`,
    `no src/plugins/editor-content-fixtures/selectors/select${name}*.js fixture`
  );
  fixtureSelectors.forEach((file) => {
    const fixture = file.split('/').pop().replace(/\.js$/, '');
    check(
      isRegistered(fixtureIndex, fixture),
      'examples',
      `${fixture} registered in editor-content-fixtures/index.js`,
      `${fixture} not registered in editor-content-fixtures/index.js`
    );
    check(
      read(
        'src/plugins/top-bar/components/FileMenu/items/LoadExampleNestedMenu/LoadExampleNestedMenuHandler.jsx'
      ).includes(fixture),
      'examples',
      `LoadExampleNestedMenuHandler loads ${fixture}`,
      `LoadExampleNestedMenuHandler doesn't load ${fixture}`
    );
  });
  const menuDir = 'src/plugins/top-bar/components/FileMenu/items/LoadExampleNestedMenu/items';
  const menuItems = walk(path(menuDir), (file) =>
    new RegExp(`/${name}\\w*MenuItem\\.jsx?$`).test(file)
  );
  check(
    menuItems.length > 0,
    'examples',
    `Load Example menu item ${menuItems.map(rel).join(', ')}`,
    `no ${menuDir}/${name}*MenuItem.jsx`
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
  checkApiDOMPackages(n.namespace, n.adapters);

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

  checkExamples(`OpenAPI${n.compact}`);

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
const checkThemeTokens = async (config = 'openapi', title = 'OpenAPI') => {
  const tokensFile = path(`node_modules/@swagger-api/apidom-ls/src/config/${config}/tokens.mjs`);
  if (!existsSync(tokensFile)) {
    report(
      'NOTE',
      'theme',
      `apidom-ls has no ${title} token list (src/config/${config}/tokens.mjs): no ${title}-specific semantic highlighting, nothing to map in the themes`
    );
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
        ? `${file} maps every apidom-ls ${title} token type`
        : `${file} has no entry for ${unmapped.length} apidom-ls ${title} token type(s): ${unmapped.join(', ')} (check the new version's types are among the intended defaults)`
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

// ApiDOM's JSON Schema support is taken as given for detection and routing (apidom-ls is checked
// for the language-features PR only, in checkJSONSchemaLanguageService). Swagger UI renders
// standalone JSON Schema natively and the editor only routes content to its Swagger UI preview,
// so the upstream check is that swagger-ui-react ships the plugin doing the rendering. Every
// dialect shares that plugin's registration key, so the key proves the plugin and the release
// proves the dialect (a dialect's `$schema` id can't: the 2020-12 one is the renderer's default).
const atLeast = (version, min) => {
  const [a, b] = [version, min].map((v) => v.split('.', 3).map((n) => parseInt(n, 10)));
  const i = a.findIndex((n, j) => n !== b[j]);
  return i === -1 || a[i] > b[i];
};
const checkJSONSchemaUpstream = (id) => {
  const plugin = values['swagger-ui-plugin'];
  const release = values['swagger-ui-version'];
  const installed = installedVersion('swagger-ui-react');
  const version = installed ?? '(not installed)';
  let missing;
  if (!plugin || !release)
    missing = `native rendering of standalone JSON Schema ${id} in swagger-ui-react ${version} unconfirmed: pass --swagger-ui-plugin <key> --swagger-ui-version <release> (swagger-ui /add-json-schema-support, decision 7)`;
  else if (!swaggerUIBundle().includes(plugin))
    missing = `swagger-ui-react ${version} has no ${plugin}: it doesn't render standalone JSON Schema yet`;
  else if (!installed || !atLeast(installed, release))
    missing = `swagger-ui-react ${version} predates ${release}, the first release that renders JSON Schema ${id}`;
  check(
    !missing,
    'upstream',
    `swagger-ui-react ${version} bundles ${plugin} and is ${release} or later (native JSON Schema ${id} rendering)`,
    missing,
    'UPSTREAM'
  );
};

/**
 * The dialect's ApiDOM parser adapters are runtime imports for detection, so they are declared
 * like the OpenAPI adapters. Names are known for 2020-12 only; for other dialects
 * take them from the registry.
 */
const checkJSONSchemaDependencies = (id, d) => {
  if (!d.adapters) {
    report(
      'NOTE',
      'deps',
      `adapter package names for ${id} aren't recorded here: find them with npm search @swagger-api/apidom-parser-adapter-json-schema and check dependencies, overrides and link:apidom by hand`
    );
    return;
  }
  const deps = pkg.dependencies ?? {};
  const overrides = pkg.overrides ?? {};
  const link = pkg.scripts?.['link:apidom'] ?? '';
  d.adapters.forEach((name) => {
    check(name in deps, 'deps', `${name} in dependencies`, `${name} not in dependencies`);
    check(name in overrides, 'deps', `${name} in overrides`, `${name} not in overrides`);
    check(
      new RegExp(`(^|\\s)${name}(\\s|$)`).test(link),
      'deps',
      `${name} in the link:apidom script`,
      `${name} missing from the link:apidom script (npm run link:apidom)`
    );
  });
  checkApiDOMVersions();
};

/**
 * apidom-ls gives a JSON Schema document validation, completion, hover and semantic tokens only
 * once its parser-factory uses the dialect's adapters. Detection and routing don't need that, so
 * a gap is MISSING in area `language` (it blocks the language-features PR) rather than UPSTREAM.
 */
const checkJSONSchemaLanguageService = (id, d) => {
  const ls = `apidom-ls ${installedVersion('@swagger-api/apidom-ls') ?? '(not installed)'}`;
  if (!d.adapters) {
    report(
      'NOTE',
      'language',
      `adapter package names for ${id} aren't recorded here: before the language-features PR, check that node_modules/@swagger-api/apidom-ls/src/parser-factory.mjs imports them and that apidom-reference has the dialect's dereference strategy`
    );
    return;
  }
  const parserFactory = read('node_modules/@swagger-api/apidom-ls/src/parser-factory.mjs');
  check(
    d.adapters.every((adapter) => parserFactory.includes(adapter)),
    'language',
    `${ls} parses JSON Schema ${id} (parser-factory imports ${d.adapters.join(', ')})`,
    `${ls} doesn't parse JSON Schema ${id}: no validation, completion, hover or semantic tokens until an ApiDOM release wires the adapters into parser-factory (blocks the language-features PR only)`
  );
  // Download Resolved: apidom-ls doDeref -> apidom-reference dereferenceApiDOM, as for OpenAPI
  const reference = `apidom-reference ${installedVersion('@swagger-api/apidom-reference') ?? '(not installed)'}`;
  const strategy = `json-schema-${id}`;
  check(
    existsSync(path('node_modules/@swagger-api/apidom-reference/src/dereference/strategies', strategy)),
    'language',
    `${reference} has the ${strategy} dereference strategy (Download Resolved)`,
    `${reference} has no ${strategy} dereference strategy: Download Resolved can't dereference JSON Schema ${id} (blocks the language-features PR only)`
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

  // Swagger UI renders the schema natively: the editor routes JSON Schema content to its Swagger
  // UI preview (add-json-schema-support/references/preview-routing.md), no preview plugin
  const preview = 'src/plugins/editor-preview-swagger-ui/extensions';
  const routes = new RegExp(`selectIsContentTypeJSONSchema(${d.suffix})?\\(`);
  check(
    routes.test(read(preview, 'editor-preview/wrap-components/EditorPreviewWrapper.jsx')),
    'preview',
    `the Swagger UI preview shows JSON Schema ${id} content (EditorPreviewWrapper)`,
    'EditorPreviewWrapper shows the Swagger UI preview for OpenAPI only: JSON Schema content gets EditorPreviewFallback ("Unable to render editor content")'
  );
  check(
    routes.test(read(preview, 'editor-content-type/wrap-actions.js')),
    'preview',
    `detectContentTypeSuccess passes JSON Schema ${id} content to Swagger UI (updateSpec)`,
    'detectContentTypeSuccess passes only OpenAPI content to Swagger UI (specActions.updateSpec)'
  );
  // Download Resolved works as for OpenAPI once the menu items accept the dialect
  const items = 'src/plugins/top-bar/components/FileMenu/items';
  ['JSON', 'YAML'].forEach((format) =>
    check(
      routes.test(read(items, `DownloadResolved${format}MenuItem.jsx`)),
      'download',
      `Download Resolved ${format} is offered for JSON Schema ${id}`,
      `Download Resolved ${format} is offered for OpenAPI and AsyncAPI only (DownloadResolved${format}MenuItem.jsx; language-features PR)`
    )
  );
  const readme = read('README.md');
  check(
    /JSON Schema[^\n]*\d{4}-\d{2}|JSON Schema[^\n]*[Dd]raft/.test(readme),
    'docs',
    'README states the supported JSON Schema dialects',
    "README.md doesn't state which JSON Schema dialects are supported"
  );
  const e2e = 'test/playwright/e2e/plugin.editor-preview-swagger-ui.spec.ts';
  check(
    /JSON Schema/.test(read(e2e)),
    'tests',
    `${e2e} covers the JSON Schema preview`,
    `${e2e} has no JSON Schema case (Load Example renders the schema in the Swagger UI preview)`
  );
};

/* ------------------------------------------------------------------------------------------ */
/* Other spec families (AsyncAPI, A2A, Arazzo)                                                */
/* ------------------------------------------------------------------------------------------ */

const familyNames = (id, version) => {
  const family = SPEC_FAMILIES[id];
  const [major, minor] = version.split('.');
  const suffix = `-${major}`;
  return {
    ...family,
    id,
    version,
    major,
    namespace: `@swagger-api/apidom-ns-${id}${suffix}`,
    adapters: ['json', 'yaml'].map(
      (format) => `@swagger-api/apidom-parser-adapter-${id}-${format}${suffix}`
    ),
    familySelector: `selectIsContentType${family.prefix}`,
    versionSelector: `selectIsContentType${family.prefix}${major}`,
    exampleName: family.versionedNames ? `${family.prefix}${major}${minor}` : family.prefix,
  };
};

/** The media type prefix the namespace declares, e.g. application/vnd.aai.asyncapi. */
const familyMediaType = (f) => {
  const source =
    read('node_modules', f.namespace, 'src/media-types.mjs') ||
    read('node_modules', f.namespace, 'src/media-types.ts');
  const match = source.match(/'(application\/[^;+']+)[^']*;version=/);
  return match ? match[1] : null;
};

const checkFamilyUpstream = (f) => {
  const area = 'upstream';
  check(
    existsSync(nodeModule(f.namespace)),
    area,
    `${f.namespace}@${installedVersion(f.namespace)} installed`,
    `${f.namespace} not installed: needs an ApiDOM release with the namespace (/add-spec-version in swagger-api/apidom)`,
    'UPSTREAM'
  );
  f.adapters.forEach((adapter) =>
    check(
      existsSync(nodeModule(adapter)),
      area,
      `${adapter}@${installedVersion(adapter)} installed`,
      `${adapter} not installed: needs an ApiDOM release with the parser adapters`,
      'UPSTREAM'
    )
  );
  const ls = installedVersion('@swagger-api/apidom-ls');
  check(
    read('node_modules/@swagger-api/apidom-ls/src/parser-factory.mjs').includes(f.adapters[0]),
    area,
    `apidom-ls ${ls} parses ${f.title} (parser-factory imports ${f.adapters[0]})`,
    `installed apidom-ls (${ls}) doesn't parse ${f.title}: no validation, completion or hover in the editor`,
    'UPSTREAM'
  );
  check(
    existsSync(path('node_modules/@swagger-api/apidom-ls/src/config', f.id)),
    area,
    `apidom-ls ${ls} has src/config/${f.id} (lint rules, completion, documentation)`,
    `installed apidom-ls (${ls}) has no src/config/${f.id}: documents parse but get no ${f.title} lint rules, completion or hover`,
    'UPSTREAM'
  );

  // Adapters whose detectionRegExp has no version group (A2A) identify documents structurally:
  // the editor has to call the adapter's async detect() and choose the version it reports.
  f.adapters.forEach((adapter) => {
    const source = read('node_modules', adapter, 'src/adapter.mjs');
    if (!source) return;
    const regex = source.match(/export const detectionRegExp = (.*);/)?.[1] ?? '';
    if (!/version_(json|yaml)/.test(regex))
      report(
        'DECIDE',
        'detection',
        `${adapter}: detectionRegExp has no version group, so the document doesn't carry the ${f.title} version; call the adapter's detect() after the regex (as for API Design Systems) and record which version the content type names (the adapter's mediaTypes.latest())`
      );
  });
};

const checkFamilyEditor = async (f) => {
  checkApiDOMPackages(f.namespace, f.adapters);

  const actions = read('src/plugins/editor-content-type/actions.js');
  f.adapters.forEach((adapter) =>
    check(
      actions.includes(`from '${adapter}'`),
      'detection',
      `actions.js imports detection from ${adapter}`,
      `actions.js doesn't import detectionRegExp/detect from ${adapter} (hand-written regexes drift from what apidom-ls parses)`
    )
  );
  const mediaType = familyMediaType(f);
  if (mediaType)
    check(
      actions.includes(`${mediaType}+json`) && actions.includes(`${mediaType}+yaml`),
      'detection',
      `actions.js produces ${mediaType}+json and +yaml content types`,
      `actions.js has no ${mediaType}+json / +yaml content type (the media type ${f.namespace} declares)`
    );
  else report('NOTE', 'detection', `no media type found in ${f.namespace}/src/media-types.mjs`);

  const selectors = read('src/plugins/editor-content-type/selectors.js');
  const contentTypeIndex = read('src/plugins/editor-content-type/index.js');
  check(
    selectors.includes(`export const ${f.familySelector} `) ||
      selectors.includes(`export const ${f.familySelector}=`),
    'detection',
    `${f.familySelector} defined`,
    `${f.familySelector} not defined in editor-content-type/selectors.js`
  );
  check(
    isRegistered(contentTypeIndex, f.familySelector),
    'detection',
    `${f.familySelector} registered in editor-content-type/index.js`,
    `${f.familySelector} not registered in editor-content-type/index.js`
  );
  const hasVersionSelector = selectors.includes(`export const ${f.versionSelector}`);
  if (hasVersionSelector)
    check(
      isRegistered(contentTypeIndex, f.versionSelector),
      'detection',
      `${f.versionSelector} registered in editor-content-type/index.js`,
      `${f.versionSelector} not registered in editor-content-type/index.js`
    );
  else
    report(
      'DECIDE',
      'detection',
      `no ${f.versionSelector}: add it when the family has another version line or a consumer depends on the version, or record why the family selector is enough`
    );
  const inferFileName = exportedBlock(selectors, 'selectInferFileNameFromContent');
  check(
    [f.familySelector, f.versionSelector].some((name) =>
      new RegExp(`\\b${name}\\b`).test(inferFileName)
    ),
    'detection',
    `selectInferFileNameFromContent names ${f.title} ${f.major} files`,
    `selectInferFileNameFromContent doesn't name ${f.title} ${f.major} files: "Save as" proposes "definition"`
  );

  checkExamples(f.exampleName);

  // Preview routing: an EditorPreview/EditorPreviewPane wrapper that renders on the family
  // selector, and the swagger-ui-adapter BaseLayout bypass for SwaggerUI-hosted previews.
  const callsFamily = (file) => readFileSync(file, 'utf8').includes(`${f.familySelector}(`);
  const routes = sourceFiles('src/plugins')
    .filter((file) => /\/extensions\/editor-preview\/wrap-components\//.test(file))
    .filter(callsFamily);
  check(
    routes.length > 0,
    'preview',
    `EditorPreview routes ${f.title}: ${routes.map(rel).join(', ')}`,
    `nothing routes ${f.title} in EditorPreview: the fallback says "Content was not recognized as supported language" (add a preview or a no-preview placeholder, references/preview-decision.md)`
  );
  check(
    read('src/plugins/swagger-ui-adapter/extensions/core/wrap-components/BaseLayout.jsx').includes(
      `${f.familySelector}(`
    ),
    'preview',
    `swagger-ui-adapter BaseLayout short-circuits ${f.title}`,
    `swagger-ui-adapter BaseLayout doesn't short-circuit ${f.title}: SwaggerUI-hosted previews show "Unable to render this definition"`
  );
  const pluginDirs = [
    ...new Set(routes.map((file) => rel(file).split('/').slice(0, 3).join('/'))),
  ].filter((dir) => !dir.endsWith('/editor-preview'));
  pluginDirs.forEach((dir) => {
    const plugin = dir.split('/').pop();
    const importPath = `'plugins/${plugin}/index`;
    check(
      read('src/App.tsx').includes(importPath),
      'exports',
      `src/App.tsx exports ${plugin} in SwaggerEditor.plugins`,
      `src/App.tsx doesn't import ${plugin} into SwaggerEditor.plugins`
    );
    ['monaco', 'textarea'].forEach((preset) =>
      check(
        read('src/presets', preset, 'index.js').includes(importPath),
        'exports',
        `${preset} preset includes ${plugin}`,
        `src/presets/${preset}/index.js doesn't include ${plugin}`
      )
    );
    check(
      read('README.md').includes(plugin),
      'docs',
      `README lists ${plugin}`,
      `README.md plugin list has no ${plugin}`
    );
  });

  // Consumers that enumerate spec families (Download Resolved, ...) and don't name this one.
  sourceFiles('src/plugins')
    .filter((file) => !file.includes('/editor-content-type/'))
    .filter((file) => !/\/extensions\/editor-preview\/|\/swagger-ui-adapter\//.test(file))
    .forEach((file) => {
      const families = new Set(
        [...readFileSync(file, 'utf8').matchAll(FAMILY_SELECTOR)].map((m) => m[1])
      );
      if (families.size >= 2 && !families.has(f.prefix))
        report(
          'DECIDE',
          'consumers',
          `${rel(file)} enables ${[...families].join(', ')} but not ${f.title} (support it, or record why not)`
        );
    });
  // Consumers that switch on concrete versions of this family.
  sourceFiles('src/plugins')
    .filter((file) => !file.includes('/editor-content-type/'))
    .forEach((file) => {
      const source = readFileSync(file, 'utf8');
      if (
        new RegExp(`${f.familySelector}\\d+\\(`).test(source) &&
        !source.includes(`${f.versionSelector}(`)
      )
        report(
          'DECIDE',
          'consumers',
          `${rel(file)} switches on ${f.title} versions but not on ${f.versionSelector}`
        );
    });

  await checkThemeTokens(f.id, f.title);

  const docsPattern = new RegExp(`${f.title}[^\\n]*\\b${f.major}(\\.|\\b)`);
  ['README.md', 'CLAUDE.md'].forEach((file) =>
    check(
      docsPattern.test(read(file)),
      'docs',
      `${file} lists ${f.title} ${f.major}.x`,
      `${file} doesn't list ${f.title} ${f.major}.x in its supported-specs line`
    )
  );

  const testLabel = f.versionedNames ? `${f.title} ${f.version}` : f.title;
  const e2eHits = walk(path('test/playwright/e2e'), (file) => file.endsWith('.ts')).filter((file) =>
    readFileSync(file, 'utf8').includes(testLabel)
  );
  check(
    e2eHits.length > 0,
    'tests',
    `Playwright specs mention "${testLabel}": ${e2eHits.map(rel).join(', ')}`,
    `no Playwright spec mentions "${testLabel}" (Load Example, detection, preview or placeholder)`
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
} else if (values.spec) {
  const f = familyNames(values.spec, values.version);
  checkFamilyUpstream(f);
  await checkFamilyEditor(f);
} else {
  const id = values['json-schema'];
  checkJSONSchemaUpstream(id, DIALECTS[id]);
  checkJSONSchemaDependencies(id, DIALECTS[id]);
  checkJSONSchemaLanguageService(id, DIALECTS[id]);
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
