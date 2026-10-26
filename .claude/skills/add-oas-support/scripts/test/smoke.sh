#!/usr/bin/env bash
# Smoke test for the skill scripts. Run from the repository root after changing a script:
#   bash .claude/skills/add-oas-support/scripts/test/smoke.sh
# Usage errors must exit 2. Real runs must exit 0, 1 or 3 and print their completion summary:
# exit 1 is also Node's status for an uncaught error, so the exit code alone can't tell them apart.
set -u
DIR="$(cd "$(dirname "$0")/.." && pwd)"
failures=0

SPEC_STATUS_SUMMARY='[0-9]+ UPSTREAM, [0-9]+ MISSING, .*[0-9]+ OK$'
DETECTION_SUMMARY='[0-9]+ OK, [0-9]+ MISMATCH$'

# check ALLOWED SUMMARY COMMAND...: exit code must be allowed, and when SUMMARY is not empty the
# last output line must match it. Prints a failure message and returns 1 otherwise.
check() {
  local allowed="$1" summary="$2"
  shift 2
  local output code
  output="$("$@" 2>&1)"
  code=$?
  if [[ " $allowed " != *" $code "* ]]; then
    echo "FAIL (exit $code, expected one of: $allowed): $*"
    return 1
  fi
  if [[ -n "$summary" ]] && ! tail -n 1 <<<"$output" | grep -Eq "$summary"; then
    echo "FAIL (exit $code, no completion summary, crash?): $*"
    return 1
  fi
}

expect() {
  check "$@" || failures=$((failures + 1))
}

# a crashing command exits 1 and prints no summary: the harness must reject it
if check "0 1 3" "$SPEC_STATUS_SUMMARY" node -e 'throw new Error("boom")' >/dev/null; then
  echo "FAIL (harness accepted a crashing command)"
  failures=$((failures + 1))
fi

expect "0" "" node "$DIR/spec-status.mjs" --help
expect "2" "" node "$DIR/spec-status.mjs"
expect "2" "" node "$DIR/spec-status.mjs" --oas 3
expect "2" "" node "$DIR/spec-status.mjs" --oas 3.2 --json-schema 2020-12
expect "2" "" node "$DIR/spec-status.mjs" --json-schema draft-99
expect "2" "" node "$DIR/spec-status.mjs" --oas 3.2 --swagger-ui-plugin X
expect "2" "" node "$DIR/spec-status.mjs" --oas 3.2 --swagger-ui-version 5.0.0
expect "2" "" node "$DIR/spec-status.mjs" --json-schema 2020-12 --swagger-ui-version 5.0
# no --swagger-ui-plugin/--swagger-ui-version: native JSON Schema rendering is unconfirmed, UPSTREAM
expect "3" "$SPEC_STATUS_SUMMARY" node "$DIR/spec-status.mjs" --json-schema 2020-12
# the key alone doesn't tell dialects apart: still UPSTREAM
expect "3" "$SPEC_STATUS_SUMMARY" node "$DIR/spec-status.mjs" --json-schema 2020-12 --swagger-ui-plugin JSONSchemaDocument
# minimal checkout with swagger-ui-react 5.31.0 bundling the key: the upstream check passes for an
# older or equal release (numerically: 5.4.0 < 5.31.0), so only MISSING remains; a newer one is
# UPSTREAM
root="$(mktemp -d)"
trap 'rm -rf "$root"' EXIT
mkdir -p "$root/src/plugins/editor-content-type" "$root/node_modules/swagger-ui-react"
echo '{"version":"5.31.0"}' >"$root/node_modules/swagger-ui-react/package.json"
echo 'c("JSONSchemaDocument")' >"$root/node_modules/swagger-ui-react/swagger-ui-es-bundle-core.js"
for release in 5.4.0 5.31.0; do
  expect "1" "$SPEC_STATUS_SUMMARY" node "$DIR/spec-status.mjs" --root "$root" --json-schema 2020-12 \
    --swagger-ui-plugin JSONSchemaDocument --swagger-ui-version "$release"
done
expect "3" "$SPEC_STATUS_SUMMARY" node "$DIR/spec-status.mjs" --root "$root" --json-schema 2020-12 \
  --swagger-ui-plugin JSONSchemaDocument --swagger-ui-version 5.32.0
expect "0 1 3" "$SPEC_STATUS_SUMMARY" node "$DIR/spec-status.mjs" --oas 3.2
expect "0 1 3" "$SPEC_STATUS_SUMMARY" node "$DIR/spec-status.mjs" --oas 3.1 --parent 3.0
expect "0 1 3" "$SPEC_STATUS_SUMMARY" node "$DIR/spec-status.mjs" --oas 2.0
for dialect in 2020-12 2019-09 draft-07 draft-06 draft-04; do
  expect "0 1 3" "$SPEC_STATUS_SUMMARY" node "$DIR/spec-status.mjs" --json-schema "$dialect"
done
expect "3" "$SPEC_STATUS_SUMMARY" node "$DIR/spec-status.mjs" --oas 9.9
expect "2" "" node "$DIR/spec-status.mjs" --spec a2a
expect "2" "" node "$DIR/spec-status.mjs" --spec raml --version 1.0
expect "2" "" node "$DIR/spec-status.mjs" --oas 3.2 --version 3.2
for family in "asyncapi 3.1" "asyncapi 2.6" "a2a 1.0" "arazzo 1.0"; do
  set -- $family
  expect "0 1 3" "$SPEC_STATUS_SUMMARY" node "$DIR/spec-status.mjs" --spec "$1" --version "$2"
done
expect "3" "$SPEC_STATUS_SUMMARY" node "$DIR/spec-status.mjs" --spec asyncapi --version 9.0
expect "0" "" node "$DIR/check-detection.mjs" --help
expect "2" "" node "$DIR/check-detection.mjs" --oas 3.2
expect "2" "" node "$DIR/check-detection.mjs" --sample missing.yaml=text/yaml
expect "0 1" "$DETECTION_SUMMARY" node "$DIR/check-detection.mjs" --oas 3.2.0
expect "0" "" node "$DIR/verify-urls.mjs" --help
expect "2" "" node "$DIR/verify-urls.mjs"

if [[ $failures -gt 0 ]]; then
  echo "$failures smoke check(s) failed"
  exit 1
fi
echo "smoke OK"
