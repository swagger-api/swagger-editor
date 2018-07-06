import expect from "expect"
import validateHelper, { expectNoErrors } from "../validate-helper.js"

describe("editor bug #1817 - path parameter semantic error with TRACE", function() {
  it("should return no problems for a path parameter defined in a TRACE operation", function () {
    const spec = {
      swagger: "2.0",
      paths: {
        "/CoolPath/{id}": {
          trace: {
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "string"
                }
              }
            ]
          }
        }
      }
    }

    return expectNoErrors(spec)
  })
})