/* eslint-env mocha */
import expect from "expect"
import validateHelper, { expectNoErrors } from "../validate-helper.js"

describe("validation plugin - semantic - 2and3 paths", () => {
  describe("Paths cannot have query strings in them", () => {
    it("should return one problem for an stray '?' in a Swagger 2 path string", function(){
      const spec = {
        swagger: "2.0",
        paths: {
          "/report?asdf=123": {

          }
        }
      }

      return validateHelper(spec)
      .then( system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        expect(allErrors.length).toEqual(1)
        const firstError = allErrors[0]
        expect(firstError.message).toEqual("Query strings in paths are not allowed.")
        expect(firstError.path).toEqual(["paths", "/report?asdf=123"])
      })
    })
    it("should return one problem for an stray '?' in an OpenAPI 3 path string", function(){
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/report?asdf=123": {

          }
        }
      }

      return validateHelper(spec)
      .then( system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        expect(allErrors.length).toEqual(1)
        const firstError = allErrors[0]
        expect(firstError.message).toEqual("Query strings in paths are not allowed.")
        expect(firstError.path).toEqual(["paths", "/report?asdf=123"])
      })
    })
    it("should return no problems for a correct Swagger 2 path template", function(){
      const spec = {
        swagger: "2.0",
        paths: {
          "/CoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path",
              required: true
            }]
          }
        }
      }

      return expectNoErrors(spec)
    })
    it("should return no problems for a correct OpenAPI 3 path template", function(){
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/CoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path",
              required: true
            }]
          }
        }
      }

      return expectNoErrors(spec)
    })
  })
})
