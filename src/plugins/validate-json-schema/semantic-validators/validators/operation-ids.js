// Assertation 1: Operations must have a unique operationId.

import pickBy from "lodash/pickBy"
import reduce from "lodash/reduce"
import merge from "lodash/merge"
import each from "lodash/each"

export function validate({ jsSpec }) {
  let errors = []
  let warnings = []

  let validOperationKeys = ["get", "head", "post", "put", "patch", "delete", "options"]

  let operations = reduce(jsSpec.paths, (arr, path, pathKey) => {
    let pathOps = pickBy(path, (obj, k) => {
      return validOperationKeys.indexOf(k) > -1
    })
    each(pathOps, (op, opKey) => arr.push(merge({
      path: `paths.${pathKey}.${opKey}`
    }, op)))
    return arr
  }, [])

  let seenOperationIds = {}

  let tallyOperationId = (operationId) => {
    let prev = seenOperationIds[operationId]
    seenOperationIds[operationId] = true
    // returns if it was previously seen
    return !!prev
  }

  operations.forEach(op => {
    // wrap in an if, since operationIds are not required
    if(op.operationId) {
      let hasBeenSeen = tallyOperationId(op.operationId)
      if(hasBeenSeen) {
        errors.push({
          path: op.path + ".operationId",
          message: "operationIds must be unique"
        })
      }
    }
  })

  return { errors, warnings }
}
