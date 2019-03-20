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

    describe("Path parameter definitions need matching paramater declarations", function(){
      describe("OpenAPI 3", () => {
        it("should not return problems for a valid path-level definiton/declaration pair", function(){
          const spec = {
            openapi: "3.0.0",
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
            openapi: "3.0.0",
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
            openapi: "3.0.0",
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
            openapi: "3.0.0",
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
            openapi: "3.0.0",
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
            openapi: "3.0.0",
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
            openapi: "3.0.0",
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

      describe("Swagger 2", () => {
        it("should not return problems for a valid path-level definiton/declaration pair", function(){
          const spec = {
            swagger: "2.0",
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
            swagger: "2.0",
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
            swagger: "2.0",
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
            swagger: "2.0",
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
            swagger: "2.0",
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
            swagger: "2.0",
            info: {
              title: "test",
              version: "1.0.0"
            },
            paths: {
              "/{12345instanceABCDE_instance_12345}": {
                get: {
                  responses: {
                    "200": {
                      description: "ok"
                    }
                  }
                }
              }
            }
          }

          return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS()
            const firstError = allErrors[0]
            expect(allErrors.length).toEqual(1)
            expect(firstError.message).toEqual( "Declared path parameter \"12345instanceABCDE_instance_12345\" needs to be defined as a path parameter at either the path or operation level")
            expect(firstError.path).toEqual(["paths", "/{12345instanceABCDE_instance_12345}"])
          })

        })

        it("should return a well-formed error when ", function(){
          const spec = {
            swagger: "2.0",
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

        it.skip("should return one problem for a missed 'in' value", function(){
          const spec = {
            swagger: "2.0",
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

    })
})
