import expect from "expect"
import validateHelper, { expectNoErrorsOrWarnings } from "../validate-helper.js"

describe("validation plugin - semantic - 2and3 refs", function() {
  this.timeout(10 * 1000)
  describe("Ref siblings", () => {

    it("should return a warning when another property is a sibling of a $ref in OpenAPI 3", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/CoolPath": {
            get: {
              $ref: "#/components/schemas/abc",
              description: "My very cool get"
            }
          }
        },
        components: {
          schemas: {
            abc: {}
          }
        }
      }

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        expect(allErrors.length).toEqual(1)
        const firstError = allErrors[0]
        expect(firstError.message).toMatch("Sibling values are not allowed alongside $refs")
        expect(firstError.level).toEqual("warning")
        expect(firstError.path).toEqual(["paths", "/CoolPath", "get", "description"])
      })
    })
    it("should return a warning when another property is a sibling of a $ref in Swagger 2", () => {
      const spec = {
        swagger: "2.0",
        paths: {
          "/CoolPath": {
            get: {
              $ref: "#/definitions/abc",
              description: "My very cool get"
            }
          }
        },
        definitions: {
          abc: {}
        }
      }

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        expect(allErrors.length).toEqual(1)
        const firstError = allErrors[0]
        expect(firstError.message).toMatch("Sibling values are not allowed alongside $refs")
        expect(firstError.level).toEqual("warning")
        expect(firstError.path).toEqual(["paths", "/CoolPath", "get", "description"])
      })
    })

    it("should return no warnings when a $ref has no siblings in OpenAPI 3", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/CoolPath": {
            get: {
              $ref: "#/components/schemas/abc"
            }
          }
        },
        components: {
          schemas: {
            abc: {}
          }
        }
      }

      return expectNoErrorsOrWarnings(spec)
    })
    it("should return no warnings when a $ref has no siblings in Swagger 2", () => {
      const spec = {
        swagger: "2.0",
        paths: {
          "/CoolPath": {
            get: {
              $ref: "#/definitions/abc"
            }
          }
        },
        definitions: {
          abc: {}
        }
      }

      return expectNoErrorsOrWarnings(spec)
    })

  })
})
