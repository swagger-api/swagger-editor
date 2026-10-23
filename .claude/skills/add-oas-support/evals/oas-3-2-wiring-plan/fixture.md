# Fixture

Not read by `claude plugin eval`; used when running this case with skill-creator.

Worktree at `a7e7a960^` (the commit before #5720, OAS 3.2 support):
`git worktree add ../swagger-editor-skills-workspace/wt-pre-oas32 a7e7a960^`.

Runs are read-only in the fixture: they write `PLAN.md` (and any other output) to the run's
outputs directory, never into the worktree. Read the skill files from the main checkout's
`.claude/skills/` (fixture commits predate the skills); call scripts by their main-checkout path
with `--root <worktree>`. Link the main checkout's `node_modules` into the worktree
(`ln -s <main>/node_modules <worktree>/node_modules`) so upstream checks have packages to read;
note that they then describe today's packages, not the fixture's.
