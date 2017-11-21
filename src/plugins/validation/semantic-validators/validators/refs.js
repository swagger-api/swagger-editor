// Assertation 1:
// Referenceable definitions should be used by being referenced in the appropriate way

import uniq from "lodash/uniq"
import filter from "lodash/filter"
import startsWith from "lodash/startsWith"
import each from "lodash/each"

function collectRefs(val, key, arr = []) {
  if(key === "$ref") {
    return arr.push(val)
  }

  if(typeof val !== "object") {
    return
  }

  Object.keys(val).map(k => collectRefs(val[k], k, arr))

  return arr
}

export function validate({ jsSpec }) {
  let errors = []
  let warnings = []

  // Assertation 1
  const refs = collectRefs(jsSpec, "")

  // de-dupe the array, and filter out non-definition refs
  let definitionsRefs = filter(uniq(refs), v => startsWith(v, "#/definitions"))

  each(jsSpec.definitions, (def, defName) => {
    if(definitionsRefs.indexOf(`#/definitions/${defName}`) === -1) {
      warnings.push({
        path: `definitions.${defName}`,
        message: "Definition was declared but never used in document"
      })
    }
  })

  return { errors, warnings }
}
