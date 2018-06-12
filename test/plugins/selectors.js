import expect from "expect"
import SwaggerUi from "swagger-ui"
import ValidateBasePlugin from "plugins/validate-base"
import ValidateSemanticPlugin from "plugins/validate-semantic"
import ASTPlugin from "plugins/ast"

function getSystem(spec) {
  return new Promise((resolve) => {
    const system = SwaggerUi({
      spec,
      domNode: null,
      presets: [
        SwaggerUi.plugins.SpecIndex,
        SwaggerUi.plugins.ErrIndex,
        SwaggerUi.plugins.DownloadUrl,
        SwaggerUi.plugins.SwaggerJsIndex,
      ],
      initialState: {
        layout: undefined
      },
      plugins: [
        ASTPlugin,
        ValidateBasePlugin,
        ValidateSemanticPlugin,
        () => ({
          statePlugins: {
            configs: {
              actions: {
                loaded: () => {
                  return {
                    type: "noop"
                  }
                }
              }
            }
          }
        })
      ]
    })
    resolve(system)
  })
}

describe("validation plugin - selectors", function() {
  this.timeout(10 * 1000)

  it("allSchemas should pick up parameter schemas", () => {
    const spec = {
      paths: {
        test: {
          parameters: [{
            name: "common"
          }],
          get: {
            parameters: [{
              name: "tags"
            }]
          }
        }
      }
    }

    return getSystem(spec)
      .then(system => system.validateSelectors.allSchemas())
      .then(nodes => {
        expect(nodes.length).toEqual(2)
        expect(nodes[0].path).toEqual(["paths","test","parameters","0"])
        expect(nodes[1].path).toEqual(["paths","test","get","parameters","0"])
      })
  })

  it("allSchemas should pick up response schemas", () => {
    const spec = {
      paths: {
        test: {
          get: {
            responses: {
              "200": {
                schema: {
                  type: "string"
                }
              }
            }
          }
        }
      }
    }

    return getSystem(spec)
      .then(system => system.validateSelectors.allSchemas())
      .then(nodes => {
        expect(nodes.length).toEqual(1)
        expect(nodes[0].path.join(".")).toEqual("paths.test.get.responses.200.schema")
      })
  })

  it("allSchemas should pick up definitions", () => {
    const spec = {
      definitions: {
        fooModel: {
          type: "object",
          properties: {
          }
        }
      }
    }

    return getSystem(spec)
      .then(system => system.validateSelectors.allSchemas())
      .then(nodes => {
        expect(nodes.length).toEqual(1)
        expect(nodes[0].key).toEqual("fooModel")
      })
  })

  it("allSchemas should pick up headers", () => {
    const spec = {
      paths: {
        test: {
          get: {
            responses: {
              "200": {
                headers: {
                  foo: {
                    "type": "integer"
                  }
                }
              }
            }
          }
        }
      }
    }

    return getSystem(spec)
      .then(system => system.validateSelectors.allSchemas())
      .then(nodes => {
        expect(nodes.length).toEqual(1)
        expect(nodes[0].path.join(".")).toEqual("paths.test.get.responses.200.headers.foo")
      })
  })

  it("allSchemas should pick up subschemas in properties", () => {
    const spec = {
      definitions: {
        fooModel: {
          type: "object",
          properties: {
            foo: {
              type: "string"
            }
          }
        }
      }
    }

    return getSystem(spec)
      .then(system => system.validateSelectors.allSchemas())
      .then(nodes => {
        expect(nodes.length).toEqual(2)
        expect(nodes[0].key).toEqual("fooModel")
        expect(nodes[1].key).toEqual("foo")
      })
  })

  it("allSchemas should pick up subschemas in additionalProperties - simple", () => {
    const spec = {
      definitions: {
        fooModel: {
          type: "object",
          additionalProperties: {
            type: "string"
          }
        }
      }
    }

    return getSystem(spec)
      .then(system => system.validateSelectors.allSchemas())
      .then(nodes => {
        expect(nodes.length).toEqual(2)
        expect(nodes[0].key).toEqual("fooModel")
        expect(nodes[1].key).toEqual("additionalProperties")
      })
  })

  it("allSchemas should pick up subschemas in additionalProperties - complex", () => {
    const spec = {
      definitions: {
        fooModel: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              foo: {
                type: "string"
              }
            }
          }
        }
      }
    }

    return getSystem(spec)
      .then(system => system.validateSelectors.allSchemas())
      .then(nodes => {
        expect(nodes.length).toEqual(3)
        expect(nodes[0].key).toEqual("fooModel")
        expect(nodes[1].key).toEqual("additionalProperties")
        expect(nodes[2].key).toEqual("foo")
      })
  })

  it("allSchemas should pick up subschemas in array", () => {
    const spec = {
      definitions: {
        fooModel: {
          type: "array",
          items: {
            type: "string"
          }
        }
      }
    }

    return getSystem(spec)
      .then(system => system.validateSelectors.allSchemas())
      .then(nodes => {
        expect(nodes.length).toEqual(2)
        expect(nodes[0].key).toEqual("fooModel")
        expect(nodes[1].key).toEqual("items")
      })
  })

  it("allSchemas should pick up subschemas in array of objects", () => {
    const spec = {
      definitions: {
        fooModel: {
          type: "array",
          items: {
            type: "object",
            properties: {
              foo: {
                type: "string"
              }
            }
          }
        }
      }
    }

    return getSystem(spec)
      .then(system => system.validateSelectors.allSchemas())
      .then(nodes => {
        expect(nodes.length).toEqual(3)
        expect(nodes[0].key).toEqual("fooModel")
        expect(nodes[1].key).toEqual("items")
        expect(nodes[2].key).toEqual("foo")
      })
  })
  it("allSchemas should pick up OAS3 request and response schemas", () => {
    const spec = {
      "openapi": "3.0.0",
      "paths": {
        "/ping": {
          "post": {
            "requestBody": {
              "content": {
                "application/myRequestMediaType": {
                  "schema": {
                    "type": "array"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "OK",
                "content": {
                  "application/myResponseMediaType": {
                    "schema": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return getSystem(spec)
      .then(system => system.validateSelectors.allSchemas())
      .then(nodes => {
        expect(nodes.length).toEqual(2)
        expect(nodes[0].node).toNotBe(nodes[1].node)
        expect(nodes[0].key).toEqual("schema")
        expect(nodes[0].parent.key).toEqual("application/myRequestMediaType")
        expect(nodes[1].key).toEqual("schema")
        expect(nodes[1].parent.key).toEqual("application/myResponseMediaType")
      })
  })
})
