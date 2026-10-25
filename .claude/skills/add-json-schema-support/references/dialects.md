# JSON Schema Dialects

All URLs below returned HTTP 200 on 2026-10-23. Re-run `verify-urls.mjs` on this file when you
change it, and never derive a URL from a pattern.

## Identification and Packages

| Dialect | Root `$schema` value | ApiDOM namespace | Swagger UI renderer |
|---------|----------------------|------------------|---------------------|
| 2020-12 | `https://json-schema.org/draft/2020-12/schema` | `apidom-ns-json-schema-2020-12` | `JSONSchema202012` |
| 2019-09 | `https://json-schema.org/draft/2019-09/schema` | `apidom-ns-json-schema-2019-09` | `JSONSchema202012` with 2019-09 overrides (until they exist, `$recursiveRef` falls into extension keywords) |
| Draft 7 | `http://json-schema.org/draft-07/schema#` | `apidom-ns-json-schema-draft-7` | `JSONSchema202012` with Draft 7 overrides (until they exist, `definitions`, `dependencies`, `additionalItems` fall into extension keywords) |
| Draft 6 | `http://json-schema.org/draft-06/schema#` | `apidom-ns-json-schema-draft-6` | `JSONSchema202012` with Draft 6 overrides |
| Draft 4 | `http://json-schema.org/draft-04/schema#` | `apidom-ns-json-schema-draft-4` | `JSONSchema202012` with Draft 4 overrides |

Swagger UI renders every dialect with its 2020-12 renderer and per-dialect overrides (its
decision 3, 2026-10-25); the legacy `JSONSchema5` renderer stays with OpenAPI 2.0 and 3.0.

ApiDOM parser adapters: for 2020-12 they are
`@swagger-api/apidom-parser-adapter-json-schema-json-2020-12` and `-yaml-2020-12`. For other
dialects the skill assumes ApiDOM provides them too; take the exact package names from the
registry (`npm search @swagger-api/apidom-parser-adapter-json-schema`), don't derive them from
the 2020-12 names.

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

## Crossing Dialect Boundaries (design doc, out of scope)

References that cross dialects are out of scope (decision of 2026-10-23) in ApiDOM, Swagger UI
and SwaggerEditor alike. The doc's examples stay here only as fixtures for root-`$schema`
detection.

`$schema` SHOULD be in the document root, MAY be in the root of embedded schema resources
(subschemas with their own `$id`), and MUST NOT be in non-resource subschemas (2020-12 Core,
section 8.1.1). The doc's examples (its "valid" example treats `definitions/legacySchema` as a
resource although it has no `$id`; check the dialect's spec before asserting validity in a
test):

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
  routed to the Swagger UI preview as JSON Schema; an OpenAPI 3.1+ document with schemas
  carrying `$schema` stays OpenAPI (detection order already guarantees this; keep a test).
- Embedded resources of another dialect get no special handling: Swagger UI renders the whole
  document with the root dialect, and neither ApiDOM nor Swagger UI switches dialect per
  embedded resource.
