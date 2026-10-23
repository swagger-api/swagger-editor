# JSON Schema Dialects

All URLs below returned HTTP 200 on 2026-10-23. Re-run `verify-urls.mjs` on this file when you
change it, and never derive a URL from a pattern.

## Identification and Packages

| Dialect | Root `$schema` value | ApiDOM namespace | ApiDOM adapters (full plan) | Swagger UI renderer | ajv (MVP) |
|---------|----------------------|------------------|-----------------------------|---------------------|-----------|
| 2020-12 | `https://json-schema.org/draft/2020-12/schema` | `apidom-ns-json-schema-2020-12` | `apidom-parser-adapter-json-schema-{json,yaml}-2020-12` | `JSONSchema202012` | `ajv/dist/2020` (`Ajv2020`) |
| 2019-09 | `https://json-schema.org/draft/2019-09/schema` | `apidom-ns-json-schema-2019-09` | none yet | `JSONSchema202012` (keywords such as `$recursiveRef` fall into extension keywords) | `ajv/dist/2019` (`Ajv2019`) |
| Draft 7 | `http://json-schema.org/draft-07/schema#` | `apidom-ns-json-schema-draft-7` | none yet | `JSONSchema202012` per the design doc (`definitions`, `dependencies`, `additionalItems` fall into extension keywords) | `ajv` default class |
| Draft 6 | `http://json-schema.org/draft-06/schema#` | `apidom-ns-json-schema-draft-6` | none yet | open decision: legacy `ModelWrapper` (doc) or modern | `ajv` + `ajv/dist/refs/json-schema-draft-06.json` meta-schema |
| Draft 4 | `http://json-schema.org/draft-04/schema#` | `apidom-ns-json-schema-draft-4` | none yet | legacy `ModelWrapper` (`JSONSchema5` plugin) | separate `ajv-draft-04` package |

Notes:

- Draft 4-7 URIs are `http`, end with `#`, and are commonly written without the `#` too. Detect
  both forms; a `https` variant is wrong but common, so decide (and test) whether to accept it.
- 2019-09 and 2020-12 URIs are `https` without `#`.
- The content type the editor uses is `application/schema+json;version=<$schema value>` (or
  `+yaml`); `selectIsContentTypeJSONSchema` matches the `application/schema` prefix for all
  dialects, the dialect selectors match the URI.
- ApiDOM namespace exports (2020-12, checked): `JSONSchemaElement` (element name
  `JSONSchema202012`), `isJSONSchemaElement`, `refract`, `createRefractor`,
  `refractorPluginReplaceEmptyElement`, `JSONSchema202012MediaTypes`. Check other namespaces'
  exports in `node_modules` before using them.

## Keyword Sources

Build the keyword map from the meta-schemas, never from memory:

- 2020-12: `https://json-schema.org/draft/2020-12/schema` lists its vocabularies; the keywords
  are in `https://json-schema.org/draft/2020-12/meta/{core,applicator,unevaluated,validation,meta-data,format-annotation,content}`.
  The dialect meta-schema itself also declares the deprecated `definitions`, `dependencies`,
  `$recursiveAnchor`, `$recursiveRef` for compatibility.
- 2019-09: `https://json-schema.org/draft/2019-09/meta/{core,applicator,validation,meta-data,format,content}`.
- Draft 7, 6, 4: the single meta-schema at the `$schema` URI.

## Crossing Dialect Boundaries (design doc)

`$schema` SHOULD be in the document root, MAY be in the root of embedded schema resources
(subschemas with their own `$id`), and MUST NOT be in non-resource subschemas (2020-12 Core,
section 8.1.1). The doc's examples, to use as test fixtures (its "valid" example treats
`definitions/legacySchema` as a resource although it has no `$id`; check the dialect's spec
before asserting validity in a test):

Valid (embedded resource in another dialect):

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": { "data": { "$ref": "#/definitions/legacySchema" } },
  "definitions": {
    "legacySchema": {
      "$schema": "https://json-schema.org/draft-06/schema#",
      "type": "object",
      "properties": { "oldField": { "type": "string" } }
    }
  }
}
```

Invalid (`$schema` in a non-resource subschema):

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": { "data": { "$ref": "#/definitions/legacySchema" } },
  "definitions": {
    "legacySchema": {
      "type": "object",
      "properties": {
        "oldField": { "$schema": "https://json-schema.org/draft-06/schema#", "type": "string" }
      }
    }
  }
}
```

(The doc writes the Draft 7/6 URIs with `https`; the official ones are `http`. Keep the doc's
text in fixtures that test acceptance of the `https` variant, the official form elsewhere.)

What the editor does with them:

- Detection uses the root `$schema` only. A document whose only `$schema` is nested must not be
  routed to the schema preview; an OpenAPI 3.1+ document with schemas carrying `$schema` stays
  OpenAPI (detection order already guarantees this; keep a test).
- MVP: render and validate with the root dialect; record that embedded resources of another
  dialect are rendered with the root dialect's renderer.
- Full plan: dialect switching per resource is ApiDOM's and Swagger UI's work; the editor routes
  only on the root.
