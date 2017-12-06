import forEach from "lodash/forEach"

const SOURCE = "validate"

export const all = () => (system) => {

  // don't run validation if spec is empty
  if(system.specSelectors.specStr().trim().length === 0) {
    return
  }

  system.errActions.clear({
    source: SOURCE
  })

  const cb = (obj) => setTimeout(() => {
    obj.line = obj.line || system.fn.AST.getLineNumberForPath(system.specSelectors.specStr(), obj.path)
    obj.source = SOURCE
    system.errActions.newSpecErr(obj)
  }, 0)

  forEach(system.validateActions, (fn, name) => {
    if(name.indexOf("validateAsync") === 0) {
      fn(cb) // Function send messages on its own, it won't be cached ( due to the nature of async operations )
    } else if(name.indexOf("validate") === 0) {
      Promise.resolve(fn())
        .then(validationObjs => {
          if(validationObjs) {
            validationObjs.forEach(cb)
          }
        })
    }
  })
}

export const validateTypeArrayRequiresItems = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const schemaObj = node.node
        if(schemaObj.type === "array" && typeof schemaObj.items === "undefined") {
          acc.push({
            message: "Schemas with 'type: array', require a sibling 'items: ' field",
            path: node.path,
            level: "error",
          })
        }
        return acc
      }, [])
    })
}


export const validateParameterBadKeys = () => (system) => {
  return system.validateSelectors
    .allParameters()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        if(node.keys.includes("example")) {
          acc.push({
            level: "error",
            message: "'example' field is not allowed in parameter",
            path: [...node.path, "example"]
          })
        }
        if(node.node.required !== true && node.node.in === "path") {
          acc.push({
            level: "error",
            message: "Path parameters must have 'required: true'. You can always create another path/operation without this parameter to get the same behaviour.",
            path: node.path
          })
        }
        return acc
      }, [])
    })
}

export const validateMinAndMax = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const schemaObj = node.node
        const {minimum, maximum, minLength, maxLength, minProperties, maxProperties} = schemaObj
        if(typeof minimum === "number" && typeof maximum === "number" && (minimum > maximum)) {
          acc.push({
            message: "'minimum' must be lower value than 'maximum'",
            path: [...node.path, "minimum"],
            level: "error",
          })
        }

        if(typeof minLength === "number" && typeof maxLength === "number" && (minLength > maxLength)) {
          acc.push({
            message: "'minLength' must be lower value than 'maxLength'",
            path: [...node.path, "minLength"],
            level: "error",
          })
        }

        if(typeof minProperties === "number" && typeof maxProperties === "number" && (minProperties > maxProperties)) {
          acc.push({
            message: "'minProperties' must be lower value than 'maxProperties'",
            path: [...node.path, "minProperties"],
            level: "error",
          })
        }
        return acc
      }, [])
    })
}

// Add warnings for unused definitions
export const validateUnused$Refs = () => (system) => {
  const specStr = system.specSelectors.specStr()
  const refRegex = /\$ref.*["'](.*)["']/g
  let match = refRegex.exec(specStr)
  let refs = new Set()

  while(match !== null) {
    refs.add(match[1])
    match = refRegex.exec(specStr)
  }

  const errors = []

  system.specSelectors.definitions()
    .forEach((val, key) => {
      if(!refs.has(`#/definitions/${key}`)) {
        const path = ["definitions", key]
        errors.push({
          level: "warning",
          path,
          message: "Definition was declared but never used in document"
        })
      }
  })

  return errors
}
