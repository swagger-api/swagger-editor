# Swagger IDE

> Note: refer to `CHANGELOG.md` for migration & project status. Refer `docs/swagger-client.md` for some notes.

SwaggerIDE is using **forked** Create React App as it's building infrastructure.

## Table of Contents

- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Development](#development)
  - [Prerequisites](#prerequisites)
  - [Setting up](#setting-up)
    - [Setting up on MacOS](#setting-up-on-macos)
  - [npm scripts](#npm-scripts)
  - [Build artifacts](#build-artifacts)
  - [Package mapping](#package-mapping)
- [Docker](#docker)
- [License](#license)

## Getting started

### Installation

SwaggerIDE is currently hosted on [GitHub packages registry](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages).
For installing SwaggerIDE npm package from GitHub packages registry, create `.npmrc` file in your current directory and add
the following line to it:

```
@swagger-api:registry=https://npm.pkg.github.com
```

#### Prerequisites

Using [Node.js](https://nodejs.org/) [active LTS version](https://nodejs.org/en/about/releases/) is recommended.
[node-gyp](https://www.npmjs.com/package/node-gyp) is used to build some fragments that require [Python 3.x](https://www.python.org/downloads/).
[emscripten](https://emscripten.org/docs/getting_started/downloads.html) or [docker](https://www.docker.com/) needs to be installed
on your operating system as well. We strongly recommend going with a docker option.

You can now install SwaggerIDE package using `npm`:

```sh
 $ npm install @swagger-api/swagger-ide
````

For more information about installing npm packages from GitHub packages registry please visit [Installing a package](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package)
section in their documentation.

### Usage

Install the package:

```sh
 $ npm install @swagger-api/swagger-ide
````

Use the package in you application:

**index.js**:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import SwaggerIDE from '@swagger-api/swagger-ide';
import '@swagger-api/swagger-ide/swagger-ide.css';

const url = "https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml";

const MyApp = () => (
  <div>
    <h1>SwaggerIDE Integration</h1>
    <SwaggerIDE url={url} />
  </div>
);

self.MonacoEnvironment = {
  /**
   * We're building into the dist/ folder. When application starts on
   * URL=https://example.com then SwaggerIDe will look for
   * `apidom.worker.js` on https://example.com/dist/apidom.worker.js and
   * `editor.worker` on https://example.com/dist/editor.worker.js.
   */
  baseUrl: `${document.baseURI || location.href}/dist/`,
}

ReactDOM.render(<MyApp />, document.getElementById('swagger-ide'));
```

**webpack.config.js** (webpack@5)

Install dependencies needed for webpack@5 to properly build SwaggerIDE.

```sh
 $ npm i stream-browserify --save-dev
 $ npm i process --save-dev
```

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    app: './index.js',
    'apidom.worker': '@swagger-api/swagger-ide/apidom.worker',
    'editor.worker': '@swagger-api/swagger-ide/editor.worker',
  },
  output: {
    globalObject: 'self',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    fallback: {
      fs: false,
      http: false,
      https: false,
      path: false,
      stream: require.resolve('stream-browserify'),
      util: false,
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      /**
       * The default way in which webpack loads wasm files won’t work in a worker,
       * so we will have to disable webpack’s default handling of wasm files and
       * then fetch the wasm file by using the file path that we get using file-loader.
       *
       * Resource: https://pspdfkit.com/blog/2020/webassembly-in-a-web-worker/
       *
       * Alternatively, WASM file can be bundled directly into JavaScript bundle as data URLs.
       * This configuration reduces the complexity of WASM file loading
       * but increases the overal bundle size:
       *
       * {
       *   test: /\.wasm$/,
       *   type: 'asset/inline',
       * }
       */
      {
        test: /\.wasm$/,
        loader: 'file-loader',
        type: 'javascript/auto', // this disables webpacks default handling of wasm
      },
    ]
  }
};
```


## Development

### Prerequisites

[Node.js](https://nodejs.org/) >= 16.13.0 and `npm >= 8.1.0` are the minimum required versions that this repo runs on.
We recommend using the latest version of Node.js@16 though. We're using [node-gyp](https://www.npmjs.com/package/node-gyp) to build some fragments that require [Python 3.x](https://www.python.org/downloads/).
[emscripten](https://emscripten.org/docs/getting_started/downloads.html) or [docker](https://www.docker.com/) needs to be installed
on your operating system. We strongly recommend going with a docker option.

> Note: ApiDOM monorepo requires the use of `npm>=7.21.x`

### Setting up

If you use [nvm](https://github.com/nvm-sh/nvm), running following command inside this repository
will automatically pick the right Node.js version for you:

```sh
 $ nvm use
```

Run the following commands to set up the repository for local development:

```sh
 $ git submodule init
 $ git submodule update
 $ npm i
 $ npm start
```

#### Setting up on MacOS

With the combination of MacOS and Node.js 16, there is a known compatibility issue of installing and building the `tree-sitter` dependency. The workaround is to globally install `>=npm@8.1.x` (for lerna/apidom monorepo) but use Node.js 14 to install/build tree-sitter.
Although the prerequisite is to use Node@16.13, at this point we don't rely on any specific feature from Node.js 16.13 (except for `>=npm@8.1.x`).

```sh
 $ npm install -g npm
 $ npm --version
```

Assuming we are using [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:

```sh
 $ nvm use v14
```

Then follow the installation steps above.

### npm scripts

**Lint**

```sh
 $ npm run lint
```

**Runs unit and integration tests**

```sh
 $ npm test
```

**Runs E2E Cypress tests**

Usage in **development** environment:

```sh
 $ npm run cy:dev
```

Usage in **Continuos Integration (CI)** environment:

```sh
 $ npm run cy:ci
```

**Build**

```sh
 $ npm run build
````

This script will build all the SwaggerIDE build artifacts - `app`, `esm` and `umd`.

### Build artifacts

After building artifacts, every two new directories will be created: `build/` and `dist/`.

**build/**

```sh
$ npm run build:app
$ npm run build:app:serve
```

Builds and serves standalone SwaggerIDE application and all it's assets on `http://localhost:3050/`.

**dist/esm/**

```sh
$ npm run build:bundle:esm
```

This bundle is suited for consumption by 3rd parties,
which want to use SwaggerIDE as a library in their own applications and have their own build process.

**dist/umd/**

```sh
$ npm run build:bundle:umd
```

SwaggerIDE UMD bundle exports SwaggerIDE symbol on global object.
It's bundled with React defined as external. This allows consumer to use his own version of React + ReactDOM and mount SwaggerIDe lazily.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta
    name="description"
    content="Swagger IDE"
  />
  <title>Swagger IDE</title>
  <link rel="stylesheet" href="./swagger-ide.css" />
</head>
<body>
  <div id="swagger-ide"></div>
  <script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
  <script src="./dist/umd/swagger-ide.js"></script>
  <script>
    const props = {
      url: 'https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml',
    };
    const element = React.createElement(SwaggerIDE, props);
    const domContainer = document.querySelector('#swagger-ide');

    ReactDOM.render(element, domContainer);
  </script>
</body>
</html>
```

**npm**

SwaggerIDE is released as `@swagger-api/swagger-ide` npm package on [GitHub packages registry](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages).
Package can also be produced manually by running following commands (assuming you're already followed [setting up](#setting-up) steps):

```sh
 $ npm run build:bundle:esm
 $ npm run build:bundle:umd
 $ npm pack
```

### Package mapping

SwaggerIDE maps its [build artifacts](#build-artifacts) in `package.json` file in following way:

```json
"unpkg": "./dist/umd/swagger-ide.js",
"module": "./dist/esm/swagger-ide.js",
"browser": "./dist/esm/swagger-ide.js",
"jsnext:main": "./dist/esm/swagger-ide.js",
"exports": {
  "./package.json": "./package.json",
  "./swagger-ide.css": "./dist/esm/swagger-ide.css",
  ".": {
    "browser": "./dist/esm/swagger-ide.js"
  },
  "./apidom.worker": {
    "browser": "./dist/esm/apidom.worker.js"
  },
  "./editor.worker": {
    "browser": "./dist/esm/editor.worker.js"
  }
}
```

To learn more about these fields please refer to [webpack mainFields documentation](https://webpack.js.org/configuration/resolve/#resolvemainfields)
or to [Node.js Modules: Packages documentation](https://nodejs.org/docs/latest-v16.x/api/packages.html).

## Docker
Once we build the app, we can also build and run a Docker container.

```sh
 $ docker build . -t {{label}}
 $ docker run -p 8080:80 {{label}}
```

- {{label}} can be any descriptive string, e.g. `user/myapp-1`
- open browser at `localhost:8080`

## License

SwaggerIDE is licensed under [Apache 2.0 license](https://github.com/swagger-api/swagger-ide/blob/main/LICENSE).
ApiDOM comes with an explicit [NOTICE](https://github.com/swagger-api/apidom/blob/main/NOTICE) file
containing additional legal notifications and information.
