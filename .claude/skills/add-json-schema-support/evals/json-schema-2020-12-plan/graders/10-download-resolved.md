---
type: llm
focus: trace
weight: 1
---

PLAN.md enables Download Resolved JSON/YAML for JSON Schema 2020-12 the way OpenAPI has it: the dialect selector is added to DownloadResolvedJSONMenuItem.jsx and DownloadResolvedYAMLMenuItem.jsx in the language-features PR (after the ApiDOM release), the existing dereferenceContent / doDeref path is reused, and no bundle-based download is added.
