import expect from "expect"
import validateHelper, { expectNoErrorsOrWarnings } from "../validate-helper.js"

describe("validation plugin - semantic - oas3 refs", function() {
  this.timeout(10 * 1000)
  describe("Ref siblings", () => {

    it("should return a warning when another property is a sibling of a $ref", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/CoolPath": {
            schema: {
              $ref: "#/components/schemas/abc",
              description: "My very cool schema"
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
        expect(firstError.path).toEqual(["paths", "/CoolPath", "schema", "description"])
      })
    })

    it("should return no warnings when a $ref has no siblings", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/CoolPath": {
            schema: {
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
