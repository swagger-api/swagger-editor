#!/usr/bin/env bash
# Smoke test for the skill scripts. Run from the repository root after changing a script:
#   bash .claude/skills/add-oas-support/scripts/test/smoke.sh
# Checks exit codes only: usage errors exit 2, real runs exit 0, 1 or 3 (never crash).
set -u
DIR="$(cd "$(dirname "$0")/.." && pwd)"
failures=0

expect() {
  local allowed="$1"
  shift
  "$@" >/dev/null 2>&1
  local code=$?
  if [[ " $allowed " != *" $code "* ]]; then
    echo "FAIL (exit $code, expected one of: $allowed): $*"
    failures=$((failures + 1))
  fi
}

expect "0" node "$DIR/spec-status.mjs" --help
expect "2" node "$DIR/spec-status.mjs"
expect "2" node "$DIR/spec-status.mjs" --oas 3
expect "2" node "$DIR/spec-status.mjs" --oas 3.2 --json-schema 2020-12
expect "2" node "$DIR/spec-status.mjs" --json-schema draft-99
expect "0 1 3" node "$DIR/spec-status.mjs" --oas 3.2
expect "0 1 3" node "$DIR/spec-status.mjs" --oas 3.1 --parent 3.0
expect "0 1 3" node "$DIR/spec-status.mjs" --oas 2.0
for dialect in 2020-12 2019-09 draft-07 draft-06 draft-04; do
  expect "0 1 3" node "$DIR/spec-status.mjs" --json-schema "$dialect"
done
expect "3" node "$DIR/spec-status.mjs" --oas 9.9
expect "2" node "$DIR/spec-status.mjs" --spec a2a
expect "2" node "$DIR/spec-status.mjs" --spec raml --version 1.0
expect "2" node "$DIR/spec-status.mjs" --oas 3.2 --version 3.2
for family in "asyncapi 3.1" "asyncapi 2.6" "a2a 1.0" "arazzo 1.0"; do
  set -- $family
  expect "0 1 3" node "$DIR/spec-status.mjs" --spec "$1" --version "$2"
done
expect "3" node "$DIR/spec-status.mjs" --spec asyncapi --version 9.0
expect "0" node "$DIR/check-detection.mjs" --help
expect "2" node "$DIR/check-detection.mjs" --oas 3.2
expect "2" node "$DIR/check-detection.mjs" --sample missing.yaml=text/yaml
expect "0 1" node "$DIR/check-detection.mjs" --oas 3.2.0
expect "0" node "$DIR/verify-urls.mjs" --help
expect "2" node "$DIR/verify-urls.mjs"

if [[ $failures -gt 0 ]]; then
  echo "$failures smoke check(s) failed"
  exit 1
fi
echo "smoke OK"
