import expect from "expect"

import validateHelper, { expectNoErrors } from "./validate-helper.js"

describe("validation plugin - semantic - operations", () => {
  describe("Operations must have unique (name + in combination) parameters", () => {

  })

  describe("Operations must have unique operationIds", () => {
    it("should return an error when operationId collisions exist", () => {
      const spec = {
        swagger: "2.0",
        paths: {
          "/": {
            get: {
              operationId: "myId"
            },
            post: {
              operationId: "myId"
            }
          }
        }
      }

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          const firstError = allErrors[0]
          expect(allErrors.length).toEqual(1)
          expect(firstError.message).toEqual(`Operations must have unique operationIds.`)
          expect(firstError.path).toEqual(["paths", "/", "post", "operationId"])
        })
    })
    it("should not return an error when operationId collisions don't exist", () => {
      const spec = {
        swagger: "2.0",
        paths: {
          "/": {
            get: {
              operationId: "myId1"
            },
            post: {
              operationId: "myId2"
            }
          }
        }
      }

      return expectNoErrors(spec)
    })
  })
})
