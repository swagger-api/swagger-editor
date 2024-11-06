# SwaggerEditor

SwaggerEditor is using [**forked** Create React App](https://github.com/swagger-api/swagger-editor-cra/) as it's building infrastructure.

## Table of Contents

- [Anonymized analytics](#anonymized-analytics)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Development](#development)
  - [Prerequisites](#prerequisites)
  - [Setting up](#setting-up)
  - [npm scripts](#npm-scripts)
  - [Build artifacts](#build-artifacts)
  - [Package mapping](#package-mapping)
- [Documentation](#documentation)
- [Docker](#docker)
- [License](#license)
- [Software Bill Of Materials (SBOM)](#software-bill-of-materials-sbom)

## Anonymized analytics

Swagger Editor uses [Scarf](https://scarf.sh/) to collect [anonymized installation analytics](https://github.com/scarf-sh/scarf-js?tab=readme-ov-file#as-a-user-of-a-package-using-scarf-js-what-information-does-scarf-js-send-about-me). These analytics help support the maintainers of this library and ONLY run during installation. To [opt out](https://github.com/scarf-sh/scarf-js?tab=readme-ov-file#as-a-user-of-a-package-using-scarf-js-how-can-i-opt-out-of-analytics), you can set the `scarfSettings.enabled` field to `false` in your project's `package.json`:

```
// package.json
{
  // ...
  "scarfSettings": {
    "enabled": false
  }
  // ...
}
```

Alternatively, you can set the environment variable `SCARF_ANALYTICS` to `false` as part of the environment that installs your npm packages, e.g., `SCARF_ANALYTICS=false npm install`.

## Getting started

### Prerequisites

These prerequisites are required both for installing SwaggerEditor as a npm package and local development setup.

- [node-gyp](https://www.npmjs.com/package/node-gyp) with [Python 3.x](https://www.python.org/downloads/)
- [GLIBC](https://www.gnu.org/software/libc/) `>=2.29`
- [emscripten](https://emscripten.org/docs/getting_started/downloads.html) or [docker](https://www.docker.com/) needs to be installed, we recommend going with a docker option


### Installation

Assuming [prerequisites](#prerequisites) are already installed, SwaggerEditor npm package is installable and works with `Node.js >= 12.22.0`.
You can install SwaggerEditor via [npm CLI](https://docs.npmjs.com/cli) by running the following command:

```sh
 $ npm install swagger-editor@alpha
````

> NOTE: when using bundler to build your project which is using swagger-editor@5 npm package,
you might run into following Node.js error: `Reached heap limit Allocation failed - JavaScript heap out of memory`.
It's caused by significant amount of code that needs to be bundled. This error can be resolved
by extending the Node.js max heap limit: `export NODE_OPTIONS="--max_old_space_size=4096"`.

### Usage

Use the package in you application:

**index.js**:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import SwaggerEditor from 'swagger-editor';
import 'swagger-editor/swagger-editor.css';

const url = "https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml";

const MyApp = () => (
  <div>
    <h1>SwaggerEditor Integration</h1>
    <SwaggerEditor url={url} />
  </div>
);

self.MonacoEnvironment = {
  /**
   * We're building into the dist/ folder. When application starts on
   * URL=https://example.com then SwaggerEditor will look for
   * `apidom.worker.js` on https://example.com/dist/apidom.worker.js and
   * `editor.worker` on https://example.com/dist/editor.worker.js.
   */
  baseUrl: `${document.baseURI || location.href}dist/`,
}

ReactDOM.render(<MyApp />, document.getElementById('swagger-editor'));
```

**webpack.config.js** (webpack@5)

Install dependencies needed for webpack@5 to properly build SwaggerEditor.

```sh
 $ npm i stream-browserify --save-dev
 $ npm i https-browserify --save-dev
 $ npm i stream-http --save-dev
 $ npm i util --save-dev
```

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    app: './index.js',
    'apidom.worker': 'swagger-editor/apidom.worker',
    'editor.worker': 'swagger-editor/editor.worker',
  },
  output: {
    globalObject: 'self',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    fallback: {
      path: false,
      fs: false,
      http: require.resolve('stream-http'), // required for asyncapi parser
      https: require.resolve('https-browserify'), // required for asyncapi parser
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util'),
      url: require.resolve('url'),
      zlib: false,
    },
    alias: {
      // This alias make sure we don't pull two different versions of monaco-editor
      'monaco-editor': '/node_modules/monaco-editor',
      // This alias makes sure we're avoiding a runtime error related to this package
      '@stoplight/ordered-object-literal$': '/node_modules/@stoplight/ordered-object-literal/src/index.mjs',
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
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

Alternative **webpack.config.js** (webpack@5)

We've already built Web Workers fragments for you, and they're located inside our npm distribution
package in `dist/umd/` directory. In order to avoid complexity of building the Web Worker fragments you can
use those fragments directly. This setup will work both for **production** and **development** (webpack-dev-server)
and will significantly shorten your build process.

Install `copy-webpack-plugin` and other needed dependencies.

```sh
 $ npm i copy-webpack-plugin --save-dev
 $ npm i stream-browserify --save-dev
 $ npm i https-browserify --save-dev
 $ npm i stream-http --save-dev
 $ npm i util --save-dev
```

```js
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    app: './index.js',
  },
  output: {
    globalObject: 'self',
    filename: 'static/js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    fallback: {
      path: false,
      fs: false,
      http: require.resolve('stream-http'), // required for asyncapi parser
      https: require.resolve('https-browserify'), // required for asyncapi parser
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util'),
      url: require.resolve('url'),
      zlib: false,
    },
    alias: {
      // This alias make sure we don't pull two different versions of monaco-editor
      'monaco-editor': '/node_modules/monaco-editor',
      // This alias makes sure we're avoiding a runtime error related to this package
      '@stoplight/ordered-object-literal$': '/node_modules/@stoplight/ordered-object-literal/src/index.mjs',
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'node_modules/swagger-editor/dist/umd/apidom.worker.js',
          to: 'static/js',
        },
        {
          from: 'node_modules/swagger-editor/dist/umd/editor.worker.js',
          to: 'static/js',
        }
      ]
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ]
  }
};
```

## Development

### Prerequisites

Assuming [prerequisites](#prerequisites) are already installed, [Node.js](https://nodejs.org/) `>=20.3.0` and `npm >=9.6.7`
are the minimum required versions that this repo runs on, but we recommend using the latest version of Node.js@20.

### Setting up

If you use [nvm](https://github.com/nvm-sh/nvm), running following command inside this repository
will automatically pick the right Node.js version for you:

```sh
 $ nvm use
```

Run the following commands to set up the repository for local development:

```sh
 $ git clone https://github.com/swagger-api/swagger-editor.git
 $ cd swagger-editor
 $ git checkout next
 $ git submodule init
 $ git submodule update
 $ npm i
 $ npm start
```

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

This script will build all the SwaggerEditor build artifacts - `app`, `esm` and `umd`.

### Build artifacts

After building artifacts, every two new directories will be created: `build/` and `dist/`.

**build/**

```sh
$ npm run build:app
$ npm run build:app:serve
```

Builds and serves standalone SwaggerEditor application and all it's assets on `http://localhost:3050/`.

**dist/esm/**

```sh
$ npm run build:bundle:esm
```

This bundle is suited for consumption by 3rd parties,
which want to use SwaggerEditor as a library in their own applications and have their own build process.

**dist/umd/**

```sh
$ npm run build:bundle:umd
```

SwaggerEditor UMD bundle exports SwaggerEditor symbol on global object.
It's bundled with React defined as external. This allows consumer to use his own version of React + ReactDOM and mount SwaggerEditor lazily.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta
    name="description"
    content="SwaggerEditor"
  />
  <title>SwaggerEditor</title>
  <link rel="stylesheet" href="./swagger-editor.css" />
</head>
<body>
  <div id="swagger-editor"></div>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="./dist/umd/swagger-editor.js"></script>
  <script>
    const props = {
      url: 'https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml',
    };
    const element = React.createElement(SwaggerEditor, props);
    const domContainer = document.querySelector('#swagger-editor');

    ReactDOM.render(element, domContainer);
  </script>
</body>
</html>
```

**npm**

SwaggerEditor is released as `swagger-editor@5` npm package on [npmjs.com](https://npmjs.com).
Package can also be produced manually by running following commands (assuming you're already followed [setting up](#setting-up) steps):

```sh
 $ npm run build:bundle:esm
 $ npm run build:bundle:umd
 $ npm pack
```

### Package mapping

SwaggerEditor maps its [build artifacts](#build-artifacts) in `package.json` file in following way:

```json
"unpkg": "./dist/umd/swagger-editor.js",
"module": "./dist/esm/swagger-editor.js",
"browser": "./dist/esm/swagger-editor.js",
"jsnext:main": "./dist/esm/swagger-editor.js",
"exports": {
  "./package.json": "./package.json",
  "./swagger-editor.css": "./dist/swagger-editor.css",
  ".": {
    "browser": "./dist/esm/swagger-editor.js"
  },
  "./plugins/*": {
    "browser": "./dist/esm/plugins/*/index.js"
  },
  "./presets/*": {
    "browser": "./dist/esm/presets/*/index.js"
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

## Documentation

### Using older version of React

> [!IMPORTANT]
> By older versions we specifically refer to `React >=17 <18`.

By default [swagger-editor@5](https://www.npmjs.com/package/swagger-editor) npm package comes with latest version of [React@18](https://react.dev/blog/2022/03/29/react-v18).
It's possible to use _swagger-editor@5_ npm package with older version of React.

Let's say my application integrates with _swagger-editor@5_ npm package and uses [React@17.0.2](https://www.npmjs.com/package/react/v/17.0.2).

### npm

In order to inform `swagger-editor@5` npm package that I require it to use my React version, I need to use [npm overrides](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides).

```json
{
  "dependencies": {
    "react": "=17.0.2",
    "react-dom": "=17.0.2"
  },
  "overrides": {
    "swagger-editor": {
      "react": "$react",
      "react": "$react-dom",
      "react-redux": "^8"
    }
  }
}
```

> [!NOTE]
> The React and ReactDOM override are defined as a reference to the dependency. Since _react-redux@9_ only supports `React >= 18`, we need to use _react-redux@8_.


### yarn

In order to inform `swagger-editor@5` npm package that I require it to use my specific React version, I need to use [yarn resolutions](https://yarnpkg.com/cli/set/resolution).


```json
{
  "dependencies": {
    "react": "17.0.2",
    "react-dom": "17.0.2"
  },
  "resolutions": {
    "swagger-editor/react": "17.0.2",
    "swagger-editor/react-dom": "17.0.2",
    "swagger-editor/react-redux": "^8"
  }
}
```

> [!NOTE]
> The React and ReactDOM resolution cannot be defined as a reference to the dependency. Unfortunately *yarn* does not support aliasing like `$react` or `$react-dom` as *npm* does. You'll need to specify the exact versions.

### Customization

- [Plug points](./docs/customization/plug-points/README.md)

### Environment Variables

It is possible to use an environment variable to specify a local JSON/YAML file or a remote URL for SwaggerEditor to load on startup.
These environment variables will get baked in during build time into build artifacts.

Environment variables currently available:

| Variable name               |                                                Description                                                 |
|-----------------------------|:----------------------------------------------------------------------------------------------------------:|
| `REACT_APP_DEFINITION_FILE` | Specifies a local file path, and the specified file must also be present in the `/public/static` directory |
| `REACT_APP_DEFINITION_URL`  | Specifies a remote URL. This environment variable currently takes precedence over `REACT_APP_SWAGGER_FILE` |
| `REACT_APP_VERSION`         |              Specifies the version of this app. The version is read from `package.json` file.              |

Sample environment variable values can be found in `.env` file. For more information about using
environment variables, please refer to [adding Custom Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
section of Create React App documentation.

### Using preview plugins in SwaggerUI

SwaggerEditor comes with number of `preview` plugins that are responsible for rendering
the definition that's being created in the editor. These plugins include:

- **EditorPreviewAsyncAPIPlugin** - AsyncAPI specification rendering support
- **EditorPreviewAPIDesignSystemsPlugin** - API Design Systems rendering support

With a bit of adapting, we can use these plugins with SwaggerUI to provide ability
to render AsyncAPI or API Design Systems definitions with SwaggerUI.

```js
import SwaggerUI from 'swagger-ui';
import SwaggerUIStandalonePreset from 'swagger-ui/dist/swagger-ui-standalone-preset';
import 'swagger-editor/swagger-editor.css';
import EditorContentTypePlugin from 'swagger-editor/plugins/editor-content-type';
import EditorPreviewAsyncAPIPlugin from 'swagger-editor/plugins/editor-preview-asyncapi';
import EditorPreviewAPIDesignSystemsPlugin from 'swagger-editor/plugins/editor-preview-api-design-systems';
import SwaggerUIAdapterPlugin from 'swagger-editor/plugins/swagger-ui-adapter';

SwaggerUI({
  url: 'https://petstore.swagger.io/v2/swagger.json',
  dom_id: '#swagger-ui',
  presets: [SwaggerUI.presets.apis, SwaggerUIStandalonePreset],
  plugins: [
    EditorContentTypePlugin,
    EditorPreviewAsyncAPIPlugin,
    EditorPreviewAPIDesignSystemsPlugin,
    SwaggerUIAdapterPlugin,
    SwaggerUI.plugins.DownloadUrl,
  ],
});
```

The key here is `SwaggerUIAdapter` plugin which adapts SwaggerEditor plugins to use
directly with SwaggerUI.

#### Standalone mode

SwaggerUI standalone mode is supported as well. With standalone mode you'll get a `TopBar` with
an input where URL of the definition can be provided and this definition is subsequently loaded
by the SwaggerUI.

```js
import SwaggerUI from 'swagger-ui';
import SwaggerUIStandalonePreset from 'swagger-ui/dist/swagger-ui-standalone-preset';
import 'swagger-ui/dist/swagger-ui.css';
import 'swagger-editor/swagger-editor.css';
import EditorContentTypePlugin from 'swagger-editor/plugins/editor-content-type';
import EditorPreviewAsyncAPIPlugin from 'swagger-editor/plugins/editor-preview-asyncapi';
import EditorPreviewAPIDesignSystemsPlugin from 'swagger-editor/plugins/editor-preview-api-design-systems';
import SwaggerUIAdapterPlugin from 'swagger-editor/plugins/swagger-ui-adapter';

SwaggerUI({
  url: 'https://petstore.swagger.io/v2/swagger.json',
  dom_id: '#swagger-ui',
  presets: [SwaggerUI.presets.apis, SwaggerUIStandalonePreset],
  plugins: [
    EditorContentTypePlugin,
    EditorPreviewAsyncAPIPlugin,
    EditorPreviewAPIDesignSystemsPlugin,
    SwaggerUIAdapterPlugin,
    SwaggerUI.plugins.DownloadUrl,
  ],
  layout: 'StandaloneLayout',
});
```

#### Utilizing preview plugins via [unpkg.com](https://unpkg.com/)

It's possible to utilize preview plugins in a build-free way via [unpkg.com](https://unpkg.com/) to create a standalone
multi-spec supporting version of SwaggerUI.

```html
<!DOCTYPE html>
<html >
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="SwaggerUIMultifold" />
    <link rel="stylesheet" href="//unpkg.com/swagger-editor@5.0.0-alpha.86/dist/swagger-editor.css" />
  </head>
  <body style="margin:0; padding:0;">
    <section id="swagger-ui"></section>

    <script src="//unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
    <script src="//unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
    <script>
      ui = SwaggerUIBundle({});
      // expose SwaggerUI React globally for SwaggerEditor to use
      window.React = ui.React;
    </script>
    <script src="//unpkg.com/swagger-editor@5.0.0-alpha.86/dist/umd/swagger-editor.js"></script>
    <script>
      SwaggerUIBundle({
        url: 'https://petstore3.swagger.io/api/v3/openapi.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset,
        ],
        plugins: [
          SwaggerEditor.plugins.EditorContentType,
          SwaggerEditor.plugins.EditorPreviewAsyncAPI,
          SwaggerEditor.plugins.EditorPreviewApiDesignSystems,
          SwaggerEditor.plugins.SwaggerUIAdapter,
          SwaggerUIBundle.plugins.DownloadUrl,
        ],
        layout: 'StandaloneLayout',
      });
    </script>
  </body>
</html>
```

### Composing customized SwaggerEditor version

SwaggerEditor is just a number of SwaggerUI plugins used with [swagger-ui-react](https://www.npmjs.com/package/swagger-ui-react).
Customized SwaggerEditor can be created by composing individual plugins with either [swagger-ui](https://www.npmjs.com/package/swagger-ui) and [swagger-ui-react](https://www.npmjs.com/package/swagger-ui-react).

#### Plugins

List of available plugins:

- dialogs
- dropdown-menu
- dropzone
- editor-content-fixtures
- editor-content-origin
- editor-content-persistence
- editor-content-read-only
- editor-content-type
- editor-monaco
- editor-monaco-language-apidom
- editor-preview
- editor-preview-api-design-systems
- editor-preview-asyncapi
- editor-preview-swagger-ui
- editor-safe-render
- editor-textarea
- layout
- modals
- splash-screen
- swagger-ui-adapter
- top-bar
- versions

Individual plugins can be imported in the following way:

```js
import EditorContentTypePlugin from 'swagger-editor/plugins/editor-content-type';
import EditorContentReadOnlyPlugin from 'swagger-editor/plugins/editor-content-read-only';
```

#### Presets

Along with plugins, presets are available as well. Preset is a collection of plugins
that are design to work together to provide a compound feature.

List of available presets:

- textarea
- monaco

Individual presets can be imported in the following way:

```js
import TextareaPreset from 'swagger-editor/presets/textarea';
import MonacoPreset from 'swagger-editor/presets/monaco';
```

> NOTE: Please refer to the [Plug points documentation](https://github.com/swagger-api/swagger-ui/blob/master/docs/customization/plug-points.md)
of SwaggerUI to understand how presets are passed to SwaggerUI.


#### Composing with swagger-ui

```js
import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';
import ModalsPlugin from 'swagger-editor/plugins/modals';
import DialogsPlugin from 'swagger-editor/plugins/dialogs';
import DropdownMenuPlugin from 'swagger-editor/plugins/dropdown-menu';
import DropzonePlugin from 'swagger-editor/plugins/dropzone';
import VersionsPlugin from 'swagger-editor/plugins/versions';
import EditorTextareaPlugin from 'swagger-editor/plugins/editor-textarea';
import EditorMonacoPlugin from 'swagger-editor/plugins/editor-monaco';
import EditorMonacoLanguageApiDOMPlugin from 'swagger-editor/plugins/editor-monaco-language-apidom';
import EditorContentReadOnlyPlugin from 'swagger-editor/plugins/editor-content-read-only';
import EditorContentOriginPlugin from 'swagger-editor/plugins/editor-content-origin';
import EditorContentTypePlugin from 'swagger-editor/plugins/editor-content-type';
import EditorContentPersistencePlugin from 'swagger-editor/plugins/editor-content-persistence';
import EditorContentFixturesPlugin from 'swagger-editor/plugins/editor-content-fixtures';
import EditorPreviewPlugin from 'swagger-editor/plugins/editor-preview';
import EditorPreviewSwaggerUIPlugin from 'swagger-editor/plugins/editor-preview-swagger-ui';
import EditorPreviewAsyncAPIPlugin from 'swagger-editor/plugins/editor-preview-asyncapi';
import EditorPreviewApiDesignSystemsPlugin from 'swagger-editor/plugins/editor-preview-api-design-systems';
import TopBarPlugin from 'swagger-editor/plugins/top-bar';
import SplashScreenPlugin from 'swagger-editor/plugins/splash-screen';
import LayoutPlugin from 'swagger-editor/plugins/layout';
import EditorSafeRenderPlugin from 'swagger-editor/plugins/editor-safe-render';

SwaggerUI({
  url: 'https://petstore.swagger.io/v2/swagger.json',
  dom_id: '#swagger-editor',
  plugins: [
    ModalsPlugin,
    DialogsPlugin,
    DropdownMenuPlugin,
    DropzonePlugin,
    VersionsPlugin,
    EditorTextareaPlugin,
    EditorMonacoPlugin,
    EditorMonacoLanguageApiDOMPlugin,
    EditorContentReadOnlyPlugin,
    EditorContentOriginPlugin,
    EditorContentTypePlugin,
    EditorContentPersistencePlugin,
    EditorContentFixturesPlugin,
    EditorPreviewPlugin,
    EditorPreviewSwaggerUIPlugin,
    EditorPreviewAsyncAPIPlugin,
    EditorPreviewApiDesignSystemsPlugin,
    TopBarPlugin,
    SplashScreenPlugin,
    LayoutPlugin,
    EditorSafeRenderPlugin,
  ],
  layout: 'StandaloneLayout',
});
```

#### Composing with swagger-ui-react

```js
import React from 'react';
import ReactDOM from 'react-dom';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import ModalsPlugin from 'swagger-editor/plugins/modals';
import DialogsPlugin from 'swagger-editor/plugins/dialogs';
import DropdownMenuPlugin from 'swagger-editor/plugins/dropdown-menu';
import DropzonePlugin from 'swagger-editor/plugins/dropzone';
import VersionsPlugin from 'swagger-editor/plugins/versions';
import EditorTextareaPlugin from 'swagger-editor/plugins/editor-textarea';
import EditorMonacoPlugin from 'swagger-editor/plugins/editor-monaco';
import EditorMonacoLanguageApiDOMPlugin from 'swagger-editor/plugins/editor-monaco-language-apidom';
import EditorContentReadOnlyPlugin from 'swagger-editor/plugins/editor-content-read-only';
import EditorContentOriginPlugin from 'swagger-editor/plugins/editor-content-origin';
import EditorContentTypePlugin from 'swagger-editor/plugins/editor-content-type';
import EditorContentPersistencePlugin from 'swagger-editor/plugins/editor-content-persistence';
import EditorContentFixturesPlugin from 'swagger-editor/plugins/editor-content-fixtures';
import EditorPreviewPlugin from 'swagger-editor/plugins/editor-preview';
import EditorPreviewSwaggerUIPlugin from 'swagger-editor/plugins/editor-preview-swagger-ui';
import EditorPreviewAsyncAPIPlugin from 'swagger-editor/plugins/editor-preview-asyncapi';
import EditorPreviewApiDesignSystemsPlugin from 'swagger-editor/plugins/editor-preview-api-design-systems';
import TopBarPlugin from 'swagger-editor/plugins/top-bar';
import SplashScreenPlugin from 'swagger-editor/plugins/splash-screen';
import LayoutPlugin from 'swagger-editor/plugins/layout';
import EditorSafeRenderPlugin from 'swagger-editor/plugins/editor-safe-render';

const SwaggerEditor = () => {
  return (
    <SwaggerUI
      url={url}
      plugins={[
        ModalsPlugin,
        DialogsPlugin,
        DropdownMenuPlugin,
        DropzonePlugin,
        VersionsPlugin,
        EditorTextareaPlugin,
        EditorMonacoPlugin,
        EditorMonacoLanguageApiDOMPlugin,
        EditorContentReadOnlyPlugin,
        EditorContentOriginPlugin,
        EditorContentTypePlugin,
        EditorContentPersistencePlugin,
        EditorContentFixturesPlugin,
        EditorPreviewPlugin,
        EditorPreviewSwaggerUIPlugin,
        EditorPreviewAsyncAPIPlugin,
        EditorPreviewApiDesignSystemsPlugin,
        TopBarPlugin,
        SplashScreenPlugin,
        LayoutPlugin,
        EditorSafeRenderPlugin,
      ]}
      layout="StandaloneLayout"
    />
  );
};

ReactDOM.render(<SwaggerEditor />, document.getElementById('swagger-editor'));
```


## Docker

### Pre-built DockerHub image

SwaggerEditor is available as a pre-built docker image hosted on [DockerHub](https://hub.docker.com/r/swaggerapi/swagger-editor/tags?page=1&name=next-v5).

```sh
$ docker pull swaggerapi/swagger-editor:next-v5
$ docker run -d -p 8080:80 swaggerapi/swagger-editor:next-v5
```

### Building locally

**Privileged image**:

```sh
 $ npm run build:app
 $ docker build . -t swaggerapi/swagger-editor:next-v5
 $ docker run -d -p 8080:80 swaggerapi/swagger-editor:next-v5
```

Now open your browser at `http://localhost:8080/`.

**Unprivileged image**:

```sh
 $ npm run build:app
 $ docker build . -f Dockerfile.unprivileged -t swaggerapi/swagger-editor:next-v5-unprivileged
 $ docker run -d -p 8080:8080 swaggerapi/swagger-editor:next-v5-unprivileged
```

Now open your browser at `http://localhost:8080/`.


> **No** custom environment variables are currently supported by SwaggerEditor.

## License

SwaggerEditor is licensed under [Apache 2.0 license](https://github.com/swagger-api/swagger-editor/blob/next/LICENSES/Apache-2.0.txt).
SwaggerEditor comes with an explicit [NOTICE](https://github.com/swagger-api/apidom/blob/next/NOTICE) file
containing additional legal notifications and information.

This project uses [REUSE specification](https://reuse.software/spec/) that defines a standardized method
for declaring copyright and licensing for software projects.

## Software Bill Of Materials (SBOM)

Software Bill Of materials is available in this repository [dependency graph](https://github.com/swagger-api/swagger-editor/network/dependencies).
Click on `Export SBOM` button to download the SBOM in [SPDX format](https://spdx.dev/).
