# Swagger Editor

[![Build Status](https://travis-ci.org/swagger-api/swagger-editor.svg?branch=master)](https://travis-ci.org/swagger-api/swagger-editor)
[![Code Climate](https://codeclimate.com/github/swagger-api/swagger-editor/badges/gpa.svg)](https://codeclimate.com/github/swagger-api/swagger-editor)

Swagger Editor lets you edit API specifications in YAML inside your browser and to preview documentations in real time.
Valid Swagger JSON descriptions can then be generated and used with the full Swagger tooling (code generation, documentation, etc).

To understand how it works, you should [try the live demo](http://editor.swagger.io/#/edit)!

## YAML Syntax
YAML became a first-class citizen as part of the Swagger 2.0 working group process, however it has not yet been documented in the [Swagger Spec](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md). The editor opens with an example YAML file. For some other examples see '[Creating Swagger JSON from YAML files](https://github.com/swagger-api/swagger-codegen/wiki/Creating-Swagger-JSON-from-YAML-files)'

![Screenshot of the Swagger Editor](app/images/screenshot.png "Designing an API with the Swagger Editor")

## Tips
You can import an existing YAML spec by using the `import` query parameter in edit mode. For example:
```
http://editor.swagger.io/#/edit?import=http://generator.wordnik.com/online/api/swagger.yaml
```
## Running Locally

#### Install Node.js

Make sure you have Node.js installed. If you don't have Node.js, install it from it's [Node.js website](http://nodejs.org/).
This project was tested with Node.js version `0.10`. Make sure you have at least this version.

```shell
node --version
```

#### Clone the repository and start it

```shell
git clone git@github.com:swagger-api/swagger-editor.git
cd swagger-editor
```

##### Start on Mac and Linux
```shell
npm start
```

##### Start on Windows
```shell
npm install -g bower grunt-cli
npm install
bower install
grunt serve
```

This will open a browser window running current development version.

## Development Guide
See [**Development Guide document**](./docs/development.md)

### Contributing
File issues in GitHub's to report bugs or issue a pull request.

All contributions must grant copyright permission to this project, the source of which is declared to be under an Apache 2 license (see LICENSE).
