### `getEditorMetadata`

`getEditorMetadata` is a method that allows you to get information about the Editor's state without reaching directly into the plugin system.

Example:

```js
const editor = SwaggerEditor({ /* your configuration here */ })

SwaggerEditor.getEditorMetadata()
```

Result:

```js
{
  contentString: String,
  contentObject: Object,
  isValid: Boolean,
  errors: Array,
}
```