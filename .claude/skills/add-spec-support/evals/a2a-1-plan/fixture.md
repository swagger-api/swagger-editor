# Fixture

Not read by `claude plugin eval`; used when running this case with skill-creator.

Current `main` of swagger-editor (2026-10-23 or later, while the editor has no A2A support).
`references/families/a2a.md` documents the family, so this case measures regressions of the
skill's wiring guidance more than generalization.

Runs are read-only in the fixture: they write `PLAN.md` (and any other output) to the run's
outputs directory, never into the worktree. Read the skill files from the main checkout's
`.claude/skills/` (fixture commits predate the skills); call scripts by their main-checkout path
with `--root <worktree>`. Link the main checkout's `node_modules` into the worktree
(`ln -s <main>/node_modules <worktree>/node_modules`) so upstream checks have packages to read;
note that they then describe today's packages, not the fixture's.
