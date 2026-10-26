# Unreleased Upstream

How a step starts before the upstream release it needs: the Swagger UI release that renders the
dialect (PR 2), or the ApiDOM release with the dialect's adapters and language service (PR 1 and
PR 3). The upstream PR must be ready: its exit gate passes and its fresh-context review is clean.
This repository then installs tarballs packed from that PR's branch, opens its own PR as a draft,
and merges only after the upstream release, with the tarballs replaced by it. Without a ready
upstream PR, Step 0's `UPSTREAM` still means stop.

npm can't take these packages from a git URL: swagger-ui-react is generated at release time by
`flavors/swagger-ui-react/release/`, swagger-client doesn't commit `lib/`/`es/`, and ApiDOM is a
private workspace monorepo without committed build output; none has a `prepare` script.

## 1. Pack the Upstream Branch

Keep the repositories, worktrees and tarballs side by side (`~/WebstormProjects/{swagger-editor,
swagger-ui, swagger-client, apidom, upstream-tarballs, ...}`), so relative `file:` paths resolve
from every checkout and worktree, the upstream branches' own included. Set up once:

```bash
out="$(cd .. && pwd)/upstream-tarballs"; mkdir -p "$out"
```

**swagger-ui-react**, from a Swagger UI PR branch:

```bash
git -C ../swagger-ui fetch origin <branch>
git -C ../swagger-ui worktree add ../swagger-ui-pr-<n> FETCH_HEAD
cd ../swagger-ui-pr-<n> && npm ci && npm run build
flavors/swagger-ui-react/release/run.sh   # packs; never set PUBLISH_FLAVOR_REACT=true, it publishes
sha=$(git rev-parse --short HEAD); f=$(ls flavors/swagger-ui-react/dist/swagger-ui-react-*.tgz)
mv "$f" "$out/$(basename "${f%.tgz}")-$sha.tgz"
```

The tarball carries the branch's `package.json` version (the last release) and its dependency
specs: when that branch uses a swagger-client or ApiDOM tarball (its `check-plugin-conventions.mjs`
lists them as `UNRELEASED`), those are already in `../upstream-tarballs/`.

**ApiDOM**, from an ApiDOM PR branch (PR 1's adapters, PR 3's apidom-ls and apidom-reference):

```bash
git -C ../apidom fetch origin <branch>
git -C ../apidom worktree add ../apidom-pr-<n> FETCH_HEAD
cd ../apidom-pr-<n> && npm i && npm run build
sha=$(git rev-parse --short HEAD)
for p in $(git diff --name-only origin/main...HEAD -- packages | cut -d/ -f2 | sort -u); do
  f=$(cd "packages/$p" && npm pack --silent --pack-destination "$out")
  mv "$out/$f" "$out/${f%.tgz}-$sha.tgz"
done
```

Keep the commit in the file name. npm caches a tarball's content by the integrity in the
lockfile, so a rebuilt tarball under the same name installs the old code, with `npm ci` too.

## 2. Wire Them

Wire every upstream tarball, including the ones the swagger-ui-react tarball's `package.json`
names (swagger-client, ApiDOM): they are paths that only resolve in the upstream checkout.

- **The spec goes in the root.** `file:../upstream-tarballs/<file>.tgz` in the field that already
  lists the package (`swagger-ui-react` and `@swagger-api/apidom-*` in `dependencies`,
  `@swagger-api/apidom-ls` in `devDependencies`), else in `devDependencies` (`swagger-client`).
- **A `$` override for each.** The ApiDOM packages already have `"<name>": "$<name>"` in
  `overrides`; add the same for the others. npm refuses a plain override of a direct dependency
  (`EOVERRIDE`), and once a lockfile exists it resolves a relative `file:` path written inside
  `overrides` from `node_modules/` (`ENOENT`), so the paths stay in the root fields.

Then `npm install` and re-run Step 0. While swagger-ui-react is a tarball, pass its version as
`--swagger-ui-version` (`node -p "require('swagger-ui-react/package.json').version"`): the release
that renders the dialect doesn't exist yet, and the `JSONSchemaDocument` key in the bundle is
what proves the rendering. Each tarball is an `UNRELEASED` line (`spec-status.mjs` exits 4 when
nothing else is open). Commit `package.json` and `package-lock.json` on their own:
`build(deps): use unreleased <upstream> from swagger-api/<repo>#<n> (drop before merge)`. CI
can't reach the tarballs, so the PR stays a draft until the release.

## 3. When the Upstream PR Changes

Pack again (the new commit gives new file names), point the specs at the new files,
`npm install`, and re-run the gates.

## 4. Before Merging

Once the upstream release is out, drop the tarball commit, bump to the release (Step 2 for
ApiDOM, Step 3 for swagger-ui-react), `npm install`, and run every gate again, `spec-status.mjs`
with the real release as `--swagger-ui-version`. It must exit 0, with no `UNRELEASED` line. The
release can differ from the branch this PR was built on (review changes land after "ready"), so
the gates run on the release, not on the tarballs.
