import forEach from "lodash/forEach"

export const SOURCE = "validate"

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

// Add warnings for unused definitions
export const validateUnused$Refs = () => (system) => {
  return Promise.all([
    system.validateSelectors.all$refs(),
    system.validateSelectors.all$refArtifacts()
  ]).then(([refs, refArtifacts]) => {
    const references = (refs || refArtifacts || []).map(node => node.node)
    const errors = []

    system.specSelectors.definitions()
    .forEach((val, key) => {
      if(references.indexOf(`#/definitions/${key}`) < 0) {
        const path = ["definitions", key]
        errors.push({
          level: "warning",
          path,
          message: "Definition was declared but never used in document"
        })
      }
    })

    return errors
  })
}
