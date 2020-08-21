import registerPromiseWorker from "promise-worker/register"
import Validator from "./validator"

const validator = new Validator()

registerPromiseWorker(({ type, payload }) => {
  if (type == "add-schema") {
    const { schema, schemaPath } = payload
    validator.addSchema(schema, schemaPath)
    return
  }

  if (type == "validate") {
    const { jsSpec, specStr, schemaPath, source } = payload
    let validationResults = validator.validate({
      jsSpec,
      specStr,
      schemaPath,
      source
    })

    return { results: validationResults }
  }
})
