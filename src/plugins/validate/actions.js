import forEach from "lodash/forEach"

export const SOURCE = "semantic"

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
