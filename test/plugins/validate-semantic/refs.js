import expect from "expect"
import validateHelper, { expectNoErrorsOrWarnings } from "./validate-helper.js"

describe("validation plugin - semantic - refs", function() {
  this.timeout(10 * 1000)
  describe("Ref siblings", () => {

    it("should return a warning when another property is a sibling of a $ref", () => {
      const spec = {
        paths: {
          "/CoolPath": {
            schema: {
              $ref: "#/definitions/abc",
              description: "My very cool schema"
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
        expect(firstError.path).toEqual(["paths", "/CoolPath", "schema", "description"])
      })
    })

  })

  describe("Unused definitions", () => {

    it("should return a warning when a definition is declared but not used", () => {
      const spec = {
        paths: {
          "/CoolPath": {}
        },
        definitions: {
          abc: {
            type: "string"
          }
        }
      }

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        expect(allErrors.length).toEqual(1)
        const firstError = allErrors[0]
        expect(firstError.message).toMatch("Definition was declared but never used in document")
        expect(firstError.level).toEqual("warning")
        expect(firstError.path).toEqual(["definitions", "abc"])
      })
    })

    it("should not return a warning when a definition with special character is declared and used", () => {
      const spec = {
        paths: {
          "/CoolPath": {
            get: {
              responses: {
                200: {
                  schema: {
                    $ref: "#/definitions/x~1Foo"
                  }
                },
                400: {
                  schema: {
                    $ref: "#/definitions/x~0Bar"
                  }
                }
              }
            }
          }
        },
        definitions: {
          "x/Foo": {
            type: "object"
          },
          "x~Bar": {
            type: "object"
          }
        }
      }

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        expect(allErrors.length).toEqual(0)
      })
    })

  })
  describe("Malformed $ref values", () => {
    it("should return an error when a JSON pointer lacks a leading `#/`", () => {
      const spec = {
        paths: {
          "/CoolPath": {
            $ref: "#myObj/abc"
          }
        },
        myObj: {
          abc: {
            type: "string"
          }
        }
      }

      return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        expect(allErrors.length).toEqual(1)
        const firstError = allErrors[0]
        expect(firstError.message).toMatch("$ref paths must begin with `#/`")
        expect(firstError.level).toEqual("error")
        expect(firstError.path).toEqual(["paths", "/CoolPath", "$ref"])
      })
    })

    it("should return no errors when a JSON pointer is a well-formed remote reference", () => {
      const spec = {
        paths: {
          "/CoolPath": {
            $ref: "http://google.com#/myObj/abc"
          }
        },
        myObj: {
          abc: {
            type: "string"
          }
        }
      }

      return validateHelper(spec)
      .then(system => {
        const allSemanticErrors = system.errSelectors.allErrors().toJS()
          .filter(err => err.source !== "resolver")
        expect(allSemanticErrors).toEqual([])
      })
    })

  })
  describe.skip("Refs are restricted in specific areas of a spec", () => {
    describe("Response $refs", () => {
      it("should return a problem for a parameters $ref in a response position", function(){
        const spec = {
          paths: {
            "/CoolPath": {
              responses: {
                "200": {
                  $ref: "#/parameters/abc"
                }
              }
            }
          }
        }

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors.length).toEqual(1)
          const firstError = allErrors[0]
          expect(firstError.path).toEqual(["paths", "/CoolPath", "responses", "200", "$ref"])
          // expect(firstError.message).toMatch("")
        })
      })

      // FIXME: This poses a problem for our newer validation PR, as it only iterates over the resolved spec.
      // We can look for $$refs, but that may be too fragile.
      // PS: We have a flag in mapSpec, that adds $$refs known as metaPatches
      it("should return a problem for a definitions $ref in a response position", function(){
        const spec = {
          paths: {
            "/CoolPath": {
              schema: {
                $ref: "#/responses/abc"
              }
            }
          }
        }

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          const firstError = allErrors[0]
          expect(allErrors.length).toEqual(1)
          expect(firstError.path).toEqual(["paths", "/CoolPath", "responses", "200", "$ref"])
          expect(firstError.message).toEqual(`Response references are not allowed within schemas`)
        })
      })

      it("should not return a problem for a responses $ref in a response position", function(){
        const spec = {
          paths: {
            "/CoolPath": {
              responses: {
                "200": {
                  $ref: "#/responses/abc"
                }
              }
            }
          }
        }

        return expectNoErrorsOrWarnings(spec)
      })
    })
    describe("Schema $refs", () => {
      // See note on resolved vs raw spec
      it("should return a problem for a parameters $ref in a schema position", function(){
        // const spec = {
        //   paths: {
        //     "/CoolPath": {
        //       schema: {
        //         $ref: "#/parameters/abc"
        //       }
        //     }
        //   }
        // }

        // let res = validate({ jsSpec: spec })
        // expect(res.errors.length).toEqual(1)
        // expect(res.errors[0].path).toEqual(["paths", "/CoolPath", "schema", "$ref"])
        // expect(res.warnings.length).toEqual(0)
      })

      it("should return a problem for a responses $ref in a schema position", function(){
        // const spec = {
        //   paths: {
        //     "/CoolPath": {
        //       schema: {
        //         $ref: "#/responses/abc"
        //       }
        //     }
        //   }
        // }
        //
        // let res = validate({ jsSpec: spec })
        // expect(res.errors.length).toEqual(1)
        // expect(res.errors[0].path).toEqual(["paths", "/CoolPath", "schema", "$ref"])
        // expect(res.warnings.length).toEqual(0)
      })

      it("should not return a problem for a definition $ref in a schema position", function(){
        const spec = {
          paths: {
            "/CoolPath": {
              schema: {
                $ref: "#/definition/abc"
              }
            }
          }
        }

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors.length).toEqual(0)
        })
      })

      it("should not return a problem for a schema property named 'properties'", function(){
        // #492 regression
        const spec = {
          "definitions": {
            "ServicePlan": {
              "description": "New Plan to be added to a service.",
              "properties": {
                "plan_id": {
                  "type": "string",
                  "description": "ID of the new plan from the catalog."
                },
                "parameters": {
                  "$ref": "#/definitions/Parameter"
                },
                "previous_values": {
                  "$ref": "#/definitions/PreviousValues"
                }
              }
            }
          }
        }

        return validateHelper(spec)
        .then(system => {
          let allErrors = system.errSelectors.allErrors().toJS()
          allErrors = allErrors.filter(a => a.level != "warning")
          expect(allErrors.length).toEqual(0)
        })
      })
    })
    describe("Parameter $refs", () => {

      it("should return a problem for a definition $ref in a parameter position", function(){
        const spec = {
          paths: {
            "/CoolPath": {
              parameters: [{
                $ref: "#/definitions/abc"
              }]
            }
          }
        }

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors.length).toEqual(1)
          const firstError = allErrors[0]
          expect(firstError.path).toEqual(["paths", "/CoolPath", "parameters", "0", "$ref"])
          expect(firstError.message).toMatch("")
        })
      })

      it("should return a problem for a responses $ref in a parameter position", function(){
        const spec = {
          paths: {
            "/CoolPath": {
              parameters: [{
                $ref: "#/responses/abc"
              }]
            }
          }
        }

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors.length).toEqual(1)
          const firstError = allErrors[0]
          expect(firstError.path).toEqual(["paths", "/CoolPath", "parameters", "0", "$ref"])
          expect(firstError.message).toMatch("")
        })
      })

      it("should not return a problem for a parameter $ref in a parameter position", function(){
        const spec = {
          paths: {
            "/CoolPath": {
              parameters: [{
                $ref: "#/parameters/abc"
              }]
            }
          }
        }

        return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors.length).toEqual(0)
        })
      })
    })
  })
})
