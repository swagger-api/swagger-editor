import debounce from "lodash/debounce"

export const SOURCE = "semantic"

// the test system does not tolerate slowness!
const NODE_ENV = process.env.NODE_ENV
const CI = process.env.CI
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
    // eslint-disable-next-line no-console
    console.error(e)
  }
}, DEBOUNCE_MS)

const bufferedNewSpecErrBatch = (system, obj) => {
  errorCollector.push(obj)
  errorCollector.system = system
  debNewSpecErrBatch()
}

export const all = () => system => {
  if (!system.validateSelectors.shouldValidate()) {
    return
  }

  system.validateActions.beforeValidate()

  const errCb = (obj) => bufferedNewSpecErrBatch(system, obj)

  system.validateSelectors.validators().forEach(name => {
    const fn = system.validateActions[name]
    // nothing about oas3 or swagger2
    if(name.indexOf("validateAsync") === 0) {
      fn(errCb) // Function send messages on its own, it won't be cached ( due to the nature of async operations )
    } else {
      Promise.resolve(fn())
        .then(validationObjs => {
          if(validationObjs) {
            validationObjs.forEach(errCb)
          }
        })
    }
  })
}

export const beforeValidate = () => (system) => {
  system.errActions.clear({
    source: SOURCE
  })
}
