import Ajv from "ajv"
import { getLineNumberForPath } from "./shared.js"
import { transformPathToArray } from "./path-translator.js"
import { condenseErrors } from "./condense-errors.js"
import jsonSchema from "./jsonSchema"
const IGNORED_AJV_PARAMS = ["type"]

export default class JSONSchemaValidator {
  constructor() {
    this.ajv = new Ajv({
      allErrors: true
    })
    this.addSchema(jsonSchema)
  }

  addSchema(schema, key) {
    this.ajv.addSchema(schema, normalizeKey(key))
  }

  validate({ jsSpec, specStr, schemaPath, source }) {
    this.ajv.validate(normalizeKey(schemaPath), jsSpec)

    if (!this.ajv.errors || !this.ajv.errors.length) {
      return null
    }

    const condensedErrors = condenseErrors(this.ajv.errors)
    const boundGetLineNumber = getLineNumberForPath.bind(null, specStr)

    return condensedErrors.map(err => {
      let preparedMessage = err.message
      if (err.params) {
        preparedMessage += "\n"
        for (var k in err.params) {
          if (IGNORED_AJV_PARAMS.indexOf(k) === -1) {
            const ori = err.params[k]
            const value = Array.isArray(ori) ? dedupe(ori).join(", ") : ori
            preparedMessage += `${k}: ${value}\n`
          }
        }
      }

      const errorPathArray = transformPathToArray(err.dataPath.slice(1), jsSpec)

      return {
        level: "error",
        line: boundGetLineNumber(errorPathArray || []),
        path: errorPathArray,
        message: preparedMessage,
        source,
        original: err
      }
    })
  }
}

function dedupe(arr) {
  return arr.filter((val, i) => {
    return arr.indexOf(val) === i
  })
}

function pathToJSONPointer(arr) {
  return arr.map(a => (a + "").replace("~", "~0").replace("/", "~1")).join("/")
}

// For completeness, if we need to denormalize the key...
// function JSONPointerToPath(str) {
//   return str.split('/').map(a => a.replace('~1', '/').replace('~0', '~'))
// }

// Convert arrays into a string. Safely, by using the JSONPath spec
function normalizeKey(key) {
  if (!Array.isArray(key)) key = [key]
  return pathToJSONPointer(key)
}
