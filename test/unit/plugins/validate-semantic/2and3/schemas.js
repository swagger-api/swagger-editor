import expect from "expect"
import validateHelper from "../validate-helper.js"

describe(`validation plugin - semantic - 2and3 schemas`, () => {
  describe(`array schemas must have an Object value in "items"`, () => {
    it("should return an error for an array items value in Swagger 2", () => {
      const spec = {
        swagger: "2.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  name: "myParam",
                  in: "query",
                  type: "array",
                  items: [{ type: "object" }]
                }
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
        expect(firstError.path).toEqual(["paths", "/pets", "get", "parameters", "0", "items"])
        expect(firstError.message).toEqual("`items` must be an object")
      })
    })
    it("should return an error for an array items value in OpenAPI 3", () => {
      const spec = {
        openapi: "3.0.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  name: "myParam",
                  in: "query",
                  schema: {
                    type: "array",
                    items: [{ type: "object" }]
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
        expect(firstError.path).toEqual(["paths", "/pets", "get", "parameters", "0", "schema", "items"])
        expect(firstError.message).toEqual("`items` must be an object")
      })
    })
    it("should return an error for a missing items value for an array schema in Swagger 2", () => {
      const spec = {
        swagger: "2.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  name: "myParam",
                  in: "query",
                  type: "array"
                }
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
        expect(firstError.message).toEqual("Schemas with 'type: array', require a sibling 'items: ' field")
        expect(firstError.path).toEqual(["paths", "/pets", "get", "parameters", "0"])
      })
    })
    it("should return an error for a missing items value for an array schema in OpenAPI 3", () => {
      const spec = {
        openapi: "3.0.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  name: "myParam",
                  in: "query",
                  schema: {
                    type: "array"
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
        expect(firstError.path).toEqual(["paths", "/pets", "get", "parameters", "0", "schema"])
        expect(firstError.message).toEqual("Schemas with 'type: array', require a sibling 'items: ' field")
      })
    })
    it("should not return an error for a missing items value for a non-array schema in Swagger 2", () => {
      const spec = {
        swagger: "2.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  name: "myParam",
                  in: "query",
                  type: "object"
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
    it("should not return an error for a missing items value for a non-array schema in OpenAPI 3", () => {
      const spec = {
        openapi: "3.0.0",
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  name: "myParam",
                  in: "query",
                  schema: {
                    type: "object"
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

describe(`values in Enum must be instance of the defined type`, () => {
  // Numbers tests
  it("should return an error for a text value in a enum number type in OpenApi 3", () => {
    const spec = {
      openapi: "3.0.0",
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                name: "number",
                in: "query",
                schema: {
                  type: "number",
                  enum: [1, "text", 3]
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
      expect(allErrors.length).toEqual(1)
      expect(allErrors[0]).toInclude({
        level: "warning",
        message: "enum value should conform to its schema's `type`",
        path: ["paths", "/pets", "get", "parameters", "0", "schema", "enum", 1]
      })
    })
  })

  it("should return an error for a number value inside quotes in a enum number type in OpenApi 3", () => {
    const spec = {
      openapi: "3.0.0",
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                name: "number",
                in: "query",
                schema: {
                  type: "number",
                  enum: [1, 2, "3"]
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
      expect(allErrors.length).toEqual(1)
      expect(allErrors[0]).toInclude({
        level: "warning",
        message: "enum value should conform to its schema's `type`",
        path: ["paths", "/pets", "get", "parameters", "0", "schema", "enum", 2]
      })
    })
  })
  
  it("should not return an error when all items are number in a enum number type in OpenApi 3", () => {
    const spec = {
      openapi: "3.0.0",
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                name: "number",
                in: "query",
                schema: {
                  type: "number",
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

  //Array Tests

  it("should return an error for a non array value in a enum array type in OpenApi 3", () => {
    const spec = {
      openapi: "3.0.0",
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                name: "arraySample",
                in: "query",
                schema: {
                  type: "array",
                  enum: [1, 2, 3],     
                  items: {
                    type: "array",
                    items: {
                      type: "number"
                    }             
                  }
                }
              },
            ]
          }
        }
      }
    }

    return validateHelper(spec)
    .then(system => {
      const allErrors = system.errSelectors.allErrors().toJS().filter((err => err.source !== "")) 
      expect(allErrors.length).toEqual(3)
      expect(allErrors[0]).toInclude({
        level: "warning",
        message: "enum value should conform to its schema's `type`",
        path: ["paths", "/pets", "get", "parameters", "0", "schema", "enum", 0]
      })
      expect(allErrors[1]).toInclude({
        level: "warning",
        message: "enum value should conform to its schema's `type`",
        path: ["paths", "/pets", "get", "parameters", "0", "schema", "enum", 1]
      })
      expect(allErrors[2]).toInclude({
        level: "warning",
        message: "enum value should conform to its schema's `type`",
        path: ["paths", "/pets", "get", "parameters", "0", "schema", "enum", 2]
      })
    })
  })
  
  it("should not return a type error when all items are array in a enum array type in OpenApi 3", () => {
    const spec = {
      openapi: "3.0.0",
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                name: "arraySample",
                in: "query",
                schema: {
                  type: "array",
                  enum: [[1,2],[3,4]],     
                  items: {
                    type: "number"                    
                  }
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

  //Object Tests

  it("should return an error for a non object value (array) in a enum object type in OpenApi 3", () => {
    const spec = {
      openapi: "3.0.0",
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                name: "objectSample",
                in: "query",
                schema: {
                  type: "object",
                  enum: [[1,3], 2, 3]
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
      expect(allErrors.length).toEqual(3)
      expect(allErrors[0]).toInclude({
        level: "warning",
        message: "enum value should conform to its schema's `type`",
        path: ["paths", "/pets", "get", "parameters", "0", "schema", "enum", 0]
      })
      expect(allErrors[1]).toInclude({
        level: "warning",
        message: "enum value should conform to its schema's `type`",
        path: ["paths", "/pets", "get", "parameters", "0", "schema", "enum", 1]
      })
      expect(allErrors[2]).toInclude({
        level: "warning",
        message: "enum value should conform to its schema's `type`",
        path: ["paths", "/pets", "get", "parameters", "0", "schema", "enum", 2]
      })
    })
  })

  it("should return an error for a null value in a enum object type in OpenApi 3", () => {
    const spec = {
      openapi: "3.0.0",
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                name: "objectSample",
                in: "query",
                schema: {
                  type: "object",
                  enum: [null]
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
      expect(allErrors[0]).toInclude({
        level: "warning",
        message: "enum value should conform to its schema's `type`",
        path: ["paths", "/pets", "get", "parameters", "0", "schema", "enum", 0]
      })
    })
  })
  
  it("should not return an error when all items are array in a enum array type in OpenApi 3", () => {
    const spec = {
      openapi: "3.0.0",
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                name: "objectSample",
                in: "query",
                schema: {
                  type: "object",
                  enum: [{ok: "Sample"},{}]
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
 
  //Boolean Tests

  it("should return an error for a non boolean value in a boolean array type in OpenApi 3", () => {
    const spec = {
      openapi: "3.0.0",
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                name: "booleanEnum",
                in: "query",
                schema: {
                  type: "boolean",
                  enum: [1, true, false]
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
      expect(allErrors[0]).toInclude({
        level: "warning",
        message: "enum value should conform to its schema's `type`",
        path: ["paths", "/pets", "get", "parameters", "0", "schema", "enum", 0]
      }) 
    })
  })
  
  it("should not return an error when all items are boolean in a boolean array type in OpenApi 3", () => {
    const spec = {
      openapi: "3.0.0",
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                name: "booleanEnum",
                in: "query",
                schema: {
                  type: "boolean",
                  enum: [true, false]
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

  it("should not return an error for a null value in a enum object when nullable is true type in OpenApi 3", () => {
    const spec = {
      openapi: "3.0.0",
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                name: "objectSample",
                in: "query",
                schema: {
                  type: "object",
                  nullable: true,
                  enum: [null]
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