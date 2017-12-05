/* eslint-env mocha */
import expect from "expect"
import validateHelper from "./validate-helper.js"

describe.skip("validation plugin - semantic - paths", function(){
  this.timeout(10 * 1000)

  describe("Path parameter definitions need matching paramater declarations", function(){

    it("should not return problems for a valid definiton/declaration pair", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path",
              description: "An id"
            }]
          }
        }
      }

      return validateHelper(spec)
        .then(system => {
          expect(system.errSelectors.allErrors().count()).toEqual(0)
        })

    })

    it.skip("should return one problem when the definition is absent", function(){
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
          expect(allErrors.length).toEqual(0)
          expect(allErrors.message).toEqual( "Declared path parameter \"id\" needs to be defined as a path parameter at either the path or operation level")
          expect(allErrors.path).toEqual(["paths", "CoolPath", "{id}"])
        })

    })

    it.skip("should return one error when no parameters are defined", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {}
        }
      }

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors.length).toEqual(0)
          expect(allErrors.message).toEqual( "Declared path parameter \"id\" needs to be defined as a path parameter at either the path or operation level")
          expect(allErrors.path).toEqual(["paths", "CoolPath", "{id}"])
        })

    })

    it.skip("should return one problem for a missed 'in' value", function(){
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
          expect(allErrors.length).toEqual(0)
          expect(allErrors.message).toEqual( "Declared path parameter \"id\" needs to be defined as a path parameter at either the path or operation level")
          expect(allErrors.path).toEqual(["paths", "CoolPath", "{id}"])
        })
    })

  })

  describe("Empty path templates are not allowed", () => {

    it.skip("should return one problem for an empty path template", function(){
      const spec = {
        paths: {
          "/CoolPath/{}": {}
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([{
        message: "Empty path parameter declarations are not valid",
        path: "paths./CoolPath/{}"
      }])
      expect(res.warnings).toEqual([])
    })

  })

  describe("Path parameters declared in the path string need matching definitions", () => {

    it.skip("should return one problem for an undefined declared path parameter", function(){
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
            expect(firstError.path).toEqual(["paths", "CoolPath", "{id}"])
          })
    })

    it.skip("should return one problem for an path parameter defined in another path", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {},
          "/UncoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path"
            }]
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([{
        message: "Declared path parameter \"id\" needs to be defined as a path parameter at either the path or operation level",
        path: "paths./CoolPath/{id}"
      }])
      expect(res.warnings).toEqual([])
    })

    it("should return no problems for an path parameter defined in the path", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path"
            }]
          }
        }
      }

      return validateHelper(spec)
        .then( system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors.length).toEqual(0)
        })
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

      return validateHelper(spec)
        .then( system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors).toEqual(0)
        })
    })

  })

  describe("Path strings must be equivalently different", () => {

    it.skip("should return one problem for an equivalent templated path strings", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path"
            }]
          },
          "/CoolPath/{count}": {
            parameters: [{
              name: "count",
              in: "path"
            }]
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([{
        message: "Equivalent paths are not allowed.",
        path: "paths./CoolPath/{count}"
      }])
      expect(res.warnings).toEqual([])
    })

    it.skip("should return no problems for a templated and untemplated pair of path strings", function(){
      const spec = {
        paths: {
          "/CoolPath/": {},
          "/CoolPath/{count}": {
            parameters: [{
              name: "count",
              in: "path"
            }]
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([])
      expect(res.warnings).toEqual([])
    })

    it("should return no problems for a templated and double-templated set of path strings", function(){
      const spec = {
        paths: {
          "/CoolPath/{group_id}/all": {
            parameters: [{
              name: "group_id",
              in: "path"
            }]
          },
          "/CoolPath/{group_id}/{user_id}": {
            parameters: [
              {
                name: "group_id",
                in: "path"
              },
              {
                name: "user_id",
                in: "path"
              },
            ]
          },
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([])
      expect(res.warnings).toEqual([])
    })

  })

  describe("Paths must have unique name + in parameters", () => {
    it("should return no problems for an name collision only", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [
              {
                name: "id",
                in: "path"
              },
              {
                name: "id",
                in: "query"
              }
            ]
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([])
      expect(res.warnings).toEqual([])
    })

    it("should return no problems when 'in' is not defined", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [
              {
                name: "id",
                in: "path"
              },
              {
                name: "id",
                // in: "path"
              }
            ]
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([])
      expect(res.warnings).toEqual([])
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

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([{
        message: "Query strings in paths are not allowed.",
        path: "paths./report?"
      }])
      expect(res.warnings).toEqual([])
    })

    it("should return no problems for a correct path template", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path"
            }]
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([])
      expect(res.warnings).toEqual([])
    })

  })

  describe("Integrations", () => {
    it.skip("should return two problems for an equivalent path string missing a parameter definition", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path"
            }]
          },
          "/CoolPath/{count}": {}
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([
        {
          message: "Equivalent paths are not allowed.",
          path: "paths./CoolPath/{count}"
        },
        {
          message: "Declared path parameter \"count\" needs to be defined as a path parameter at either the path or operation level",
          path: "paths./CoolPath/{count}"
        }
      ])
      expect(res.warnings).toEqual([])
    })

  })
})
