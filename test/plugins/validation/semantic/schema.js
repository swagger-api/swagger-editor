import expect from "expect"
import { validate } from "plugins/validation/semantic-validators/validators/schema"

describe("validation plugin - semantic - schema", () => {

  it("should return an error when a definition's property is readOnly and required by the schema", () => {
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

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["definitions", "CoolModel", "required", "0"])
    expect(res.errors[0].message).toEqual("Read only properties cannot marked as required by a schema.")
    expect(res.warnings.length).toEqual(0)
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

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })

  it("should return an error when a response schema's property is readOnly and required by the schema", () => {
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

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths", "/CoolPath", "get", "responses", "200", "schema", "required", "0"])
    expect(res.errors[0].message).toEqual("Read only properties cannot marked as required by a schema.")
    expect(res.warnings.length).toEqual(0)
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

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })

  it("should return an error when a parameter schema's property is readOnly and required by the schema", () => {
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

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths", "/CoolPath", "get", "parameters", "0", "schema", "required", "0"])
    expect(res.errors[0].message).toEqual("Read only properties cannot marked as required by a schema.")
    expect(res.warnings.length).toEqual(0)
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

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })

})
