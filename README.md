# <img src="https://raw.githubusercontent.com/swagger-api/swagger.io/wordpress/images/assets/SWE-logo-clr.png" height="80">
[![NPM version](https://badge.fury.io/js/swagger-ui.svg)](http://badge.fury.io/js/swagger-editor)
[![Build Status](https://jenkins.swagger.io/buildStatus/icon?job=oss-swagger-editor-master)](https://jenkins.swagger.io/job/oss-swagger-editor-master/)
[![Code Climate](https://codeclimate.com/github/swagger-api/swagger-editor/badges/gpa.svg)](https://codeclimate.com/github/swagger-api/swagger-editor)
[![Dependency Status](https://david-dm.org/swagger-api/swagger-editor/status.svg)](https://david-dm.org/swagger-api/swagger-editor)
[![devDependency Status](https://david-dm.org/swagger-api/swagger-editor/dev-status.svg)](https://david-dm.org/swagger-api/swagger-editor-#info=devDependencies)
[![Build Status](https://jenkins.swagger.io/view/OSS%20-%20JavaScript/job/oss-swagger-editor-master/badge/icon?subject=jenkins%20build)](https://jenkins.swagger.io/view/OSS%20-%20JavaScript/job/oss-swagger-editor-master/)

**🕰️ Looking for the older version of Swagger Editor?** Refer to the [*2.x* branch](https://github.com/swagger-api/swagger-editor/tree/2.x).

Swagger Editor lets you edit [Swagger API specifications](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md) in YAML inside your browser and to preview documentations in real time.
Valid Swagger JSON descriptions can then be generated and used with the full Swagger tooling (code generation, documentation, etc).

As a brand new version, written from the ground up, there are some known issues and unimplemented features. Check out the [Known Issues](#known-issues) section for more details.

This repository publishes to two different NPM modules:

* [swagger-editor](https://www.npmjs.com/package/swagger-editor) is a traditional npm module intended for use in single-page applications that are capable of resolving dependencies (via Webpack, Browserify, etc).
* [swagger-editor-dist](https://www.npmjs.com/package/swagger-editor-dist) is a dependency-free module that includes everything you need to serve Swagger Editor in a server-side project, or a web project that can't resolve npm module dependencies.

If you're building a single-page application, using `swagger-editor` is strongly recommended, since `swagger-editor-dist` is significantly larger.

For the older version of swagger-editor, refer to the [*2.x branch*](https://github.com/swagger-api/swagger-editor/tree/2.x).

## Helpful scripts

Any of the scripts below can be run by typing `npm run <script name>` in the project's root directory.

### Developing
Script name | Description
--- | ---
`dev` | Spawn a hot-reloading dev server on port 3200.
`deps-check` | Generate a size and licensing report on Swagger Editors's dependencies.
`lint` | Report ESLint style errors and warnings.
`lint-errors` | Report ESLint style errors, without warnings.
`lint-fix` | Attempt to fix style errors automatically.
`watch` | Rebuild the core files in `/dist` when the source code changes. Useful for `npm link`.

### Building
Script name | Description
--- | ---
`build` | Build a new set of JS and CSS assets, and output them to `/dist`.
`build:bundle` | Build `swagger-editor-bundle.js` only (commonJS). 
`build:core` | Build `swagger-editor.(js\|css)` only (commonJS).
`build:standalone` | Build `swagger-editor-standalone-preset.js` only (commonJS).
`build:stylesheets` | Build `swagger-editor.css` only.
`build:es:bundle` | Build `swagger-editor-es-bundle.js` only (es2015).
`build:es:bundle:core` | Build `swagger-editor-es-bundle-core.js` only (es2015).

### Testing
Script name | Description
--- | ---
`test` | Run unit tests in Node, run Cypress end-to-end tests, and run ESLint in errors-only mode.
`test:unit-mocha` | Run Mocha-based unit tests in Node.
`test:unit-jest` | Run Jest-based unit tests in Node.
`e2e` | Run end-to-end browser tests with Cypress.
`lint` | Run ESLint test
`test:artifact` | Run list of bundle artifact tests in Jest
`test:artifact:umd:bundle` | Run unit test that confirms `swagger-editor-bundle` exports as a Function
`test:artifact:es:bundle` | Run unit test that confirms `swagger-editor-es-bundle` exports as a Function
`test:artifact:es:bundle:core` | Run unit test that confirms `swagger-editor-es-bundle-core` exports as a Function


## Running locally

##### Prerequisites

- NPM 6.x

Generally, we recommend the following guidelines from [Node.js Releases](https://nodejs.org/en/about/releases/) to only use Active LTS or Maintenance LTS releases.

Current Node.js Active LTS:
- Node.js 12.x
- NPM 6.x

Current Node.js Maintenance LTS:
- Node.js 10.x
- NPM 6.x


If you have Node.js and npm installed, you can run `npm start` to spin up a static server.

Otherwise, you can open `index.html` directly from your filesystem in your browser.

If you'd like to make code changes to Swagger Editor, you can start up a Webpack hot-reloading dev server via `npm run dev`.

##### Browser support

Swagger Editor works in the latest versions of Chrome, Safari, Firefox, and Edge.

### Known Issues

To help with the migration, here are the currently known issues with 3.X. This list will update regularly, and will not include features that were not implemented in previous versions.

- Everything listed in [Swagger UI's Known Issues](https://github.com/swagger-api/swagger-ui/blob/master/README.md#known-issues).
- The integration with the codegen is still missing.
- Importing specs from a URL is not implemented.

## Docker

### Running the image from DockerHub
There is a docker image published in [DockerHub](https://hub.docker.com/r/swaggerapi/swagger-editor/).

To use this, run the following:

```
docker pull swaggerapi/swagger-editor
docker run -d -p 80:8080 swaggerapi/swagger-editor
```

This will run Swagger Editor (in detached mode) on port 80 on your machine, so you can open it by navigating to `http://localhost` in your browser.  


* You can provide your own `json` or `yaml` definition file on your host

```
docker run -d -p 80:8080 -v $(pwd):/tmp -e SWAGGER_FILE=/tmp/swagger.json swaggerapi/swagger-editor
```

* You can provide a API document from your local machine — for example, if you have a file at `./bar/swagger.json`:

```
docker run -d -p 80:8080 -e URL=/foo/swagger.json -v /bar:/usr/share/nginx/html/foo swaggerapi/swagger-editor
```

* You can specify a different base url at which where to access the application - for example if you want to application to be available at `http://localhost/swagger-editor/`:

```
docker run -d -p 80:8080 -e BASE_URL=/swagger-editor swaggerapi/swagger-editor
```

### Building and running an image locally

To build and run a docker image with the code checked out on your machine, run the following from the root directory of the project:

```
# Install npm packages (if needed)
npm install

# Build the app
npm run build

# Build an image
docker build -t swagger-editor .

# Run the container
docker run -d -p 80:8080 swagger-editor

```

You can then view the app by navigating to `http://localhost` in your browser.

## Documentation

* [Importing your OpenAPI document](docs/import.md)

* [Contributing](https://github.com/swagger-api/.github/blob/master/CONTRIBUTING.md)

## Security contact

Please disclose any security-related issues or vulnerabilities by emailing [security@swagger.io](mailto:security@swagger.io), instead of using the public issue tracker.
