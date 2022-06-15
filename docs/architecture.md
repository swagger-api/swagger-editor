# High level architecture of SwaggerEditor@5

This document briefly describes high level architecture of SwaggerEditor@5.

## Plugin architecture

SwaggerEditor@5 is composed of number of plugins. These plugins are divided into four
distinct categories

1. Plugins providing editor implementations
2. Plugins providing preview of editor content
3. Editor implementation support plugins
4. Generic features plugins

### Plugins providing editor implementations

These plugins include `editor-textarea` and `editor-moanco`.

`editor-textarea` is a base plugin that other editor implementations build on.
This plugin provides basic editing experience using `<textarea />` HTML tag.

`editor-monaco` builds on top of `editor-textarea` and provide advanced editing
experience using [Monaco Editor](https://microsoft.github.io/monaco-editor/).

### Plugins providing preview of editor content

These plugins include `editor-preview-swagger-ui`, `editor-preview-asyncapi` and others.
The single responsibility of editor preview plugin is to render the editor content (text)
to a set of UI components.

### Editor implementation support plugins

These plugins include `editor-persistence`, `editor-read-only` and others.
Plugins in this category are responsible to support plugins providing editor implementation
with additional enhanced capabilities in generic way.

### Generic features plugins

These plugins include `dialogs`, `modals`, `layout` and others. Each plugin in this
category provide features or enhancements to plugins in previous three categories.

## Future architectural changes

This section describes opportunities to make the architecture of SwaggerEditor@5 better.

### State management

Currently, editor content (text) is stored in SwaggerUI `spec` plugin. This causes various issues
which manifests in decreased user experience of editing text. Every time the editor content
changes the `spec` plugin will try to parse it as JSON or YAML, resolve it and store it in
redux state. This is absolutely not necessary. We can store editor content in editor implementation plugin
and have preview plugins work as finite state machines and detect if they should process the editor content in any way.
When this architectural change is implemented, the typing lag on big amount of editor content (text)
will significantly decrease.

