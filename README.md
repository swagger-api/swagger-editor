# Swagger IDE

App will load with Monaco, Topbar, Swagger-UI (react).

refer to `CHANGELOG.md` for migration & project status

refer `docs/swagger-client.md` for some notes

Webpack and development setup based on Create React App (ejected)

## Prerequisites
```
 "node": "~16.13",
 "npm": ">=8.1.0"
```

- if using MacOS, please refer to additional installation notes below
- ApiDOM monorepo requires the use of `npm>=8.1.0`

## Install

After cloning run the following commands to install dependencies and start the development server

```sh
 $ npm i
 $ npm start
```

Edit files in `./src` directory

The default development port is `port=3000`. If a port is already in use, `npm start` will increment the port.

### MacOS Install notes

With the combination of MacOS and Node.js 16, there is a known compatibility issue of installing and building the `tree-sitter` dependency. The workaround is to globally install `>=npm@8.1.x` (for lerna/apidom monorepo) but use Node.js 14 to install/build tree-sitter.

Although the prerequisite is to use Node@16.13, at this point we don't rely on any specific feature from Node.js 16.13 (except for `>=npm@8.1.x`).

```sh
 $ npm install -g npm
 $ npm --version
```

Assuming we are using `NVM` to manage Node versions,

```sh
 $ nvm use v14
```

Then follow the installation steps above

## Test

Both Jest and Cypress include `@testing-library` plugin support.

**Jest Unit Tests**
```sh
 $ npm test
```

**Cypress E2E Tests**

Usage in **development** environment:

```sh
 $ npm run cy:dev
```

Usage in **Continuos Integration (CI)** environment:

```sh
 $ npm run cy:ci
```

## build
This script will build and serve the build fragments at `localhost:3050`.

```sh
$ npm run build:app
$ npm run build:app:serve
```

## Docker
Once we build the app, we can also build and run a Docker container.

```sh
 $ docker build . -t {{label}}
 $ docker run -p 8080:80 {{label}}
```

- {{label}} can be any descriptive string, e.g. `user/myapp-1`
- open browser at `localhost:8080`
