/* eslint-env mocha */
import expect from "expect"
import { validate } from "plugins/validation/semantic-validators/validators/paths"

describe("validation plugin - semantic - paths", function(){

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

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([])
      expect(res.warnings).toEqual([])
    })

    it("should return one problem when the definition is absent", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: []
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

    it("should return one error when no parameters are defined", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {}
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([{
        message: "Declared path parameter \"id\" needs to be defined as a path parameter at either the path or operation level",
        path: "paths./CoolPath/{id}"
      }])
      expect(res.warnings).toEqual([])
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

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([{
        message: "Declared path parameter \"id\" needs to be defined as a path parameter at either the path or operation level",
        path: "paths./CoolPath/{id}"
      }])
      expect(res.warnings).toEqual([])
    })

  })

  describe("Empty path templates are not allowed", () => {

    it("should return one problem for an empty path template", function(){
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

    it("should return one problem for an undefined declared path parameter", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {}
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([{
        message: "Declared path parameter \"id\" needs to be defined as a path parameter at either the path or operation level",
        path: "paths./CoolPath/{id}"
      }])
      expect(res.warnings).toEqual([])
    })

    it("should return one problem for an path parameter defined in another path", function(){
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

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([])
      expect(res.warnings).toEqual([])
    })

    it("should return no problems for an path parameter defined in an operation", function(){
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            get: {
              parameters: [{
                name: "id",
                in: "path"
              }]
            }
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([])
      expect(res.warnings).toEqual([])
    })

  })

  describe("Path strings must be equivalently different", () => {

    it("should return one problem for an equivalent templated path strings", function(){
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

    it("should return no problems for a templated and untemplated pair of path strings", function(){
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

  })

  describe("Paths must have unique name + in parameters", () => {

    it("should return one problem for an name + in collision", function(){
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

  describe("Paths cannot have partial templates", () => {

    it("should return one problem for an illegal partial path template", function(){
      const spec = {
        paths: {
          "/CoolPath/user{id}": {
            parameters: [{
              name: "id",
              in: "path"
            }]
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([{
        message: "Partial path templating is not allowed.",
        path: "paths./CoolPath/user{id}"
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


    it("should return two problems for an illegal query string in a path string", function(){
      const spec = {
        paths: {
          "/report?rdate={relative_date}": {
            parameters: [{
              name: "relative_date",
              in: "path"
            }]
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([
        {
          message: "Partial path templating is not allowed.",
          path: "paths./report?rdate={relative_date}"
        },
        {
          message: "Query strings in paths are not allowed.",
          path: "paths./report?rdate={relative_date}"
        }
      ])
      expect(res.warnings).toEqual([])
    })

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
