

Configuration
=============

Swagger editor is configured from the file [`config/defaults.json`](../config/defaults.json).
To learn more about this file, please review [`config/defaults.json.guide.js`](../config/defaults.json.guide.js).

Custom UI
---------

You can also enable `headerBranding` flag and serve `/templates/branding-left.html`
and `/templates/branding-right.html` files to have custom header.

It's possible to serve a custom CSS file at `/styles/branding.css` path to override editor's appearances.

It's also possible to serve a custom JavaScript file at `/scripts/branding.js` to add 
new functionalities to Swagger Editor. Using branding HTML pieces and branding JavaScript
file you can add new controllers to Swagger Editor.

#### `disableFileMenu`
Set to `true` to disable the editor menu

#### `editorOptions`
Ace editor options. This object will overload existing editor options.
See all possible options [here](http://ace.c9.io/#nav=api&api=ace)

#### `keyPressDebounceTime`
Change how many milliseconds after the last keypress the editor should respond to change. Defaults to `200ms`.

#### `disableNewUserIntro`
Disables the overlay introduction panel. It's enabled by default.

External Hooks
--------------

Swagger Editor provides an API for executing arbitrary code on certain events.

To install a hook simply use `SwaggerEditor.on()` method. `.on()` method accepts two arguments,
the first argument is the event name and the second argument is callback function that will be invoked when 
that event occurs.

Here is a list of available event names:

* `'code-change'`
* `'put-success'`
* `'put-failure`

#### Example usage of external hooks
```js
SwaggerEditor.on('put-failure', function() {
  alert('There was something wrong with saving your document.');
});
```

Backends
--------

#### `backendEndpoint`
Url to a backend which supports `GET` for retrieving a OpenAPI Spec to edit
and `PUT` for saving it.

#### `useBackendForStorage`
Set to ``true`` to enable a backend.

#### `backendThrottle`
The timeout for throttling backend calls. The default is 200 milliseconds

#### `useYamlBackend`
Set to ``true`` if the backend expects YAML, ``false`` will use JSON

Analytics
---------
`analytics` section in JSON configuration is used for user tracking configurations. At the moment only Google Analytics is supported.

Example:

```js
analytics: {
    google: {
    /*
     * Put your Google Analytics ID here
    */
    id: 'YOUR_GOOGLE_ANALYTICS_ID'
  }
}
```

Code Generation
---------------

#### `disableCodeGen`
Set to ``true`` to hide codegen links for clients and servers.

#### `codegen`
An object with keys ``servers``, ``clients``, ``server``, and ``client``. Each of with is a url to codegen service.


Examples
--------

#### `examplesFolder`
Path to a directory with examples specs. Note that this string will be used in between two other URL segments so you always need the trailing and leading slashes

#### `exampleFiles`
Array of strings. List files in ``exampleFolder`` that contain example specs. The first file is used as the default document for the editor when it is opened.
