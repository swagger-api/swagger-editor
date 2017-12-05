/* eslint-env mocha */
import expect from "expect"
import validateHelper from "./validate-helper.js"

describe.skip("validation plugin - semantic - form data", function(){
  this.timeout(10 * 1000)

  describe("/parameters/...", function(){

    describe("typo in formdata", function(){
      it("should warn about formdata ( typo )", function(){

        const spec = {
          parameters: {
            CoolParam: [
              { in: "formdata" },
            ]
          },
          paths: {
            "/some": {
              post: {
                parameters: [
                  { in: "formdata" },
                ]
              }
            }
          }
        }

        return validateHelper(spec)
          .then( system => {
            const allErrors = system.errSelectors.allErrors().toJS()
            expect(allErrors).toEqual([ {
              message: "Parameter \"in: formdata\" is invalid, did you mean \"in: formData\" ( camelCase )?",
              path: "parameters.CoolParam.0",
            }])
          })
      })
    })
  })

  describe("missing consumes", function(){
    it("should complain if 'type:file` and no 'in: formData", function(){
      const spec = {
        paths: {
          "/some": {
            post: {
              consumes: ["multipart/form-data"],
              parameters: [
                {
                  type: "file",
                },
              ]
            }
          }
        }
      }
      validateHelper(spec)
        .then( system => {
          expect(res.errors).toEqual([ {
            message: "Parameters with \"type: file\" must have \"in: formData\"",
            path: "paths./some.post.parameters.0",
          }])
        })

      let res = validate({ resolvedSpec: spec })
    })

    it("should complain if 'type:file` and no consumes - 'multipart/form-data'", function(){
      const spec = {
        paths: {
          "/some": {
            post: {
              parameters: [
                {
                    in: "formData",
                  type: "file",
                },
              ]
            }
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([ {
        message: "Operations with Parameters of \"type: file\" must include \"multipart/form-data\" in their \"consumes\" property",
        path: "paths./some.post.parameters.0",
      }])
    })

    it("should complain if 'in:formData` and no consumes - 'multipart/form-data' or 'application/x-www-form-urlencoded'", function(){
      const spec = {
        paths: {
          "/some": {
            post: {
              parameters: [
                {
                    in: "formData",
                },
              ]
            }
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([ {
        message: "Operations with Parameters of \"in: formData\" must include \"application/x-www-form-urlencoded\" or \"multipart/form-data\" in their \"consumes\" property",
        path: "paths./some.post",
      }])
    })

  })

  describe("/pathitems/...", function(){

    // Already covered in validators/operations.js
    it("should complain about having both in the same parameter", function(){
      const spec = {
        pathitems: {
          CoolPathItem: {
            parameters: [
              { in: "formData" },
              { in: "body" },
            ]
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([ {
        message: "Parameters cannot have both a \"in: body\" and \"in: formData\", as \"formData\" _will_ be the body",
        path: "pathitems.CoolPathItem.parameters.1",
      }])
    })
    it("should complain if 'type:file` and no 'in: formData", function(){
      const spec = {
        pathitems: {
          "SomePathItem": {
            consumes: ["multipart/form-data"],
            parameters: [
              {
                type: "file",
              },
            ]
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([ {
        message: "Parameters with \"type: file\" must have \"in: formData\"",
        path: "pathitems.SomePathItem.parameters.0",
      }])
    })

    it("should complain if 'type:file` and no consumes - 'multipart/form-data'", function(){
      const spec = {
        pathitems: {
          SomePathItem: {
            parameters: [
              {
                in: "formData",
                type: "file",
              },
            ]
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors).toEqual([ {
        message: "Operations with Parameters of \"type: file\" must include \"multipart/form-data\" in their \"consumes\" property",
        path: "pathitems.SomePathItem.parameters.0",
      }])
    })
  })
})
