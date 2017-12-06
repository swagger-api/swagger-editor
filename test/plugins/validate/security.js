import expect from "expect"
import validateHelper from "./validate-helper.js"

describe.skip("validation plugin - semantic - security", function() {
  this.timeout(10 * 1000) // For the slow validateHelper startup ( via swagger-ui )

  it.skip("should return an error when an operation references a non-existing security scope", () => {
    const spec = {
      "securityDefinitions": {
        "api_key": {
          "type": "apiKey",
          "name": "apikey",
          "in": "query",
          "scopes": {
            "asdf": "blah blah"
          }
        }
      },
      "paths": {
        "/": {
          "get": {
            "description": "asdf",
            "security": [
              {
                "api_key": [
                  "write:pets"
                ]
              }
            ]
          }
        }
      }
    }

    return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        expect(allErrors.length).toEqual(1)
        const firstError = allErrors[0]
        expect(firstError.path).toEqual(["paths", "/", "get", "security", "0", "0"])
        expect(firstError.message).toEqual("Security scope definition write:pets could not be resolved")
      })
  })

  it("should return an error when an operation references a security definition with no scopes", () => {

    const spec = {
      "securityDefinitions": {
        "api_key": {
          "type": "apiKey",
          "name": "apikey",
          "in": "query"
        }
      },
      "paths": {
        "/": {
          "get": {
            "description": "asdf",
            "security": [
              {
                "api_key": [
                  "write:pets"
                ]
              }
            ]
          }
        }
      }
    }

    return validateHelper(spec)
      .then(system => {
        const allErrors = system.errSelectors.allErrors().toJS()
        expect(allErrors.length).toEqual(1)
        const firstError = allErrors[0]
        expect(firstError.path).toEqual(["paths", "/", "get", "security", "0", "0"])
        expect(firstError.message).toMatch("Security scope definition write:pets could not be resolved")
      })
  })

  it("should return an error when an operation references a non-existing security definition", () => {
    const spec = {
      "securityDefinitions": {
        "api_key": {
          "type": "apiKey",
          "name": "apikey",
          "in": "query"
        }
      },
      "paths": {
        "/": {
          "get": {
            "description": "asdf",
            "security": [
              {
                "fictional_security_definition": [
                  "write:pets"
                ]
              }
            ]
          }
        }
      }
    }

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths", "/", "get", "security", "0"])
    expect(res.errors[0].message).toEqual("security requirements must match a security definition")
    expect(res.warnings.length).toEqual(0)
  })

  it("should not return an error when an operation references an existing security scope", () => {
    const spec = {
      "securityDefinitions": {
        "api_key": {
          "type": "apiKey",
          "name": "apikey",
          "in": "query",
          "scopes": {
            "write:pets": "write to pets"
          }
        }
      },
      "paths": {
        "/": {
          "get": {
            "description": "asdf",
            "security": [
              {
                "api_key": [
                  "write:pets"
                ]
              }
            ]
          }
        }
      }
    }

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })
})
