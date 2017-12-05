import expect from "expect"
import validateHelper from "./validate-helper.js"

describe("validation plugin - semantic - parameters", function() {
  this.timeout(10 * 1000 ) // For swagger-ui startup

  it("should return an error when an array type parameter omits an `items` property", () => {
    const spec = {
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                "name": "tags",
                "in": "query",
                "description": "tags to filter by",
                "type": "array"
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
          expect(firstError.path).toEqual(["paths", "/pets", "get", "parameters", "0"])
          expect(firstError.message).toMatch(/.*type.*array.*require.*items/)
        })
  })

  it.skip("should return an error when a non-body parameter omits an `type` property", () => {
    const spec = {
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                "name": "tags",
                "in": "query",
                "description": "tags to filter by"
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
          expect(firstError.path).toEqual(["paths", "/pets", "get", "parameters", "0"])
          expect(firstError.message).toMatch(/.*type.*array.*require.*items/)
        })

  })

  it("should not return an error when a body parameter omits an `type` property", () => {
    const spec = {
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                "name": "tags",
                "in": "body",
                "description": "tags to filter by"
              }
            ]
          }
        }
      }
    }

    return validateHelper(spec)
        .then(system => {
          expect(system.errSelectors.allErrors().count()).toEqual(0)
        })
  })
})
