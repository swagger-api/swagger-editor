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

  describe("$refs for headers must reference a header by position", () => {
    it("should return an error when a header incorrectly references a local parameter schema", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/foo": {
            parameters: {
              myParam: {
                $ref: "#/components/headers/foo"
              }
            },
            get: {
              parameters: {
                myParam: {
                  $ref: "#/components/headers/foo"
                }
              },
              responses: {
                "200": {
                  description: "OK"
                }
              }
            }
          }
        },
        components: {
          parameters: {
            myParam: {
              $ref: "#/components/headers/foo"
            }
          }
        }
      }

      return validateHelper(spec)
        .then(system => {
          const allErrors = system.errSelectors.allErrors().toJS()
          expect(allErrors.length).toEqual(6)
          const firstError = allErrors[3]
          expect(firstError.message).toEqual(`OAS3 response parameter $refs should point to #/components/parameters/... and not #/components/headers/...`)
          expect(firstError.path).toEqual(["paths","/foo","parameters", "myParam", "$ref"])
          const secondError = allErrors[4]
          expect(secondError.message).toEqual(`OAS3 response parameter $refs should point to #/components/parameters/... and not #/components/headers/...`)
          expect(secondError.path).toEqual(["paths","/foo","get","parameters", "myParam", "$ref"])
          const thirdError = allErrors[5]
          expect(thirdError.message).toEqual(`OAS3 response parameter $refs should point to #/components/parameters/... and not #/components/headers/...`)
          expect(thirdError.path).toEqual(["components","parameters", "myParam", "$ref"])
        })
    })
    
    it("should return no errors when a header correctly references a local component header", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/foo": {
            parameters: {
              $ref: "#/components/parameters/foo"
            },
            get: {
              parameters: {
                $ref: "#/components/parameters/foo"
              },
              responses: {
                "200": {
                  description: "OK"
                }
              }
            }
          }
        },
        components: {
          parameters: {
            foo: {
              $ref: "#/components/parameters/foo"
            }
          }
        }
      }

      return expectNoErrorsOrWarnings(spec)
    })
    
    it("should return no errors when a header correctly references a remote component header", () => {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/foo": {
            parameters: {
              myParam:{
                $ref: "http://www.google.com/#/components/parameters/foo"
              }
            },
            get: {
              parameters: {
                myParam:{
                  $ref: "http://www.google.com/#/components/parameters/foo"
                }
              },
              responses: {
                "200": {
                  description: "OK"
                }
              }
            }
          }
        },
        components: {
          parameters: {
            foo: {
              $ref: "http://www.google.com/#/components/parameters/foo"
            }
          }
        }
      }

      return expectNoErrorsOrWarnings(spec)
    })
  })
})