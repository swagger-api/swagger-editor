import forEach from "lodash/forEach"
import debounce from "lodash/debounce"

export const SOURCE = "semantic"

// the test system does not tolerate slowness!
const { NODE_ENV, CI } = process.env
const DEBOUNCE_MS = (NODE_ENV === "test" || CI === "true") ? 0 : 30

// System for buffering/batching errors
var errorCollector = []
const debNewSpecErrBatch = debounce(() => {
  const system = errorCollector.system // Just a reference to the "latest" system
  try {
    errorCollector.forEach(obj => {
      obj.line = obj.line || system.fn.AST.getLineNumberForPath(system.specSelectors.specStr(), obj.path)
      obj.source = SOURCE
    })
    system.errActions.newSpecErrBatch(errorCollector)
    delete errorCollector.system
    errorCollector = [] // Clear stack
  } catch(e) {
    console.error(e)
  }
}, DEBOUNCE_MS)

const bufferedNewSpecErrBatch = (system, obj) => {
  errorCollector.push(obj)
  errorCollector.system = system
  debNewSpecErrBatch()
}

export const all = () => (system) => {

  // don't run validation if spec is empty
  if(system.specSelectors.specStr().trim().length === 0) {
    return
  }

  system.errActions.clear({
    source: SOURCE
  })

  const errCb = (obj) => bufferedNewSpecErrBatch(system, obj)

  forEach(system.validateActions, (fn, name) => {
    if(name.indexOf("validateAsync") === 0) {
      fn(errCb) // Function send messages on its own, it won't be cached ( due to the nature of async operations )
    } else if(name.indexOf("validate") === 0) {
      Promise.resolve(fn())
        .then(validationObjs => {
          if(validationObjs) {
            validationObjs.forEach(errCb)
          }
        })
    }
  })
}
