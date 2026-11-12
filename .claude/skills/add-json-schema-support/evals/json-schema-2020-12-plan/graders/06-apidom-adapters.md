---
type: llm
focus: trace
weight: 1
---

PLAN.md treats the ApiDOM work as done: it bumps the @swagger-api/apidom-* packages (without hard-coding a version as required) and adds @swagger-api/apidom-parser-adapter-json-schema-json-2020-12 and -yaml-2020-12 to dependencies, overrides and link:apidom, using them for detection and/or parsing.