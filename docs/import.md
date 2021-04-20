# Importing OpenAPI Documents

Swagger Editor can import your OpenAPI document, which can be formatted as JSON or YAML.

## Local File

### File → Import File

Click **Choose File** and select import. The file you are importing has to be a valid JSON or YAML OpenAPI document. Swagger Editor will prompt you about validation errors, if any exist.

### Drag and Drop

Simply drag and drop your OpenAPI JSON or YAML document into the Swagger Editor browser window. 

![Swagger Editor drag and drop demo](./drag-and-drop.gif)

## Public URL

### File → Import URL

Paste the URL to your OpenAPI document. 

### GET Parameter

Request editor.swagger.io to import an OpenAPI specification from publically accessible content via the `?url=` parameter:
```
https://editor.swagger.io/?url=https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v2.0/yaml/api-with-examples.yaml
```
