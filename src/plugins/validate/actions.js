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

  system.fn.timeCall("Sync validations", () => {
    forEach(system.validateActions, (fn, name) => {
      if(name.indexOf("validateAsync") === 0) {
        fn(cb) // Function send messages on its own, it won't be cached ( due to the nature of async operations )
      } else if(name.indexOf("validate") === 0) {
        Promise.resolve(system.fn.timeCall("Sync validate "+name+":", fn))
          .then(validationObjs => {
            if(validationObjs) {
              validationObjs.forEach(cb)
            }
          })
      }
    })
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
          return acc
        }
      }, [])
    })
}


export const validateMinAndMax = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const schemaObj = node.node
        const {minimum, maximum} = schemaObj
        if(minimum && maximum && (maximum < minimum)) {
          acc.push({
            message: "Maximum field must be greater than minimum field",
            path: [...node.path, "maximum"],
            level: "error",
          })
        }
        return acc
      }, [])
    })
}

// Add warnings for unused definitions
export const validate$Refs = () => (system) => {
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
          level: "error",
          path,
          message: "Definition was declared but never used in document"
        })
      }
  })

  return errors
}
