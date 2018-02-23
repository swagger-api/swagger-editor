/* eslint-env mocha */
import expect from "expect"
import validateHelper, { expectNoErrors } from "./validate-helper.js"

describe("validation plugin - semantic - paths", function(){
  this.timeout(10 * 1000)

  describe("Path parameter definitions need matching paramater declarations", function(){

    it("should not return problems for a valid path-level definiton/declaration pair", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path",
              description: "An id",
              required: true
            }]
          }
        }
      }

      return expectNoErrors(spec)
    })

    it("should not return problems for a valid path-level definiton/declaration pair using a $ref", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [
              { $ref: "#/parameters/id" }
            ]
          }
        },
        parameters: {
          id: {
            name: "id",
            in: "path",
            description: "An id",
            required: true
          }
        }
      }

      return expectNoErrors(spec)
    })

    it("should not return problems for a valid operation-level definiton/declaration pair", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            get: {
              parameters: [{
                name: "id",
                in: "path",
                description: "An id",
                required: true
              }]
            }
          }
        }
      }

      return expectNoErrors(spec)
    })

    it("should return one problem for a path parameter defined at the operation level that is not present within every operation on the path", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            get: {
              parameters: [{
                name: "id",
                in: "path",
                description: "An id",
                required: true
              }]
            },
            post: {
              description: "the path parameter definition is missing here"
            },
            delete: {
              description: "the path parameter definition is missing here"
            }
          }
        }
      }

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          const firstError = allErrors[0]
          expect(allErrors.length).toEqual(1)
          expect(firstError.message).toEqual( `Declared path parameter \"id\" needs to be defined within every operation in the path (missing in "post", "delete"), or moved to the path-level parameters object`)
          expect(firstError.path).toEqual(["paths", "/CoolPath/{id}"])
        })
    })

    it("should return one problem when the definition is completely absent", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: []
          }
        }
      }

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          const firstError = allErrors[0]
          expect(allErrors.length).toEqual(1)
          expect(firstError.message).toEqual( "Declared path parameter \"id\" needs to be defined as a path parameter at either the path or operation level")
          expect(firstError.path).toEqual(["paths", "/CoolPath/{id}"])
        })

    })

    it("should return one error when no parameters are defined", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {}
        }
      }

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          const firstError = allErrors[0]
          expect(allErrors.length).toEqual(1)
          expect(firstError.message).toEqual( "Declared path parameter \"id\" needs to be defined as a path parameter at either the path or operation level")
          expect(firstError.path).toEqual(["paths", "/CoolPath/{id}"])
        })

    })

    it("should return one problem for a missed 'in' value", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [{
              name: "id",
              // in: "path",
              description: "An id"
            }]
          }
        }
      }

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          const firstError = allErrors[0]
          expect(allErrors.length).toEqual(1)
          expect(firstError.message).toEqual( "Declared path parameter \"id\" needs to be defined as a path parameter at either the path or operation level")
          expect(firstError.path).toEqual(["paths", "/CoolPath/{id}"])
        })
    })

  })

  describe("Empty path templates are not allowed", () => {

    it("should return one problem for an empty path template", function(){
      const spec = {
        paths: {
          "/CoolPath/{}": {}
        }
      }

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          const firstError = allErrors[0]
          expect(allErrors.length).toEqual(1)
          expect(firstError.message).toEqual( "Empty path parameter declarations are not valid")
          expect(firstError.path).toEqual(["paths", "/CoolPath/{}"])
        })
    })

  })

  describe("Path parameters declared in the path string need matching definitions", () => {

    it("should return one problem for an undefined declared path parameter", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {}
        }
      }

      return validateHelper(spec)
        .then( system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors.length).toEqual(1)
          const firstError = allErrors[0]
          expect(firstError.message).toEqual( "Declared path parameter \"id\" needs to be defined as a path parameter at either the path or operation level")
          expect(firstError.path).toEqual(["paths", "/CoolPath/{id}"])
        })
    })

    it("should return one problem for an path parameter defined in another path", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {},
          "/UncoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path",
              required: true
            }]
          }
        }
      }

      return validateHelper(spec)
        .then( system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors.length).toEqual(1)
          const firstError = allErrors[0]
          expect(firstError.message).toEqual("Declared path parameter \"id\" needs to be defined as a path parameter at either the path or operation level")
          expect(firstError.path).toEqual(["paths", "/CoolPath/{id}"])
        })
    })

    it("should return no problems for a path parameter defined in the path", function(){
      const spec = {
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

    it("should return no problems for a path parameter defined in an operation", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            get: {
              parameters: [{
                name: "id",
                in: "path",
                required: true
              }]
            }
          }
        }
      }

      return expectNoErrors(spec)
    })

  })

  describe("Path strings must be equivalently different", () => {

    it("should return one problem for an equivalent templated path strings", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path",
              required: true
            }]
          },
          "/CoolPath/{count}": {
            parameters: [{
              name: "count",
              in: "path",
              required: true
            }]
          }
        }
      }

      return validateHelper(spec)
        .then( system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors.length).toEqual(1)
          const firstError = allErrors[0]
          expect(firstError.message).toEqual("Equivalent paths are not allowed.")
          expect(firstError.path).toEqual(["paths", "/CoolPath/{count}"])
        })
    })

    it("should return no problems for a templated and untemplated pair of path strings", function(){
      const spec = {
        paths: {
          "/CoolPath/": {},
          "/CoolPath/{count}": {
            parameters: [{
              name: "count",
              in: "path",
              required: true
            }]
          }
        }
      }

      return expectNoErrors(spec)
    })

    it("should return no problems for a templated and double-templated set of path strings", function(){
      const spec = {
        paths: {
          "/CoolPath/{group_id1}/all": {
            parameters: [{
              name: "group_id1",
              in: "path",
              required: true
            }]
          },
          "/CoolPath/{group_id2}/{user_id2}": {
            parameters: [
              {
                name: "group_id2",
                in: "path",
                required: true
              },
              {
                name: "user_id2",
                in: "path",
                required: true
              },
            ]
          },
        }
      }

      return expectNoErrors(spec)
    })

  })

  describe("Paths must have unique name + in parameters", () => {
    it("should return no problems for a name collision only", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [
              {
                name: "id",
                in: "path",
                required: true
              },
              {
                name: "id",
                in: "query"
              }
            ]
          }
        }
      }

      return expectNoErrors(spec)
    })

    it("should return no problems when 'in' is not defined", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [
              {
                name: "id",
                in: "path",
                required: true
              },
              {
                name: "id",
                // in: "path"
              }
            ]
          }
        }
      }

      return expectNoErrors(spec)
    })

  })

  describe("Paths cannot have query strings in them", () => {

    it("should return one problem for an stray '?' in a path string", function(){
      const spec = {
        paths: {
          "/report?": {

          }
        }
      }

      return validateHelper(spec)
        .then( system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors.length).toEqual(1)
          const firstError = allErrors[0]
          expect(firstError.message).toEqual("Query strings in paths are not allowed.")
          expect(firstError.path).toEqual(["paths", "/report?"])
        })
    })

    it("should return no problems for a correct path template", function(){
      const spec = {
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

  describe("Integrations", () => {
    it.skip("should return two problems for an equivalent path string missing a parameter definition", function(){
      // const spec = {
      //   paths: {
      //     "/CoolPath/{id}": {
      //       parameters: [{
      //         name: "id",
      //         in: "path"
      //       }]
      //     },
      //     "/CoolPath/{count}": {}
      //   }
      // }
      //
      // let res = validate({ resolvedSpec: spec })
      // expect(res.errors).toEqual([
      //   {
      //     message: "Equivalent paths are not allowed.",
      //     path: "paths./CoolPath/{count}"
      //   },
      //   {
      //     message: "Declared path parameter \"count\" needs to be defined as a path parameter at either the path or operation level",
      //     path: "paths./CoolPath/{count}"
      //   }
      // ])
      // expect(res.warnings).toEqual([])
    })

  })
})
