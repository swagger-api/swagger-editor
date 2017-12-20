// Walks an entire spec.

// Assertation 1:
// In specific areas of a spec, allowed $ref values are restricted.

// Assertation 2:
// Sibling keys with $refs are not allowed.

import match from "matcher"

export function validate({ jsSpec }) {
  let errors = []
  let warnings = []

  function walk(value, path) {
    let curr = path[path.length - 1]

    if(value === null) {
      return null
    }

    ///// Restricted $refs

    if(curr === "$ref") {
      let refBlacklist = getRefPatternBlacklist(path) || []
      let matches = match([value], refBlacklist)

      let humanFriendlyRefBlacklist = refBlacklist
        .map(val => `"${val}"`)
        .join(", ")

      if(refBlacklist && refBlacklist.length && matches.length) {
        // Assertation 1
        errors.push({
          path,
          message: `${path[path.length - 2]} $refs cannot match any of the following: ${humanFriendlyRefBlacklist}`
        })
      }



      if(typeof value === "string") {
        // eslint-disable-next-line no-unused-vars
        const [refUrl, refPath] = value.split("#")

        if(refPath && refPath[0] !== "/") {
          errors.push({
            path,
            message: "$ref paths must begin with `#/`"
          })
        }

      }
    }

    if(typeof value !== "object") {
      return null
    }

    let keys = Object.keys(value)

    if(keys.length) {
      ///// $ref siblings
      return keys.map(k => {
        if(keys.indexOf("$ref") > -1 && k !== "$ref") {
          warnings.push({
            path: path.concat([k]),
            message: "Values alongside a $ref will be ignored."
          })
        }
        return walk(value[k], [...path, k])
      })

    } else {
      return null
    }

  }

  walk(jsSpec, [])

  return { errors, warnings }
}

// values are globs!
let unacceptableRefPatterns = {
  responses: ["*#/definitions*", "*#/parameters*"],
  schema: ["*#/responses*", "*#/parameters*"],
  parameters: ["*#/definitions*", "*#/responses*"]
}

let exceptionedParents = ["properties"]

function getRefPatternBlacklist(path) {
  return path.reduce((prev, curr, i) => {
    let parent = path[i - 1]
    if(unacceptableRefPatterns[curr] && exceptionedParents.indexOf(parent) === -1) {
      return unacceptableRefPatterns[curr]
    } else {
      return prev
    }
  }, null)
}

function greater(a, b) {
  // is a greater than b?
  return a > b
}
