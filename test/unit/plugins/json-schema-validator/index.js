import YAML from "js-yaml"
import JSONSchemaValidator from "src/plugins/json-schema-validator/validator/index.js"
import swagger2SchemaYaml from "src/plugins/json-schema-validator/swagger2-schema.yaml"
import oas3SchemaYaml from "src/plugins/json-schema-validator/oas3-schema.yaml"
import fs from "fs"
import expect from "expect"

const swagger2Schema = swagger2SchemaYaml[0]
const oas3Schema = oas3SchemaYaml[0]

var testDocuments = fs
  .readdirSync(__dirname + "/test-documents")
  .filter(path => path.endsWith("yaml"))
  .map(path => ({
    path: "/test-documents/" + path,
    contentString: fs.readFileSync(__dirname + "/test-documents/" + path, "utf8"),
  }))
  .map(doc => ({
    path: doc.path,
    content: YAML.safeLoad(doc.contentString)
  }))

testDocuments.forEach(doc => {
  const { path, content } = doc
  const { meta = {}, cases = [] } = content

  const validator = new JSONSchemaValidator()
  validator.addSchema(swagger2Schema, ["openapi-2.0"])
  validator.addSchema(oas3Schema, ["openapi-3.0"])

  const rootDescribe = meta.skip ? describe.skip : describe

  rootDescribe(`schema validation plugin - ` + (meta.title || path), function() {
    if(content.input && content.output) {
      // fold simple input/output docs into implicit cases
      cases.push({
        input: content.input,
        output: content.output,
      })
    }

    if(cases && cases.length) {
      cases.forEach(currentCase => {
        const versionDefaultSchema = currentCase.input.openapi && !currentCase.input.swagger ? "openapi-3.0" : "openapi-2.0"

        const result = validator.validate({
          jsSpec: currentCase.input,
          specStr: "", // not needed here
          schemaPath: versionDefaultSchema,
          source: "structural",
        })

        if(currentCase.name) {
          // only create a new describe block if we have a name
          describe(currentCase.name || "", function () {
            assertCaseExpectations(currentCase, result)
          })
        } else {
          // else, just do the assertions under the root describe block
          assertCaseExpectations(currentCase, result)
        }
      })
    }
  })
})

function assertCaseExpectations(currentCase, result) {
  const itFn = currentCase.skip ? it.skip : it
  if (currentCase.output.match !== undefined) {
    itFn("should match expected error output", function () {
      expect(result).toMatch(currentCase.output.match)
    })
  }

  if (currentCase.output.length !== undefined) {
    itFn("should have expected array length", function () {
      expect(result).toBeAn(Array)
      expect(result.length).toBe(currentCase.output.length)
    })
  }

  if(currentCase.output.equal !== undefined) {
    itFn("should equal expected value", function() {
      expect(result).toEqual(currentCase.output.equal)
    })
  } 
}