# Fixture

Not read by `claude plugin eval`; used when running this case with skill-creator.

Branch with seven planted defects on top of the OAS 3.2 commit:

```bash
git worktree add ../swagger-editor-skills-workspace/wt-oas32-planted a7e7a960
cd ../swagger-editor-skills-workspace/wt-oas32-planted
git switch -c eval/oas32-planted-defects
git apply <main>/.claude/skills/review-spec-support/evals/planted-defects.patch
git -c user.name=eval -c user.email=eval@example.com commit -qam "test: plant review defects in OAS 3.2 support"
ln -s <main>/node_modules node_modules
```

The patch is outside the case folder (`evals/planted-defects.patch`); copy it before switching
branches if you run from a branch without the skills. The reviewer compares against `a7e7a960`
(not `main`): pass `--root` to the scripts and diff `a7e7a960..HEAD`.

Defects 1, 2, 3, 4, 5 and 7 are caught by `spec-status.mjs` / `check-detection.mjs`; defect 6
needs the reviewer to read the fixture.
