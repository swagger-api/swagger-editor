const selectOpenAPI310JSON = () => `{
  "openapi": "3.1.0",
  "info": {
    "title": "deref",
    "version": "1.0.0"
  },
  "servers": [
    {
      "description": "local",
      "url": "http://localhost:8082/"
    }
  ],
  "paths": {
    "/a": {
      "get": {
        "operationId": "aget",
        "parameters": [
          {
            "$ref": "#/components/parameters/userId"
          }
        ]
      },
      "post": {
        "operationId": "apost"
      }
    },
    "/b": {
      "get": {
        "operationId": "bget",
        "parameters": [
          {
            "$ref": "#/components/parameters/userId"
          }
        ]
      },
      "post": {
        "operationId": "bpost",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/foo"
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "foo": {
        "type": "string"
      },
      "bar": {
        "$id": "http://localhost:8082/",
        "type": "string"
      }
    },
    "parameters": {
      "userId": {
        "$ref": "#/components/parameters/indirection1",
        "description": "override"
      },
      "indirection1": {
        "$ref": "#/components/parameters/indirection2",
        "summary": "indirect summary"
      },
      "indirection2": {
        "$ref": "#/components/parameters/userIdRef",
        "summary": "indirect summary"
      },
      "userIdRef": {
        "name": "userId",
        "in": "query",
        "description": "ID of the user",
        "required": true
      },
      "externalRef": {
        "$ref": "./ex.json#/externalParameter",
        "description": "another ref"
      }
    }
  }
}`;

export default selectOpenAPI310JSON;
