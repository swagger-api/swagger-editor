import expect from "expect"
import { validate } from "plugins/validation/semantic-validators/validators/items-required-for-array-objects"

describe("validation plugin - semantic - items required for array objects", () => {
  it("should return an error when an array header object omits an `items` property", () => {
    const spec = {
      "swagger": "2.0",
      "info": {
        "version": "1.0.0",
        "title": "Swagger Petstore"
      },
      "paths": {
        "/pets": {
          "get": {
            "description": "Returns all pets from the system that the user has access to",
            "responses": {
              "200": {
                "description": "pet response",
                "headers": {
                  "X-MyHeader": {
                    "type": "array"
                  }
                }
              },
              "default": {
                "description": "unexpected error"
              }
            }
          }
        }
      }
    }

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "responses", "200", "headers", "X-MyHeader"])
    expect(res.errors[0].message).toEqual("Headers with 'array' type require an 'items' property")
    expect(res.warnings.length).toEqual(0)
  })

  it("should not return an error when an array header object has an `items` property", () => {
    const spec = {
      "swagger": "2.0",
      "info": {
        "version": "1.0.0",
        "title": "Swagger Petstore"
      },
      "paths": {
        "/pets": {
          "get": {
            "description": "Returns all pets from the system that the user has access to",
            "responses": {
              "200": {
                "description": "pet response",
                "headers": {
                  "X-MyHeader": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              },
              "default": {
                "description": "unexpected error"
              }
            }
          }
        }
      }
    }

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })
})
