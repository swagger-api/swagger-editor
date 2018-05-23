import expect from "expect"
import validateHelper from "../validate-helper.js"

describe(`validation plugin - semantic - 2and3 schemas`, () => {
  describe(`array schemas must have an Object value in "items"`, () => {
    it("should return an error for an array items value in Swagger 2", () => {
      const spec = {
        swagger: "2.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  name: "myParam",
                  in: "query",
                  type: "array",
                  items: [{ type: "object" }]
                }
              ]
            }
          }
        }
      }

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        const firstError = allErrors[0]
        expect(allErrors.length).toEqual(1)
        expect(firstError.path).toEqual(["paths", "/pets", "get", "parameters", "0", "items"])
        expect(firstError.message).toEqual("`items` must be an object")
      })
    })
    it("should return an error for an array items value in OpenAPI 3", () => {
      const spec = {
        openapi: "3.0.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  name: "myParam",
                  in: "query",
                  schema: {
                    type: "array",
                    items: [{ type: "object" }]
                  }
                },
              ]
            }
          }
        }
      }

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        const firstError = allErrors[0]
        expect(allErrors.length).toEqual(1)
        expect(firstError.path).toEqual(["paths", "/pets", "get", "parameters", "0", "schema", "items"])
        expect(firstError.message).toEqual("`items` must be an object")
      })
    })
    it("should return an error for a missing items value for an array schema in Swagger 2", () => {
      const spec = {
        swagger: "2.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  name: "myParam",
                  in: "query",
                  type: "array"
                }
              ]
            }
          }
        }
      }

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        const firstError = allErrors[0]
        expect(allErrors.length).toEqual(1)
        expect(firstError.message).toEqual("Schemas with 'type: array', require a sibling 'items: ' field")
        expect(firstError.path).toEqual(["paths", "/pets", "get", "parameters", "0"])
      })
    })
    it("should return an error for a missing items value for an array schema in OpenAPI 3", () => {
      const spec = {
        openapi: "3.0.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  name: "myParam",
                  in: "query",
                  schema: {
                    type: "array"
                  }
                },
              ]
            }
          }
        }
      }

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        const firstError = allErrors[0]
        expect(allErrors.length).toEqual(1)
        expect(firstError.path).toEqual(["paths", "/pets", "get", "parameters", "0", "schema"])
        expect(firstError.message).toEqual("Schemas with 'type: array', require a sibling 'items: ' field")
      })
    })
    it("should not return an error for a missing items value for a non-array schema in Swagger 2", () => {
      const spec = {
        swagger: "2.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  name: "myParam",
                  in: "query",
                  type: "object"
                }
              ]
            }
          }
        }
      }

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        expect(allErrors.length).toEqual(0)
      })
    })
    it("should not return an error for a missing items value for a non-array schema in OpenAPI 3", () => {
      const spec = {
        openapi: "3.0.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  name: "myParam",
                  in: "query",
                  schema: {
                    type: "object"
                  }
                },
              ]
            }
          }
        }
      }

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        expect(allErrors.length).toEqual(0)
      })
    })
  })
})
