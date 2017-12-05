import expect from "expect"
import validateHelper from "./validate-helper"

describe("validation plugin - semantic - items required for array objects", function() {
  // It takes a while to start up swagger-ui, for some reason
  this.timeout(10 * 1000)

  it("should return an error when an array header object omits an `items` property", () => {

    // Given
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

    // When
    return validateHelper(spec)
      .then(system => {

        // Then
        expect(system.errSelectors.allErrors().count()).toEqual(1)
        const firstError = system.errSelectors.allErrors().first().toJS()
        expect(firstError.message).toMatch(/.*type.*array.*require.*items/)
        expect(firstError.path).toEqual(["paths", "/pets", "get", "responses", "200", "headers", "X-MyHeader"])
      })

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

    return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors()
        expect(allErrors.count()).toEqual(0)
      })
  })
})
