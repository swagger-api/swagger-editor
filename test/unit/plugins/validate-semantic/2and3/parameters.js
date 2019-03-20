import expect from "expect"
import validateHelper from "../validate-helper.js"

describe(`validation plugin - semantic - 2and3 parameters`, () => {
  describe(`parameters must have unique name + in values`, () => {
    describe(`direct siblings`, () => {
      it("should return an error for an invalid Swagger 2 definition", () => {
        const spec = {
          swagger: "2.0",
          "paths": {
            "/pets": {
              "parameters": [
                {
                  "name": "pathLevel",
                  "in": "query",
                  "description": "tags to filter by",
                  "type": "string"
                },
                {
                  "name": "pathLevel",
                  "in": "query",
                  "description": "tags to filter by",
                  "type": "string"
                },
              ],
              "get": {
                "parameters": [
                  {
                    "name": "opLevel",
                    "in": "query",
                    "description": "tags to filter by",
                    "type": "string"
                  },
                  {
                    "name": "opLevel",
                    "in": "query",
                    "description": "tags to filter by",
                    "type": "string"
                  },
                ]
              }
            }
          }
        }

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS()
            const firstError = allErrors[0]
            const secondError = allErrors[1]
            expect(allErrors.length).toEqual(2)
            expect(firstError.path).toEqual(["paths", "/pets", "parameters", "1"])
            expect(firstError.message).toEqual("Sibling parameters must have unique name + in values")
            expect(secondError.path).toEqual(["paths", "/pets", "get", "parameters", "1"])
            expect(secondError.message).toEqual("Sibling parameters must have unique name + in values")
          })
      })
      it("should return an error for an invalid OpenAPI 3 definition", () => {
        const spec = {
          openapi: "3.0.0",
          "paths": {
            "/pets": {
              "parameters": [
                {
                  "name": "pathLevel",
                  "in": "query",
                  "description": "tags to filter by",
                  "schema": {
                    "type": "string"
                  }
                },
                {
                  "name": "pathLevel",
                  "in": "query",
                  "description": "tags to filter by",
                  "schema": {
                    "type": "string"
                  }
                },
              ],
              "get": {
                "parameters": [
                  {
                    "name": "opLevel",
                    "in": "query",
                    "description": "tags to filter by",
                    "schema": {
                      "type": "string"
                    }
                  },
                  {
                    "name": "opLevel",
                    "in": "query",
                    "description": "tags to filter by",
                    "schema": {
                      "type": "string"
                    }
                  },
                ]
              }
            }
          }
        }

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS()
            const firstError = allErrors[0]
            const secondError = allErrors[1]
            expect(allErrors.length).toEqual(2)
            expect(firstError.path).toEqual(["paths", "/pets", "parameters", "1"])
            expect(firstError.message).toEqual("Sibling parameters must have unique name + in values")
            expect(secondError.path).toEqual(["paths", "/pets", "get", "parameters", "1"])
            expect(secondError.message).toEqual("Sibling parameters must have unique name + in values")
          })
      })
      it("should return no errors for a valid Swagger 2 definition", () => {
        const spec = {
          swagger: "2.0",
          "paths": {
            "/pets": {
              "get": {
                "parameters": [
                  {
                    "name": "wags",
                    "in": "query",
                    "description": "wags to filter by",
                    "type": "string"
                  },
                  {
                    "name": "tags",
                    "in": "query",
                    "description": "tags to filter by",
                    "type": "string"
                  },
                ]
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
      it("should return no errors for a valid OpenAPI 3 definition", () => {
        const spec = {
          openapi: "3.0.0",
          "paths": {
            "/pets": {
              "get": {
                "parameters": [
                  {
                    "name": "wags",
                    "in": "query",
                    "description": "wags to filter by",
                    "type": "string"
                  },
                  {
                    "name": "tags",
                    "in": "query",
                    "description": "tags to filter by",
                    "type": "string"
                  },
                ]
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
    })
    describe(`inherited siblings`, () => {
      it("should return no errors for a valid Swagger 2 definition due to inheritance", () => {
        const spec = {
          swagger: "2.0",
          parameters: {
            MyParam: {
              name: "one",
              in: "query"
            }
          },
          "paths": {
            "/pets": {
              "parameters": [
                {
                  name: "one",
                  in: "query"
                },
                {
                  name: "two",
                  in: "query"
                }
              ],
              "get": {
                "parameters": [
                  {
                    name: "two",
                    in: "query"
                  },
                  {
                    name: "three",
                    in: "query"
                  }
                ]
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
      it("should return no errors for a valid OpenAPI 3 definition due to inheritance", () => {
        const spec = {
          openapi: "3.0.0",
          parameters: {
            MyParam: {
              name: "one",
              in: "query"
            }
          },
          "paths": {
            "/pets": {
              "parameters": [
                {
                  name: "one",
                  in: "query"
                },
                {
                  name: "two",
                  in: "query"
                }
              ],
              "get": {
                "parameters": [
                  {
                    name: "two",
                    in: "query"
                  },
                  {
                    name: "three",
                    in: "query"
                  }
                ]
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
      it("should not return an error for root parameters in Swagger 2", () => {
        const spec = {
          swagger: "2.0",
          parameters: {
            MyParam: {
              name: "one",
              in: "query"
            }
          },
          "paths": {
            "/pets": {
              "parameters": [
                {
                  name: "otherParam",
                  in: "query"
                }
              ],
              "get": {
                "parameters": [
                  {
                    name: "one",
                    in: "query"
                  }
                ]
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
      it("should not return an error for root parameters in OpenAPI 3", () => {
        const spec = {
          openapi: "3.0.0",
          parameters: {
            MyParam: {
              name: "one",
              in: "query"
            }
          },
          "paths": {
            "/pets": {
              "parameters": [
                {
                  name: "otherParam",
                  in: "query"
                }
              ],
              "get": {
                "parameters": [
                  {
                    name: "one",
                    in: "query"
                  }
                ]
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
      it("should return no errors for a valid Swagger 2 definition", () => {
        const spec = {
          swagger: "2.0",
          parameters: {
            MyParamOne: {
              name: "one",
              in: "query"
            },
            MyParamTwo: {
              name: "anotherParam1",
              in: "query"
            },
          },
          "paths": {
            "/pets/{one}/{two}": {
              "parameters": [
                {
                  name: "one",
                  in: "path",
                  required: true
                },
                {
                  name: "two",
                  in: "query"
                },
                {
                  name: "anotherParam2",
                  in: "query"
                },
              ],
              "get": {
                "parameters": [
                  {
                    name: "two",
                    in: "path",
                    required: true
                  },
                  {
                    name: "three",
                    in: "query"
                  },
                  {
                    name: "anotherParam3",
                    in: "query"
                  },
                ]
              }
            }
          }
        }

        return validateHelper(spec)
          .then(system => {
            const allErrors = system.errSelectors.allErrors().toJS()
            expect(allErrors).toEqual([])
          })
      })
      it("should return no errors for a valid OpenAPI 3 definition", () => {
        const spec = {
          openapi: "3.0.0",
          parameters: {
            MyParamOne: {
              name: "one",
              in: "query"
            },
            MyParamTwo: {
              name: "anotherParam1",
              in: "query"
            },
          },
          "paths": {
            "/pets/{one}/{two}": {
              "parameters": [
                {
                  name: "one",
                  in: "path",
                  required: true
                },
                {
                  name: "two",
                  in: "query"
                },
                {
                  name: "anotherParam2",
                  in: "query"
                },
              ],
              "get": {
                "parameters": [
                  {
                    name: "two",
                    in: "path",
                    required: true
                  },
                  {
                    name: "three",
                    in: "query"
                  },
                  {
                    name: "anotherParam3",
                    in: "query"
                  },
                ]
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
    })

  })
  describe(`parameter defaults must be present in enums`, () => {
    it("should return an error for an invalid Swagger 2 definition", () => {
      const spec = {
        swagger: "2.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  "name": "num",
                  "in": "query",
                  "type": "number",
                  enum: [1, 2, 3],
                  default: 0
                },
              ]
            }
          }
        }
      }

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          const firstError = allErrors[0]
          expect(allErrors.length).toEqual(1)
          expect(firstError.path).toEqual(["paths", "/pets", "get", "parameters", "0", "default"])
          expect(firstError.message).toEqual("Default values must be present in `enum`")
        })
    })
    it("should return an error for an invalid OpenAPI 3 definition", () => {
      const spec = {
        openapi: "3.0.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  "name": "num",
                  "in": "query",
                  "type": "number",
                  schema: {
                    enum: [1, 2, 3],
                    default: 0
                  }
                },
              ]
            }
          }
        }
      }

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          const firstError = allErrors[0]
          expect(allErrors.length).toEqual(1)
          expect(firstError.path).toEqual(["paths", "/pets", "get", "parameters", "0", "schema", "default"])
          expect(firstError.message).toEqual("Default values must be present in `enum`")
        })
    })
    it("should return an error for an invalid OpenAPI 3 definition", () => {
      const spec = {
        openapi: "3.0.0",
        components: {
          parameters: {
            MyParam: {
              "name": "num",
              "in": "query",
              "type": "number",
              schema: {
                enum: [1, 2, 3],
                default: 0
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
          expect(firstError.path).toEqual(["components", "parameters", "MyParam", "schema", "default"])
          expect(firstError.message).toEqual("Default values must be present in `enum`")
        })
    })
    it("should return no errors for a Swagger 2 definition without default set", () => {
      const spec = {
        swagger: "2.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  "name": "num",
                  "in": "query",
                  "type": "number",
                  enum: [1, 2, 3]
                },
              ]
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
    it("should return no errors for an OpenAPI 3 definition without default set", () => {
      const spec = {
        openapi: "3.0.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  "name": "num",
                  "in": "query",
                  "type": "number",
                  schema: {
                    enum: [1, 2, 3]
                  }
                },
              ]
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
    it("should return no errors for a Swagger 2 definition without enum set", () => {
      const spec = {
        swagger: "2.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  "name": "num",
                  "in": "query",
                  "type": "number",
                  default: 0
                },
              ]
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
    it("should return no errors for an OpenAPI 3 definition without enum set", () => {
      const spec = {
        openapi: "3.0.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  "name": "num",
                  "in": "query",
                  "type": "number",
                  schema: {
                    default: 0
                  }
                },
              ]
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
  })
})
