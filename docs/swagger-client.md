fetch GET call to `SwaggerClient(url, [options])` will return `response.apis` methods.

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
In order to render a list of server/client generators, swagger-client will fetch methods created by swagger-generator, then process the response into a more usable `response.apis.clients` format. swagger-editor then needs to make a subsequent call to swagger-client for the appropriate method to call to yield the final result.

In legacy version, swagger-editor saved these methods to React state for general purpose use, e.g. downloadFile vs clientOptions. In this new version of swagger-editor, these methods are not currently saved, and are immediately and sequentially called by `topbarActions` to yield a deterministic final result.

Ideally, it would be better if swagger-editor could access these methods directly from swagger-client, assuming that the methods could be ensured to be stable from swagger-generator.
