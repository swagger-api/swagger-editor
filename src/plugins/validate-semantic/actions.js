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

  // these will be functions or undefined
  const { specSelectors: { isSwagger2, isOAS3 } } = system

  // don't run validation if we don't recognize this content
  if(isSwagger2 && isOAS3 && !isSwagger2() && !isOAS3()) {
    return
  }

  // don't run validation if valid swagger and openapi is used together
  if(isSwagger2 && isOAS3 && isSwagger2() && isOAS3()) {
    return
  }

  const errCb = (obj) => bufferedNewSpecErrBatch(system, obj)

  forEach(system.validateActions, (fn, name) => {
    if(name.indexOf("validateAsync") === 0) {
      fn(errCb) // Function send messages on its own, it won't be cached ( due to the nature of async operations )
    } else if(name.indexOf("validateOAS3") === 0) {
      // OpenAPI 3 only
      if(system.specSelectors.isOAS3()) {
        Promise.resolve(fn())
        .then(validationObjs => {
          if(validationObjs) {
            validationObjs.forEach(errCb)
          }
        })
      }
    } else if(name.indexOf("validate2And3") === 0) {
      // Swagger 2 and OpenAPI 3
      Promise.resolve(fn())
        .then(validationObjs => {
          if(validationObjs) {
            validationObjs.forEach(errCb)
          }
        })
    } else if(name.indexOf("validate") === 0) {
      // Swagger 2 only
      if(!system.specSelectors.isOAS3()) {
        Promise.resolve(fn())
          .then(validationObjs => {
            if(validationObjs) {
              validationObjs.forEach(errCb)
            }
          })
      }
    }
  })
}
