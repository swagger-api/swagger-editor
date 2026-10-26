---
type: llm
focus: trace
weight: 1
---

PLAN.md routes Draft 7 through the same Swagger UI preview routing as 2020-12 (a Draft 7 selector in EditorPreviewWrapper and the detectContentTypeSuccess wrap-action of editor-preview-swagger-ui), only once Swagger UI renders Draft 7 natively, and creates no preview plugin. It gates that on the swagger-ui release that first renders Draft 7 (spec-status.mjs --swagger-ui-version), not on the JSONSchemaDocument key alone, which a release rendering only 2020-12 already has.
