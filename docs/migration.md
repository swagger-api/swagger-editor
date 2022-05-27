# Migrate from SwaggerEditor@4 to SwaggerEditor@next

## Table of Contents
- [Introduction](#introduction)
- [Development](#development)
  - [Start script with hot-reloading](#start-script-with-hot-reloading)
  - [Static build script](#static-build-script)
  - [Local & remote definitions](#local--remote-definitions)
  - [Linting](#linting)
  - [Dependencies](#dependencies)
  - [Testing](#testing)
- [Design](#design)
  - [Plugins](#plugins)
    - [plugins available at release](#plugins-available-at-release)
    - [plugins not yet migrated](#plugins-not-yet-migrated)
  - [Layout](#layout)


### Introduction
SwaggerEditor@next is a ground-up rewrite of SwaggerEditor@4. However, SwaggerEditor@4 is still fundamentally based on the SwaggerUI plugin system, and continues to be developed within the React ecosystem. For users without custom plugins or other forked customizations, SwaggerEditor@next is intended to be mostly drop-in compatible with the existing SwaggerEditor@4.

SwaggerEditor@4 introduces integration with ApiDOM and Microsoft's Monaco Editor. ApiDOM replaces the parser from SwaggerClient, as well as existing custom validation from SwaggerEditor@4. Monaco Editor replaces Ace Editor. Additional documentation on features and usage of [ApiDOM](https://github.com/swagger-api/apidom) and [Monaco Editor](https://github.com/microsoft/monaco-editor) can be found within their respective documention. Also available are the [ApiDOM Playground](https://swagger-api.github.io/apidom/) and [Monaco Editor Playground](https://microsoft.github.io/monaco-editor/playground.html)

This migration guide is intended to highlight setup changes and key customization features for SwaggerEditor@next.


### Development
SwaggerEditor@next is using **forked** Create React App as it's building infrastructure. Therefore there are a few minor differences to develop SwaggerEditor@next

#### Start script with hot-reloading
new:
```
$ npm start
```

old:
```
$ npm run dev
```

#### Static build script
new:
```
$ npm run build:app
$ npm run build:app:serve
```

old:
```
$ npm start
```

#### Local & remote definitions
Only files inside `public` can be used from `public/index.html`. JS files must be put inside `src`.

new:
```
<SwaggerEditor url={url} />
```

old:
In `dev-helpers/index.html`, add a `url` key like this: 
```
const editor = SwaggerEditorBundle({
  dom_id: '#swagger-editor',
  url: "some-local-or-remote-path-to-definition.yaml" # define path here
  layout: 'StandaloneLayout',
  presets: [
    SwaggerEditorStandalonePreset
  ]
})
```


#### Linting
Automatic linting checks remain part of the commit process. SwaggerEditor@4 now generally follows the eslint recommendations from the AirBnb and React teams.

There is currently a known issue between compatibility of `eslint-config-airbnb` and `eslint-config-react-app`. The workaround is to set `DISABLE_ESLINT_PLUGIN=false` in the npm script. 


#### Dependencies

SwaggerEditor@next is now based on `swagger-ui-react` instead of `swagger-ui`. In addition, unlike SwaggerEditor@4, SwaggerEditor@next does not have a dependency on `SwaggerClient`.


#### Testing

Unit tests are now covered by `jest` and `@testing-library`. Unit tests are now co-located next to their component. Component tests follow the `@testing-library` philosophy to avoid including implementation details, so that changes to implementation but not functionality doesn't break existing tests.

E2E Cypress tests remain in the `test/cypress` directory.


### Design

#### Plugins

SwaggerEditor@next maintains its core as an extension of SwaggerUI's plugin system. SwaggerEditor@next exports itself as a fully realized set of plugins, each of which can be extended and wrapped as needed. This even includes the new Monaco Editor feature as a plugin!

Compared to SwaggerEditor@4, there is also no change to precedence with regards to the order of loading plugins.

SwaggerEditor@next provides a `modals` plugin for a unified modal system. The `modals` plugin is further extended via the `dialogs` plugin which provides a set of `alert` and `confirm` modal dialogs.

Any existing custom plugins for SwaggerEditor@4 that modified the behavior of, or directly interfaced with, the Ace Editor will likely need to be heavily refactored. Custom validation rules should be migrated to ApiDOM as needed.


##### plugins available at release
- `dialogs`
- `dropzone`
- `editor-monaco`
- `editor-persistence`
- `editor-preview-asyncapi`
- `editor-preview-swagger-ui`
- `editor-read-only`
- `editor-spec-origin`
- `editor-textarea`
- `layout`
- `modals`
- `topbar`

##### plugins not yet migrated

At the time of this writing there are two plugins from SwaggerEditor@4 that have not been migrated:
1. `jump-to-path`. Note: expect to leverage ApiDOM and `editor-monaco` plugin to replace AST and Ace Editor.
2. `topbar-insert`. Note: expect to leverage and wrap components of various existing plugins: `topbar`, `editor-monaco`, `modals`, and `dialogs`.



#### Layout

SwaggerEditor@next comes with a plugin for a "core" layout. The "core" layout provides plug points that are analogous to "panes" and/or "bars" in other IDEs. These plug points make it easier for developers to create plugins that customize their UX with as minimal changes to the "core" layout as possible. 

The "core" layout includes contains `EditorPane`, `EditorPreviewPane`, and `Topbar`. These three components represent the basic UX wireframe for SwaggerEditor@next. In addition, the `EditorPane` is provided with four surrounding `bars` (top, bottom, left, right) that can each be customized with their own wrapped implementations. 

Using itself as a reference design, SwaggerEditor@next provides implementation of two different `EditorPane` (`editor-monaco` and `editor-textarea`), and two different `EditorPreviewPane` (`editor-preview-swagger-ui` and `editor-preview-asyncapi). The `editor-monaco` plugin also further extends the base `EditorPaneBarTop` and `EditorPaneBarBottom` with its own wrapped version of each.
