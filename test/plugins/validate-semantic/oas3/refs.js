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
          expect(firstError.message).toEqual(`requestBody $refs must point to a position where a requestBody can be legally placed`)
          expect(firstError.path).toEqual(["paths", "/", "post", "requestBody", "$ref"])
        })
    })
    it("should return an error when a requestBody incorrectly references a remote component schema", () => {
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

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          const firstError = allErrors[0]
          expect(allErrors.length).toEqual(1)
          expect(firstError.message).toEqual(`requestBody $refs must point to a position where a requestBody can be legally placed`)
          expect(firstError.path).toEqual(["paths", "/", "post", "requestBody", "$ref"])
        })
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
          expect(firstError.message).toEqual(`requestBody $refs must point to a position where a requestBody can be legally placed`)
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
  })
})
