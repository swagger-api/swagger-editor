// Assertation 1:
// The items property for a parameter is required when its type is set to array

export function validate({ resolvedSpec }) {
  let errors = []
  let warnings = []

  function walk(obj, path) {
    if(typeof obj !== "object" || obj === null) {
      return
    }

    // 1
    if(path[path.length - 2] === "parameters") {
      if(obj.type === "array" && typeof obj.items !== "object") {
        errors.push({
          path,
          message: "Parameters with 'array' type require an 'items' property."
        })
      }
    }

    if(Object.keys(obj).length) {
      return Object.keys(obj).map(k => walk(obj[k], [...path, k]))

    } else {
      return null
    }

  }

  walk(resolvedSpec, [])

  return { errors, warnings }
}
