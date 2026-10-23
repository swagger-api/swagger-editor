# Keyword Map Template

Part of `ADD-JSON-SCHEMA-{DIALECT}.md`. One row per keyword of the dialect, grouped by
vocabulary, taken from the meta-schemas listed in `dialects.md`. The map answers, per keyword,
what the user sees in each editor surface, so gaps are chosen rather than discovered.

How to fill the columns:

- **Renderer**: the Swagger UI component that shows the keyword
  (`grep -o "JSONSchema202012Keyword[A-Za-z$]*" node_modules/swagger-ui-react/swagger-ui-es-bundle-core.js | sort -u`),
  `constraint` when it only appears as a constraint chip (the grep also lists
  `KeywordDiscriminator`, `KeywordXml`, `KeywordExternalDocs`, `KeywordExample`: OpenAPI
  keywords added by Swagger UI's OpenAPI plugins, not JSON Schema keywords; don't map them), `extension` when it falls into the
  extension-keywords catch-all, `-` when nothing shows it.
- **Validated**: `ajv` (any keyword of the dialect's meta-schema, MVP), `apidom-ls` (a lint rule
  exists under `node_modules/@swagger-api/apidom-ls/src/config/json-schema/<dialect>/`), or `-`.
- **Completion / Hover**: apidom-ls config has a `completion.ts` / `documentation.ts` entry for
  it; `-` otherwise. Expect `-` throughout for the MVP.
- **Fixture**: the Load Example document uses it.
- **Scope**: `MVP`, `full`, `out` (with the reason in Notes).

```markdown
## Keyword Map: JSON Schema {dialect}

Sources: {meta-schema URLs}   swagger-ui-react {version}   apidom-ls {version}

| Vocabulary | Keyword | Renderer | Validated | Completion | Hover | Fixture | Scope | Notes |
|------------|---------|----------|-----------|------------|-------|---------|-------|-------|
| core | $schema | JSONSchema202012Keyword$schema | ajv | apidom-ls | apidom-ls | yes | MVP | detection key |
| core | $ref | JSONSchema202012Keyword$ref | ajv | apidom-ls | apidom-ls | yes | MVP | shown as text, not resolved |
| applicator | prefixItems | ... | | | | | | |
| validation | minLength | constraint | ajv | - | - | | MVP | |
| meta-data | deprecated | ... | | | | | | |
| (compat) | definitions | extension | ajv | - | - | | out | deprecated in 2020-12 |

Summary: {n} keywords, {n} rendered by a dedicated component, {n} constraint only,
{n} extension catch-all, {n} unrendered; validation {ajv|apidom-ls}; completion/hover {n}.
```

The example rows show the format; derive every row's values from the installed packages, not
from this template.
