Swagger-client is used as middleware to transform `generator` responses,
which also includes function methods alongside data objects.

fetch GET call to `SwaggerClient(url, [options])` will return `response.apis` methods.
- reminder to attach `.catch()` to any `response.apis.[method]` call
```
response.apis.clients:
- clientOptions: ƒ(parameters)
- downloadFile: ƒ(parameters)
- generateClient: ƒ(parameters)
- getClientOptions: ƒ(parameters)

response.apis.servers:
- downloadFile: ƒ(parameters)
- generateServerForLanguage: ƒ(parameters)
- getServerOptions: ƒ(parameters)
- serverOptions: ƒ(parameters)
```

### Summary
In order to download a generated definition, `legacy swagger-editor` made two calls to swagger-client.

1. Given OAS3 or Swagger2/OAS2 definition, swagger-editor makes a request to Generator3 or Generator2 respectively.

Generator3/Generator2 returns a response that includes it's own definition, which `swagger-client`, as middleware, translates the defintion included in Generator's response into a more usable `response.apis.clients` format. This format also includes new `execute` methods for `swagger-editor` to call.

2. `swagger-editor` calls the appropriate `execute` method that was created by `swagger-client` to download the generated definition. Note, Generator3 returns the Blob directly, while Generator2 returns a json object containing an URI link to the Blob.

Additionally, `legacy swagger-editor` saved these methods to React state for general purpose use, e.g. downloadFile vs clientOptions.

In this new version of swagger-editor, use of `swagger-client` has been deprecated, so these methods are no longer available or saved. Equivalent functionality to directly interface with Generator3/Generator2 now exists in `topbarActions`. This change also should now always yield a deterministic final result. 
