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
- **Fixture**: the Load Example document uses it.
- **Scope**: `in` or `out` (with the reason in Notes). Validation, completion and hover come
  from apidom-ls for every keyword and have no column here.

```markdown
## Keyword Map: JSON Schema {dialect}

Sources: {meta-schema URLs}   swagger-ui-react {installed version}   ApiDOM {installed version}

| Vocabulary | Keyword | Renderer | Fixture | Scope | Notes |
|------------|---------|----------|---------|-------|-------|
| core | $schema | JSONSchema202012Keyword$schema | yes | in | detection key |
| core | $ref | JSONSchema202012Keyword$ref | yes | in | shown as text, not resolved |
| applicator | prefixItems | ... | | | |
| validation | minLength | constraint | | in | |
| meta-data | deprecated | ... | | | |
| (compat) | definitions | extension | | out | deprecated in 2020-12 |

Summary: {n} keywords, {n} rendered by a dedicated component, {n} constraint only,
{n} extension catch-all, {n} unrendered.
```

The example rows show the format; derive every row's values from the installed packages, not
from this template.
