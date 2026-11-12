#!/usr/bin/env node
/**
 * Runs SwaggerEditor's real content-type detection (`detectContentType` from
 * src/plugins/editor-content-type/actions.js) over sample documents and compares the detected
 * content type with the expected one. Catches detection branches in the wrong order, regexes
 * that match neighbouring versions, and `$schema` detection that isn't root-only.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { parseCli } from './lib/cli.mjs';

const USAGE = `
Usage:
  node check-detection.mjs [--oas X.Y.Z] [--json-schema <$schema URI>] [--sample <file>=<type>]...

  --oas          add JSON and YAML samples of this OpenAPI version (expected:
                 application/vnd.oai.openapi+{json,yaml};version=X.Y.Z)
  --json-schema  add JSON and YAML root-$schema samples for this dialect URI (expected:
                 application/schema+{json,yaml};version=<URI>)
  --sample       an extra sample file and its expected content type (repeatable)
  --root         repository root (default: current directory)
  -h, --help     show this help

Built-in samples cover OpenAPI 2.0/3.0/3.1/3.2, AsyncAPI 2/3, API Design Systems, JSON Schema
2020-12, documents whose only $schema is nested (must not be detected as JSON Schema), and
OpenAPI and JSON Schema documents with A2A-like "capabilities"/"skills" keys (must keep their
type). For another spec family (/add-spec-support) pass its JSON and YAML examples with
--sample.

Also evaluates every version-specific selector (selectIsContentTypeOpenAPI31x, ...) on the
detected content type: two true selectors of one family are a MISMATCH.

Output: OK or MISMATCH per sample. Exit codes: 0 all OK, 1 any MISMATCH, 2 usage error.
`;

const { values } = parseCli(USAGE, {
  options: {
    oas: { type: 'string' },
    'json-schema': { type: 'string' },
    sample: { type: 'string', multiple: true, default: [] },
    root: { type: 'string', default: '.' },
  },
  validate: ({ values: v }) => {
    if (v.oas && !/^\d+\.\d+\.\d+$/.test(v.oas)) return '--oas takes X.Y.Z, e.g. 3.2.0';
    const bad = v.sample.find((s) => !/^[^=]+=.+$/.test(s));
    if (bad) return `--sample takes <file>=<content type>, got ${bad}`;
    const missing = v.sample.map((s) => s.split('=')[0]).find((file) => !existsSync(file));
    if (missing) return `${missing} not found`;
    if (!existsSync(resolve(v.root, 'src/plugins/editor-content-type/actions.js')))
      return `${v.root} is not a SwaggerEditor checkout`;
    return undefined;
  },
});

const pluginDir = resolve(values.root, 'src/plugins/editor-content-type');
const { detectContentType } = await import(pathToFileURL(`${pluginDir}/actions.js`).href);
const contentTypeFn = await import(pathToFileURL(`${pluginDir}/fn.js`).href);
const selectors = await import(pathToFileURL(`${pluginDir}/selectors.js`).href);
const { Map } = await import('immutable');

// Version-specific selectors per family, e.g. selectIsContentTypeOpenAPI31x. For any content
// type at most one selector of a family may be true.
const FAMILIES = ['OpenAPI', 'AsyncAPI', 'JSONSchema', 'A2A', 'Arazzo'];
const versionSelectors = Object.entries(selectors).filter(([name]) =>
  FAMILIES.some((family) => new RegExp(`^selectIsContentType${family}\\d`).test(name))
);
const overlappingSelectors = (contentType) => {
  const state = Map({ contentType });
  return FAMILIES.map((family) =>
    versionSelectors
      .filter(([name]) => name.startsWith(`selectIsContentType${family}`))
      .filter(([, selector]) => selector(state))
      .map(([name]) => name)
  ).filter((names) => names.length > 1);
};

const oas = (version, format) =>
  format === 'json'
    ? JSON.stringify({ openapi: version, info: { title: 't', version: '1' }, paths: {} })
    : `openapi: ${version}\ninfo:\n  title: t\n  version: '1'\npaths: {}\n`;
const oasType = (version, format) => `application/vnd.oai.openapi+${format};version=${version}`;
const schema202012 = 'https://json-schema.org/draft/2020-12/schema';

const samples = [
  [
    'OpenAPI 2.0 YAML',
    "swagger: '2.0'\ninfo:\n  title: t\n  version: '1'\npaths: {}\n",
    oasType('2.0', 'yaml'),
  ],
  ['OpenAPI 3.0.4 JSON', oas('3.0.4', 'json'), oasType('3.0.4', 'json')],
  ['OpenAPI 3.0.4 YAML', oas('3.0.4', 'yaml'), oasType('3.0.4', 'yaml')],
  ['OpenAPI 3.1.1 JSON', oas('3.1.1', 'json'), oasType('3.1.1', 'json')],
  ['OpenAPI 3.1.1 YAML', oas('3.1.1', 'yaml'), oasType('3.1.1', 'yaml')],
  ['OpenAPI 3.2.0 YAML', oas('3.2.0', 'yaml'), oasType('3.2.0', 'yaml')],
  [
    'OpenAPI 3.1.1 YAML with nested $schema',
    `openapi: 3.1.1\ninfo:\n  title: t\n  version: '1'\ncomponents:\n  schemas:\n    A:\n      $schema: ${schema202012}\n      type: object\n`,
    oasType('3.1.1', 'yaml'),
  ],
  [
    'OpenAPI 3.1.1 JSON with A2A-like keys',
    JSON.stringify({
      openapi: '3.1.1',
      info: { title: 't', version: '1' },
      paths: {},
      'x-agent': { capabilities: {}, skills: [] },
    }),
    oasType('3.1.1', 'json'),
  ],
  [
    'JSON Schema 2020-12 JSON with A2A-like keys',
    JSON.stringify({
      $schema: schema202012,
      type: 'object',
      properties: { capabilities: { type: 'object' } },
      examples: [{ capabilities: {}, skills: [] }],
    }),
    `application/schema+json;version=${schema202012}`,
  ],
  [
    'AsyncAPI 2.6.0 YAML',
    "asyncapi: 2.6.0\ninfo:\n  title: t\n  version: '1'\nchannels: {}\n",
    'application/vnd.aai.asyncapi+yaml;version=2.6.0',
  ],
  [
    'AsyncAPI 3.0.0 YAML',
    "asyncapi: 3.0.0\ninfo:\n  title: t\n  version: '1'\n",
    'application/vnd.aai.asyncapi+yaml;version=3.0.0',
  ],
  [
    'JSON Schema 2020-12 JSON (root $schema)',
    JSON.stringify({ $schema: schema202012, type: 'object' }),
    `application/schema+json;version=${schema202012}`,
  ],
  [
    'JSON Schema 2020-12 YAML (root $schema)',
    `$schema: ${schema202012}\ntype: object\n`,
    `application/schema+yaml;version=${schema202012}`,
  ],
  [
    'JSON with nested $schema only',
    JSON.stringify({ type: 'object', properties: { a: { $schema: schema202012 } } }),
    'application/json',
  ],
  [
    'YAML with nested $schema only',
    `type: object\nproperties:\n  a:\n    $schema: ${schema202012}\n`,
    'text/yaml',
  ],
];
if (values.oas)
  ['json', 'yaml'].forEach((format) =>
    samples.push([
      `OpenAPI ${values.oas} ${format.toUpperCase()}`,
      oas(values.oas, format),
      oasType(values.oas, format),
    ])
  );
if (values['json-schema']) {
  const uri = values['json-schema'];
  samples.push([
    `JSON Schema ${uri} JSON (root $schema)`,
    JSON.stringify({ $schema: uri, type: 'object' }),
    `application/schema+json;version=${uri}`,
  ]);
  samples.push([
    `JSON Schema ${uri} YAML (root $schema)`,
    `$schema: '${uri}'\ntype: object\n`,
    `application/schema+yaml;version=${uri}`,
  ]);
}
values.sample.forEach((spec) => {
  const [file, ...type] = spec.split('=');
  samples.push([file, readFileSync(file, 'utf8'), type.join('=')]);
});

const detect = async (content) => {
  let detected = null;
  const record = (kind) => (payload) => {
    detected = kind === 'success' ? payload.contentType : `FAILURE: ${payload.error.message}`;
  };
  const system = {
    editorActions: {
      detectContentTypeStarted: () => {},
      detectContentTypeSuccess: record('success'),
      detectContentTypeFailure: record('failure'),
    },
    fn: { ...contentTypeFn, generateRequestId: () => 'check-detection' },
  };
  await detectContentType(content)(system);
  return detected;
};

let mismatches = 0;
for (const [name, content, expected] of samples) {
  // eslint-disable-next-line no-await-in-loop
  const actual = await detect(content);
  const overlaps = overlappingSelectors(actual);
  const problems = [
    ...(actual === expected ? [] : [`expected ${expected}`, `detected ${actual}`]),
    ...overlaps.map((names) => `selectors overlap: ${names.join(', ')}`),
  ];
  if (problems.length > 0) mismatches += 1;
  console.log(
    `${(problems.length === 0 ? 'OK' : 'MISMATCH').padEnd(9)} ${name}${problems
      .map((problem) => `\n          ${problem}`)
      .join('')}`
  );
}
console.log(`\n${samples.length - mismatches} OK, ${mismatches} MISMATCH`);
process.exit(mismatches > 0 ? 1 : 0);
