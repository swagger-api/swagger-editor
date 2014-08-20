#!/usr/bin/env bash

./node_modules/protractor/bin/webdriver-manager update
./node_modules/grunt-cli/bin/grunt build
./node_modules/grunt-cli/bin/grunt test
