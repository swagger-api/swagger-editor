---
type: llm
focus: trace
weight: 1
---

PLAN.md adds JSON and YAML detection branches in src/plugins/editor-content-type/actions.js using detectionRegExp imported from @swagger-api/apidom-parser-adapter-openapi-json-3-2 and @swagger-api/apidom-parser-adapter-openapi-yaml-3-2 (not hand-written regexes).
