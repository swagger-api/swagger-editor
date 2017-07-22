import Ajv from "ajv"
import { transformPathToArray } from "../path-translator.js"


import jsonSchema from "./jsonSchema"
import { getLineNumberForPath } from "../../ast/ast"


export function validate({ jsSpec, specStr, settings = {} }) {
  var ajv = new Ajv()
  ajv.addSchema(jsonSchema)
  settings.schemas.forEach(schema => ajv.addSchema(schema))
  ajv.validate(settings.testSchema || {}, jsSpec)

  return ajv.errors.map(err => {
    let preparedMessage = err.message
    if(err.params) {
      preparedMessage += "\n"
      for(var k in err.params) {
        preparedMessage += `${k}: ${err.params[k]}\n`
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
