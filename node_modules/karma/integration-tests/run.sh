#!/bin/bash
#
# Run the integration tests.
# Each subdirectory that has a package.json is considered to be an integration test.
#
# Arguments:
#   -g <expression> Run only tests matching this expression.
#                   The expression is passed to egrep -e <expression>.
#
# Example:
# ./run.sh -g jasmine karma-0.12.1.tgz
#
# -> Run jasmine and jasmine_2 tests using Karma from karma-0.12.1.tgz package.



# Parse arguments.
GREP=".*"

while getopts "g:" OPTION; do
  case "$OPTION" in
    g)
    GREP="$OPTARG"
    ;;
  esac
done

PKG_TO_OVERRIDE=${@:$OPTIND:1}


# Run all the matching tests.
for DIR in *; do
  MATCH_COUNT=$(echo $DIR | egrep -c -e "$GREP")

  if [ -f "$DIR/package.json" -a $MATCH_COUNT -gt 0 ]; then
    echo "=============================================================="
    echo " ${DIR} with ${PKG_TO_OVERRIDE}"
    echo "=============================================================="

    cd ./$DIR
    npm install > /dev/null || exit 1
    npm install ${PKG_TO_OVERRIDE} > /dev/null || exit 1
    npm test || exit 1
    cd ..
  fi
done
