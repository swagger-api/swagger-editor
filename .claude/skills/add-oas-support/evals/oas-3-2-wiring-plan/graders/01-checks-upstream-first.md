---
type: llm
focus: trace
weight: 1
---

Before any code change, PLAN.md checks that the OpenAPI 3.2 ApiDOM parser adapters, apidom-ls 3.2 parsing and swagger-ui-react 3.2 rendering (isOAS32 or equivalent) are available, and says the work stops if one is missing.
