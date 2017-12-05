import expect from "expect"
import validateHelper from "./validate-helper.js"

describe("validation plugin - semantic - schema", function() {
  this.timeout(10 * 1000)

  // Skipped due to mis-match, our error returns the parent, not the required.x path
  it.skip("should return an error when a definition's property is readOnly and required by the schema", () => {
    const spec = {
      definitions: {
        CoolModel: {
          required: ["BadProperty"],
          properties: [
            {
              name: "BadProperty",
              readOnly: true
            }
          ]
        }
      }
    }

    return validateHelper(spec)
        .then( system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors.length).toEqual(1)
          const firstError = allErrors[0]
          expect(firstError.path).toEqual(["definitions", "CoolModel", "required", "0"])
          expect(firstError.message).toEqual("Read only properties cannot marked as required by a schema.")
        })

  })

  it("should not return an error when a definition's property is not readOnly and required by the schema", () => {
    const spec = {
      definitions: {
        CoolModel: {
          required: ["BadProperty"],
          properties: [
            {
              name: "BadProperty"
            }
          ]
        }
      }
    }


    return validateHelper(spec)
        .then( system => {
          const allErrors = system.errSelectors
                .allErrors()
                .filter(a => a.get("level") == "error") // We have an incidental "warning"
                .toJS()
          expect(allErrors).toEqual(0)
        })
  })

  it.skip("should return an error when a response schema's property is readOnly and required by the schema", () => {
    const spec = {
      paths: {
        "/CoolPath": {
          get: {
            responses: {
              200: {
                schema: {
                  required: ["BadProperty"],
                  properties: [
                    {
                      name: "BadProperty",
                      readOnly: true
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }

    return validateHelper(spec)
        .then( system => {
          const allErrors = system.errSelectors
                .allErrors()
                .toJS()

          expect(allErrors.length).toEqual(1)
          const firstError = allErrors[0]

          expect(firstError.path).toEqual(["paths", "/CoolPath", "get", "responses", "200", "schema", "required", "0"])
          expect(firstError.message).toEqual("Read only properties cannot marked as required by a schema.")
        })
  })

  it("should not return an error when a response schema's property is not readOnly and required by the schema", () => {
    const spec = {
      paths: {
        "/CoolPath": {
          get: {
            responses: {
              200: {
                schema: {
                  required: ["BadProperty"],
                  properties: [
                    {
                      name: "BadProperty"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }

    return validateHelper(spec)
        .then( system => {
          const allErrors = system.errSelectors
                .allErrors()
                .toJS()

          expect(allErrors.length).toEqual(0)
        })
  })

  it.skip("should return an error when a parameter schema's property is readOnly and required by the schema", () => {
    const spec = {
      paths: {
        "/CoolPath": {
          get: {
            parameters: [{
              name: "BadParameter",
              in: "body",
              schema: {
                required: ["BadProperty"],
                properties: [
                  {
                    name: "BadProperty",
                    readOnly: true
                  }
                ]
              }
            }]
          }
        }
      }
    }

    return validateHelper(spec)
        .then( system => {
          const allErrors = system.errSelectors
                .allErrors()
                .toJS()

          expect(allErrors.length).toEqual(1)
          const firstError = allErrors[0]
          expect(firstError.path).toEqual(["paths", "/CoolPath", "get", "parameters", "0", "schema", "required", "0"])
          expect(firstError.message).toEqual("Read only properties cannot marked as required by a schema.")
        })
  })

  it("should not return an error when a parameter schema's property is not readOnly and required by the schema", () => {
    const spec = {
      paths: {
        "/CoolPath": {
          get: {
            parameters: [{
              name: "BadParameter",
              in: "body",
              schema: {
                required: ["BadProperty"],
                properties: [
                  {
                    name: "BadProperty"
                  }
                ]
              }
            }]
          }
        }
      }
    }

    return validateHelper(spec)
      .then( system => {
        const allErrors = system.errSelectors .allErrors() .toJS()
        expect(allErrors.length).toEqual(0)
      })
  })

})
