import expect from "expect"

import validateHelper, { expectNoErrorsOrWarnings } from "../validate-helper.js"

describe("validation plugin - semantic - oas3 refs", () => {
  describe("$refs for request bodies must reference a request body by position", () => {
    it("should return an error when a requestBody incorrectly references a local component schema", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/": {
            post: {
              operationId: "myId",
              requestBody: {
                $ref: "#/components/schemas/MySchema"
              }
            }
          }
        },
        components: {
          schemas: {
            MySchema: {
              type: "string"
            }
          }
        }
      }

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          const firstError = allErrors[0]
          expect(allErrors.length).toEqual(1)
          expect(firstError.message).toEqual(`requestBody $refs cannot point to '#/components/schemas/…', they must point to '#/components/requestBodies/…'`)
          expect(firstError.path).toEqual(["paths", "/", "post", "requestBody", "$ref"])
        })
    })
    it("should not return an error when a requestBody references a remote component schema", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/": {
            post: {
              operationId: "myId",
              requestBody: {
                $ref: "http://google.com/#/components/schemas/MySchema"
              }
            }
          }
        }
      }

      return expectNoErrorsOrWarnings(spec)
    })
    it("should return an error when a requestBody in a callback incorrectly references a local component schema", () => {
      const spec = {
        openapi: "3.0.0",
        info: null,
        version: "1.0.0-oas3",
        title: "example",
        paths: {
          "/api/callbacks": {
            post: {
              responses: {
                "200": {
                  description: "OK"
                }
              },
              callbacks: {
                callback: {
                  "/callback": {
                    post: {
                      requestBody: {
                        $ref: "#/components/schemas/callbackRequest"
                      },
                      responses: {
                        "200": {
                          description: "OK"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            callbackRequest: {
              type: "object",
              properties: {
                property1: {
                  type: "integer",
                  example: 10000
                }
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
          expect(firstError.message).toEqual(`requestBody $refs cannot point to '#/components/schemas/…', they must point to '#/components/requestBodies/…'`)
          expect(firstError.path).toEqual(["paths", "/api/callbacks", "post", "callbacks",
          "callback", "/callback", "post", "requestBody", "$ref"])
        })
    })
    it("should return no errors when a requestBody correctly references a local component request body", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/": {
            post: {
              operationId: "myId",
              requestBody: {
                $ref: "#/components/requestBodies/MyBody"
              }
            }
          }
        },
        components: {
          requestBodies: {
            MyBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "string"
                  }
                }
              }
            }
          }
        }
      }

      return expectNoErrorsOrWarnings(spec)
    })
    it("should return no errors when a requestBody correctly references a local operation request body", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/": {
            post: {
              operationId: "myId",
              requestBody: {
                $ref: "#/paths/~1/put/requestBody"
              }
            },
            put: {
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "string"
                    }
                  }
                }
              }
            }
          }
        }
      }

      return expectNoErrorsOrWarnings(spec)
    })
    it("should return no errors when a requestBody correctly references a remote component request body", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/": {
            post: {
              operationId: "myId",
              requestBody: {
                $ref: "http://google.com/#/components/requestBodies/MyBody"
              }
            }
          }
        },
        components: {
          requestBodies: {
            MyBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "string"
                  }
                }
              }
            }
          }
        }
      }

      return expectNoErrorsOrWarnings(spec)
    })
    it("should return no errors when a requestBody correctly references a remote https component request body", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/": {
            post: {
              operationId: "myId",
              requestBody: {
                $ref: "https://example.com/file.yaml#/components/requestBodies/group1/addPetBody"
              }
            }
          }
        },
        components: {
          requestBodies: {
            MyBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "string"
                  }
                }
              }
            }
          }
        }
      }

      return expectNoErrorsOrWarnings(spec)
    })
    it("should return no errors when a requestBody correctly references an external yaml file", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/": {
            post: {
              operationId: "myId",
              requestBody: {
                $ref: "addPetBody.yaml"
              }
            }
          }
        },
        components: {
          requestBodies: {
            MyBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "string"
                  }
                }
              }
            }
          }
        }
      }

      return expectNoErrorsOrWarnings(spec)
    })
    it("should return no errors when a requestBody correctly references an external yaml pointing some node", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/": {
            post: {
              operationId: "myId",
              requestBody: {
                $ref: "./components.yaml#/path/to/some/node"
              }
            }
          }
        },
        components: {
          requestBodies: {
            MyBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "string"
                  }
                }
              }
            }
          }
        }
      }

      return expectNoErrorsOrWarnings(spec)
    })
  })

  describe("$refs for requestbody schemas must reference a schema by position", () => {
    it("should return an error when a requestBody schema incorrectly references a local component requestBody", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/foo": {
            post: {
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/requestBodies/Foo"
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          requestBodies: {
            Foo: {
              type: "string"
            }
          }
        }
      }

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          const allSemanticErrors = allErrors.filter(err => err.source === "semantic")
          
          expect(allSemanticErrors.length).toEqual(1)
          
          const firstError = allSemanticErrors[0]
          
          expect(firstError.message).toEqual(`requestBody schema $refs must point to a position where a Schema Object can be legally placed`)
          expect(firstError.path).toEqual(["paths", "/foo", "post", "requestBody", "content", "application/json", "schema", "$ref"])

        })
    })

    it("should not return an error when a requestBody schema references a local component schema", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/foo": {
            post: {
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Foo"
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            Foo: {
              type: "string"
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

    it("should not return an error when a requestBody schema references remote document paths", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/foo": {
            post: {
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "http://google.com#/Foo"
                    }
                  }
                }
              }
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

    it("should not return an error when a requestBody schema references entire remote documents", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/foo": {
            post: {
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "addPetBody.yaml"
                    }
                  }
                }
              }
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

    it("should not return an error when a requestBody schema references local operation requestBody schemas", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/foo": {
            post: {
              responses: {
                "200": {
                  description: "OK"
                }
              },
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "string"
                    }
                  }
                }
              }
            },
            put: {
              requestBody: {
                responses: {
                  "200": {
                    description: "OK"
                  }
                },
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/paths/~1foo/post/requestBody/content/application~1json/schema"
                    }
                  }
                }
              }
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
