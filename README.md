# <img src="https://raw.githubusercontent.com/swagger-api/swagger.io/wordpress/images/assets/SWE-logo-clr.png" height="80">
[![NPM version](https://badge.fury.io/js/swagger-editor.svg)](http://badge.fury.io/js/swagger-editor)
[![Build Status](https://jenkins.swagger.io/buildStatus/icon?job=oss-swagger-editor-master)](https://jenkins.swagger.io/job/oss-swagger-editor-master/)
[![Code Climate](https://codeclimate.com/github/swagger-api/swagger-editor/badges/gpa.svg)](https://codeclimate.com/github/swagger-api/swagger-editor)
[![Build Status](https://jenkins.swagger.io/view/OSS%20-%20JavaScript/job/oss-swagger-editor-master/badge/icon?subject=jenkins%20build)](https://jenkins.swagger.io/view/OSS%20-%20JavaScript/job/oss-swagger-editor-master/)

**⏰️ Looking for the next generation version of Swagger Editor?**

SwaggerEditor is now released under two major release channels:

1. [SwaggerEditor@4](https://github.com/swagger-api/swagger-editor/releases?q=v4&expanded=true) - released from [master](https://github.com/swagger-api/swagger-editor/tree/master) branch and deployed at https://editor.swagger.io/
2. [SwaggerEditor@5](https://github.com/swagger-api/swagger-editor/releases?q=v5&expanded=true) - released from [next](https://github.com/swagger-api/swagger-editor/tree/next) branch and deployed at https://editor-next.swagger.io/

Only **SwaggerEditor@5** supports [OpenAPI 3.1.0](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md). 
SwaggerEditor@4 will not receive OpenAPI 3.1.0 support and is considered legacy at this point.
The plan is to continually migrate fully to SwaggerEditor@5 and deprecate the SwaggerEditor@4 in the future.

---

**🕰️ Looking for the older version of Swagger Editor?** Refer to the [*2.x*](https://github.com/swagger-api/swagger-editor/tree/2.x) or [*3.x*](https://github.com/swagger-api/swagger-editor/tree/3.x) branches.

---

Swagger Editor lets you edit **OpenAPI API definitions** ([OpenAPI 2.0](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md) and [OpenAPI 3.0.3](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md)) 
in JSON or YAML format inside your browser and to preview documentations in real time.
Valid OpenAPI definitions can then be generated and used with the full Swagger tooling (code generation, documentation, etc).

As a brand-new version, written from the ground up, there are some known issues and unimplemented features. Check out the [Known Issues](#known-issues) section for more details.

This repository publishes to two different NPM modules:

* [swagger-editor](https://www.npmjs.com/package/swagger-editor) is a traditional npm module intended for use in single-page applications that are capable of resolving dependencies (via Webpack, Browserify, etc).
* [swagger-editor-dist](https://www.npmjs.com/package/swagger-editor-dist) is a dependency-free module that includes everything you need to serve Swagger Editor in a server-side project, or a web project that can't resolve npm module dependencies.

If you're building a single-page application, using `swagger-editor` is strongly recommended, since `swagger-editor-dist` is significantly larger.

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

### Prerequisites

- git, any version
- **Node.js >=20.3.0** and **npm >=9.6.7** are the minimum required versions that this repo runs on, but we always recommend using the latest version of Node.js.

```shell
 $ npm i --legacy-peer-deps
```

If you have Node.js and npm installed, you can run `npm start` to spin up a static server.

Otherwise, you can open `index.html` directly from your filesystem in your browser.

If you'd like to make code changes to Swagger Editor, you can start up a Webpack hot-reloading dev server via `npm run dev`.

##### Browser support

Swagger Editor works in the latest versions of Chrome, Safari, Firefox, and Edge.

### Known Issues

To help with the migration, here are the currently known issues with 3.X. This list will update regularly, and will not include features that were not implemented in previous versions.

- Everything listed in [Swagger UI's Known Issues](https://github.com/swagger-api/swagger-ui/blob/master/README.md#known-issues).
- The integration with the codegen is still missing.

## Docker

### Running the image from DockerHub
There is a docker image published in [DockerHub](https://hub.docker.com/r/swaggerapi/swagger-editor/).

To use this, run the following:

```
docker pull swaggerapi/swagger-editor
docker run -d -p 80:8080 swaggerapi/swagger-editor
```

This will run Swagger Editor (in detached mode) on port 80 on your machine, so you can open it by navigating to `http://localhost` in your browser.  

* You can provide a URL pointing to an API definition (may not be available if some security policies such as CSP or CORS are enforced):

```
docker run -d -p 80:8080 -e URL="https://petstore3.swagger.io/api/v3/openapi.json" swaggerapi/swagger-editor
```

* You can provide your own `json` or `yaml` definition file from your local host:

```
docker run -d -p 80:8080 -v $(pwd):/tmp -e SWAGGER_FILE=/tmp/swagger.json swaggerapi/swagger-editor
```

**Note:** When both `URL` and `SWAGGER_FILE` environment variables are set, `URL` has priority and `SWAGGER_FILE` is ignored.

* You can specify a different base url via `BASE_URL` variable for accessing the application - for example if you want the application to be available at `http://localhost/swagger-editor/`:

```
docker run -d -p 80:8080 -e BASE_URL=/swagger-editor swaggerapi/swagger-editor
```

* You can specify a different port via `PORT` variable for accessing the application, default is `8080`.

```
docker run -d -p 80:80 -e PORT=80 swaggerapi/swagger-editor
```

You can also customize the different endpoints used by the Swagger Editor with the following environment variables. For instance, this can be useful if you have your own Swagger generator server:

Environment variable | Default value
--- | ---
`URL_SWAGGER2_GENERATOR` | `https://generator.swagger.io/api/swagger.json`
`URL_OAS3_GENERATOR` | `https://generator3.swagger.io/openapi.json`
`URL_SWAGGER2_CONVERTER` | `https://converter.swagger.io/api/convert`

If you want to run the Swagger Editor locally without the Codegen features (Generate Server and Generate Client) you can set the above environment variables to `null` (`URL_SWAGGER2_CONVERTER=null`).

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
