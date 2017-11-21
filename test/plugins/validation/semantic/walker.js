import expect from "expect"
import { validate } from "plugins/validation/semantic-validators/validators/walker"

describe("validation plugin - semantic - spec walker", () => {
  describe("Type key", () => {
    it("should return an error when \"type\" is an array", () => {
      const spec = {
        paths: {
          "/CoolPath/{id}": {
            responses: {
              "200": {
                schema: {
                  type: ["number", "string"]
                }
              }
            }
          }
        }
      }

      let res = validate({ jsSpec: spec })
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].path).toEqual(["paths", "/CoolPath/{id}", "responses", "200", "schema", "type"])
      expect(res.errors[0].message).toEqual("\"type\" should be a string")
      expect(res.warnings.length).toEqual(0)
    })

    it("should not return an error when \"type\" is a property name", () => {
      const spec = {
        "definitions": {
          "ApiResponse": {
            "type": "object",
            "properties": {
              "code": {
                "type": "integer",
                "format": "int32"
              },
              "type": {
                "type": "string"
              },
              "message": {
                "type": "string"
              }
            }
          }
        }
      }

      let res = validate({ jsSpec: spec })
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(0)
    })

    it("should not return an error when \"type\" is a model name", () => {
      const spec = {
        "definitions": {
          "type": {
            "type": "object",
            "properties": {
              "code": {
                "type": "integer",
                "format": "int32"
              },
              "message": {
                "type": "string"
              }
            }
          }
        }
      }

      let res = validate({ jsSpec: spec })
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(0)
    })

  })

  describe("Minimums and maximums", () => {

    it("should return an error when minimum is more than maximum", () => {
      const spec = {
        definitions: {
          MyNumber: {
            minimum: "5",
            maximum: "2"
          }
        }
      }

      let res = validate({ jsSpec: spec })
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].path).toEqual(["definitions", "MyNumber", "minimum"])
      expect(res.errors[0].message).toEqual("Minimum cannot be more than maximum")
      expect(res.warnings.length).toEqual(0)
    })

    it("should not return an error when minimum is less than maximum", () => {
      const spec = {
        definitions: {
          MyNumber: {
            minimum: "1",
            maximum: "2"
          }
        }
      }

      let res = validate({ jsSpec: spec })
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(0)
    })

    it("should return an error when minProperties is more than maxProperties", () => {
      const spec = {
        definitions: {
          MyNumber: {
            minProperties: "5",
            maxProperties: "2"
          }
        }
      }

      let res = validate({ jsSpec: spec })
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].path).toEqual(["definitions", "MyNumber", "minProperties"])
      expect(res.errors[0].message).toEqual("minProperties cannot be more than maxProperties")
      expect(res.warnings.length).toEqual(0)
    })

    it("should not return an error when minProperties is less than maxProperties", () => {
      const spec = {
        definitions: {
          MyNumber: {
            minProperties: "1",
            maxProperties: "2"
          }
        }
      }

      let res = validate({ jsSpec: spec })
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(0)
    })

    it("should return an error when minLength is more than maxLength", () => {
      const spec = {
        definitions: {
          MyNumber: {
            minLength: "5",
            maxLength: "2"
          }
        }
      }

      let res = validate({ jsSpec: spec })
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].path).toEqual(["definitions", "MyNumber", "minLength"])
      expect(res.errors[0].message).toEqual("minLength cannot be more than maxLength")
      expect(res.warnings.length).toEqual(0)
    })

    it("should not return an error when minLength is less than maxLength", () => {
      const spec = {
        definitions: {
          MyNumber: {
            minLength: "1",
            maxLength: "2"
          }
        }
      }

      let res = validate({ jsSpec: spec })
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(0)
    })

  })

  describe("Refs are restricted in specific areas of a spec", () => {

    describe("Response $refs", () => {
      it("should return a problem for a parameters $ref in a response position", function(){
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              responses: {
                "200": {
                  $ref: "#/parameters/abc"
                }
              }
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(1)
        expect(res.errors[0].path).toEqual(["paths", "/CoolPath/{id}", "responses", "200", "$ref"])
        expect(res.warnings.length).toEqual(0)
      })

      it("should return a problem for a definitions $ref in a response position", function(){
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              schema: {
                $ref: "#/responses/abc"
              }
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(1)
        expect(res.errors[0].path).toEqual(["paths", "/CoolPath/{id}", "schema", "$ref"])
        expect(res.warnings.length).toEqual(0)
      })

      it("should not return a problem for a responses $ref in a response position", function(){
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              responses: {
                "200": {
                  $ref: "#/responses/abc"
                }
              }
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(0)
        expect(res.warnings.length).toEqual(0)
      })
    })

    describe("Schema $refs", () => {
      it("should return a problem for a parameters $ref in a schema position", function(){
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              schema: {
                $ref: "#/parameters/abc"
              }
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(1)
        expect(res.errors[0].path).toEqual(["paths", "/CoolPath/{id}", "schema", "$ref"])
        expect(res.warnings.length).toEqual(0)
      })

      it("should return a problem for a responses $ref in a schema position", function(){
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              schema: {
                $ref: "#/responses/abc"
              }
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(1)
        expect(res.errors[0].path).toEqual(["paths", "/CoolPath/{id}", "schema", "$ref"])
        expect(res.warnings.length).toEqual(0)
      })

      it("should not return a problem for a definition $ref in a schema position", function(){
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              schema: {
                $ref: "#/definition/abc"
              }
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(0)
        expect(res.warnings.length).toEqual(0)
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

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(0)
        expect(res.warnings.length).toEqual(0)
      })
    })

    describe("Parameter $refs", () => {
      it("should return a problem for a definition $ref in a parameter position", function(){
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              parameters: [{
                $ref: "#/definitions/abc"
              }]
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(1)
        expect(res.errors[0].path).toEqual(["paths", "/CoolPath/{id}", "parameters", "0", "$ref"])
        expect(res.warnings.length).toEqual(0)
      })

      it("should return a problem for a responses $ref in a parameter position", function(){
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              parameters: [{
                $ref: "#/responses/abc"
              }]
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(1)
        expect(res.errors[0].path).toEqual(["paths", "/CoolPath/{id}", "parameters", "0", "$ref"])
        expect(res.warnings.length).toEqual(0)
      })

      it("should not return a problem for a parameter $ref in a parameter position", function(){
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              parameters: [{
                $ref: "#/parameters/abc"
              }]
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(0)
        expect(res.warnings.length).toEqual(0)
      })
    })

    describe("Ref siblings", () => {

      it("should return a warning when another property is a sibling of a $ref", () => {
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              schema: {
                $ref: "#/definition/abc",
                description: "My very cool schema"
              }
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(0)
        expect(res.warnings.length).toEqual(1)
        expect(res.warnings[0].path).toEqual(["paths", "/CoolPath/{id}", "schema", "description"])
      })

    })

    describe("Ref formatting", () => {

      it("should return an error when a local $ref value does not begin with `#/`", () => {
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              schema: {
                $ref: "#definition/abc"
              }
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(1)
        expect(res.warnings.length).toEqual(0)
        expect(res.errors[0].path).toEqual(["paths", "/CoolPath/{id}", "schema", "$ref"])
        expect(res.errors[0].message).toContain("$ref paths must begin with")
      })

      it("should return an error when a remote $ref value does not begin with `#/`", () => {
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              schema: {
                $ref: "http://google.com/#definition/abc"
              }
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(1)
        expect(res.warnings.length).toEqual(0)
        expect(res.errors[0].path).toEqual(["paths", "/CoolPath/{id}", "schema", "$ref"])
        expect(res.errors[0].message).toContain("$ref paths must begin with")
      })

      it("should not return an error when a local $ref value begins with `#/`", () => {
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              schema: {
                $ref: "#/definition/abc"
              }
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(0)
        expect(res.warnings.length).toEqual(0)
      })

      it("should not return an error when a remote $ref value begins with `#/`", () => {
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              schema: {
                $ref: "http://google.com/#/definition/abc"
              }
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(0)
        expect(res.warnings.length).toEqual(0)
      })

      it("should not return an error when a remote $ref value is a whole-document path", () => {
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              schema: {
                $ref: "http://google.com/#"
              }
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(0)
        expect(res.warnings.length).toEqual(0)
      })

      it("should not return an error when a remote $ref value is a whole-document path", () => {
        const spec = {
          paths: {
            "/CoolPath/{id}": {
              schema: {
                $ref: "http://google.com/"
              }
            }
          }
        }

        let res = validate({ jsSpec: spec })
        expect(res.errors.length).toEqual(0)
        expect(res.warnings.length).toEqual(0)
      })

    })

  })
})
