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

  system.fn.timeCall("All validations", () => {
    forEach(system.validateActions, (fn, name) => {
      if(name.indexOf("validate") === 0) {
        system.fn.timeCall("Validate "+name+":", () => fn(cb))
      }
    })
  })
}

export const validateTypeArrayRequiresItems = (cb) => (system) => {
  system.validateSelectors.allSchemas().forEach(function(node) {
    const schemaObj = node.node
    if(schemaObj.type === "array" && typeof schemaObj.items === "undefined") {
      cb({
        message: "Schemas with 'type: array', require a sibling 'items: ' field",
        path: node.path,
        level: "error",
      })
    }
  })
}


// Add warnings for unused definitions
export const validate$Refs = (cb) => (system) => {
  const specStr = system.specSelectors.specStr()
  const refRegex = /\$ref.*["'](.*)["']/g
  let match = refRegex.exec(specStr)
  let refs = new Set()

  while(match !== null) {
    refs.add(match[1])
    match = refRegex.exec(specStr)
  }

  system.specSelectors.definitions()
    .forEach((val, key) => {
      if(!refs.has(`#/definitions/${key}`)) {
        const path = ["definitions", key]
        cb({
          level: "error",
          path,
          message: "Definition was declared but never used in document"
        })
      }
  })
}
