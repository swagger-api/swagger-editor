const selectOpenAPI20JSON = () => `{
  "swagger": "2.0",
  "info": {
    "title": "OAS2 response examples",
    "version": "1.0.0"
  },
  "produces": [
    "application/json"
  ],
  "paths": {
    "/foo1": {
      "get": {
        "summary": "Response without a schema",
        "responses": {
          "200": {
            "description": "Successful response",
            "examples": {
              "application/json": {
                "foo": "custom value no schema update fail apple"
              }
            }
          }
        }
      }
    },
    "/foo2": {
      "get": {
        "summary": "Response with schema",
        "responses": {
          "200": {
            "description": "Successful response",
            "schema": {
              "$ref": "#/definitions/Foo"
            },
            "examples": {
              "application/json": {
                "foo": "custom value changes ok"
              }
            }
          }
        }
      }
    }
  },
  "definitions": {
    "Foo": {
      "type": "object",
      "properties": {
        "foo": {
          "type": "string",
          "example": "bar"
        }
      }
    }
  }
}`;

export default selectOpenAPI20JSON;
