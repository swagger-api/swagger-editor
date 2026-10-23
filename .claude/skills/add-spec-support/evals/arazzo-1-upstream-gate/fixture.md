# Fixture

Not read by `claude plugin eval`; used when running this case with skill-creator.

Current `main` of swagger-editor, while apidom-ls has no Arazzo support (true for apidom-ls
1.13.3, 2026-10-23; re-check with `npm pack @swagger-api/apidom-ls` and
`grep arazzo package/src/parser-factory.mjs`). No skill file describes Arazzo beyond its row in
`SPEC_FAMILIES`, so this is the generalization case.

Runs are read-only in the fixture: they write `PLAN.md` (and any other output) to the run's
outputs directory, never into the worktree. Read the skill files from the main checkout's
`.claude/skills/` (fixture commits predate the skills); call scripts by their main-checkout path
with `--root <worktree>`. Link the main checkout's `node_modules` into the worktree
(`ln -s <main>/node_modules <worktree>/node_modules`) so upstream checks have packages to read;
note that they then describe today's packages, not the fixture's.
