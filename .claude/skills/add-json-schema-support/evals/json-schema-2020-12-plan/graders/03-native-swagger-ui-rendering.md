---
type: llm
focus: trace
weight: 1
---

PLAN.md relies on Swagger UI rendering standalone JSON Schema natively (a swagger-ui-react upgrade), does not render JSONSchema202012 with withJSONSchema202012SystemContext in the editor, and blocks the routing PR until a swagger-ui-react release with that support exists (spec-status.mjs --swagger-ui-plugin).
