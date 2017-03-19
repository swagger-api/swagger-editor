import JSONSchema from "jsonschema"
import { transformPathToArray } from "../../../path-translator.js"


import jsonSchema from "./jsonSchema"
import { getLineNumberForPath } from "../../ast/ast"

var validator = new JSONSchema.Validator()
validator.addSchema(jsonSchema)

export function validate({ jsSpec, specStr, settings = {} }) {
  settings.schemas.forEach(schema => validator.addSchema(schema))
  return validator.validate(jsSpec, settings.testSchema || {})
           .errors.map(err => {
             return {
               level: "error",
               line: getLineNumberForPath(specStr, transformPathToArray(err.property, jsSpec) || []),
               path: err.property.replace("instance.", ""),
               message: err.message,
               source: "schema",
               original: err // this won't make it into state, but is still helpful
             }
           })
}
