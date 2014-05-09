### Karma Integration Tests

These are integration tests for Karma plugins. Each directory is a simple standalone project, using Karma and some plugins. These tests are run as a part of [Karma's Travis build](https://travis-ci.org/karma-runner/karma). Each plugin can also run interested tests as a part of its build. For instance, [karma-jasmine](https://travis-ci.org/karma-runner/karma-jasmine) runs `jasmine`, `jasmine_2` and `jasmine-coverage` tests.

When running the tests, a tarball package is installed - that is the package that has just been build (it's not released yet). For instance, during Karma Travis build, `karma-x.x.x.tgz` is produced and installed for each of the test. See [karma-runner/integration-tests/run.sh](https://github.com/karma-runner/integration-tests/blob/master/run.sh) or [karma/scripts/integration-tests.sh](https://github.com/karma-runner/karma/blob/integration-tests/scripts/integration-tests.sh) for more information.

The purpose is to test the full workflow, from `npm install` to `karma start`.

#### TODO:
- junit: assert a valid xml report is generated
- coverage: assert a valid coverage report is generated
- run the tests only for fix/feat commits
- set up all the plugins
- run against master (not only latest npm) and multiple released versions (eg. latest/canary)
