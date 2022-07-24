const selectOpenAPI303JSON = () => `{
  "openapi": "3.0.3",
  "info": {
    "title": "OAS 3.0.3 sample with multiple servers",
    "version": "0.1.0"
  },
  "servers": [
    {
      "url": "http://testserver1.com"
    },
    {
      "url": "http://testserver2.com"
    }
  ],
  "paths": {
    "/test/": {
      "get": {
        "responses": {
          "200": {
            "description": "Successful Response"
          }
        }
      }
    }
  }
}`;

export default selectOpenAPI303JSON;
