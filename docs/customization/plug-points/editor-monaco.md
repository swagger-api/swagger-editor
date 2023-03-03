# editor-monaco plug points

## Extending web worker capabilities

`editor-monaco` plugin is using monaco editor, which is using web workers to provide
editor capabilities. `editor-monaco` comes with a web worker called `apidom.worker`.
This worker contains all the language service utilizing ApiDOM capabilities.
`apidom.worker` can be extended in two ways: dynamic and static.

### Dynamic extension

Dynamic extension happens during runtime, and we recommend to use it only for simple use-cases.

First thing we need to do is to pass a `customApiDOMWorkerPath` option to the `EditorMonaco` plugin.

```js
EditorMonaco({
  createData: {
    customApiDOMWorkerPath: 'https://example.com/index.js',
  },
})
```
`customApiDOMWorkerPath` is a URL (absolute or relative) of extending script. When the `apidom.worker`
is bootstrapping it, it imports this URL using [importScripts](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts).
The `apidom.worker` then expects the script to have the following signature:

**https://example.com/index.js**

```js
globalThis.customApiDOMWorkerFactory = (ApiDOMWorkerClass, toolbelt) => {
  return ApiDOMWorkerClass;
};
```

The script must expose `customApiDOMWorkerFactory` function on global object. This function will
receive two arguments:

- ApiDOMWorkerClass - the class that implements the editor capabilities
- toolbelt - an object containing various library exports

Here is a simple **example** demonstrating changing the log level of language service:

```js
globalThis.customApiDOMWorkerFactory = (ApiDOMWorkerClass, toolbelt) => {
  const { apidomLS } = toolbelt;

  class ApiDOMWorkerLogLevelErrorClass extends ApiDOMWorkerClass {
    static apiDOMContext = {
      ...ApiDOMWorkerClass.apiDOMContext,
      logLevel: apidomLS.LogLevel.ERROR,
    };
  }

  return ApiDOMWorkerLogLevelErrorClass;
};
```

### Static extension

Static extension involves need to use a build system like webpack.

**my-custom-apidom.worker.js**

```js
import { initialize, makeCreate, ApiDOMWorker } from 'swagger-editor/apidom.worker';

class ApiDOMWorkerExtended extends ApiDOMWorker {
  // implementation of extensions
}

const create = makeCreate(ApiDOMWorkerExtended);

globalThis.onmessage = () => {
  initialize((ctx, createData) => {
    return create(ctx, createData);
  });
};

export { initialize, create, makeCreate, ApiDOMWorkerExtended as ApiDOMWorker };
```

Next please have a look at the [usage section](../../../README.md#usage) of the documentation
specifically the **webpack.config.js** part. Given that we now extended the default worker,
we need to reconfigure the webpack and provide it with the path to the extended worker.

This is the part of the configuration that will change.

```js
  entry: {
    app: './index.js',
    'apidom.worker': './my-custom-apidom.worker.js',
    'editor.worker': 'swagger-editor/editor.worker',
  }
```

## Passing data to web workers

Often when extending web worker capabilities it is the case that we need to pass additional
data to web worker. These data may include any arbitrary data compatible with
[the structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

Let's consider the following use-case. We need to extend the `apidom.worker` in a way that
it will be fetching data on demand from authorized REST endpoint.

### Dynamic extension

`EditorMonaco` plugin configuration.

```js
EditorMonaco({
  createData: {
    authToken: 'c32d8b45-92fe-44f6-8b61-42c2107dfe87',
    customApiDOMWorkerPath: 'https://example.com/index.js',
  },
})
```

**https://example.com/index.js**

```js
globalThis.customApiDOMWorkerFactory = (ApiDOMWorkerClass, toolbelt) => {
  const { apidomLS } = toolbelt;

  class ApiDOMWorkerLogLevelErrorClass extends ApiDOMWorkerClass {
    static apiDOMContext = {
      ...ApiDOMWorkerClass.apiDOMContext,
      logLevel: apidomLS.LogLevel.ERROR,
    };

    async loadData() {
      // createData passed as plugin option is available in worker as this._createData
      const { authToken } = this._createData;

      return await fetch(`https://example.com/data?authToken=${authToken}`)
    }
  }

  return ApiDOMWorkerLogLevelErrorClass;
};
```

### Static extension

Whenever you extend the `ApiDOMWorker` class you will have `_createData` public property available.

**my-custom-apidom.worker.js**

```js
import { initialize, makeCreate, ApiDOMWorker } from 'swagger-editor/apidom.worker';

class ApiDOMWorkerExtended extends ApiDOMWorker {
  async loadData() {
    // createData passed as plugin option is available in worker as this._createData
    const { authToken } = this._createData;

    return await fetch(`https://example.com/data?authToken=${authToken}`)
  }
}

const create = makeCreate(ApiDOMWorkerExtended);

globalThis.onmessage = () => {
  initialize((ctx, createData) => {
    return create(ctx, createData);
  });
};

export { initialize, create, makeCreate, ApiDOMWorkerExtended as ApiDOMWorker };
```
