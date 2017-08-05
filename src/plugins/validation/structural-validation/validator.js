import Ajv from "ajv"
import { transformPathToArray } from "../path-translator.js"
import { condenseErrors } from "./condense-errors.js"
import jsonSchema from "./jsonSchema"
import { getLineNumberForPath } from "../../ast/ast"

const IGNORED_AJV_PARAMS = ["type"]

export function validate({ jsSpec, specStr, settings = {} }) {
  var ajv = new Ajv({
    allErrors: true,
  })
  ajv.addSchema(jsonSchema)
  settings.schemas.forEach(schema => ajv.addSchema(schema))
  ajv.validate(settings.testSchema || {}, jsSpec)

  if(!ajv.errors || !ajv.errors.length) {
    return null
  }

  const condensedErrors = condenseErrors(ajv.errors)

  return condensedErrors.map(err => {
    let preparedMessage = err.message
    if(err.params) {
      preparedMessage += "\n"
      for(var k in err.params) {
        if(IGNORED_AJV_PARAMS.indexOf(k) === -1) {
          const ori = err.params[k]
          const value = Array.isArray(ori) ? dedupe(ori).join(", ") : ori
          preparedMessage += `${k}: ${value}\n`
        }
      }
    }
    return {
      level: "error",
      line: getLineNumberForPath(specStr, transformPathToArray(err.dataPath.slice(1), jsSpec) || []),
      path: err.dataPath.slice(1), // slice leading "." from ajv
      message: preparedMessage,
      source: "schema",
      original: err
    }
  })
}

function dedupe(arr) {
  return arr.filter((val, i) => {
    return arr.indexOf(val) === i
  })
}
