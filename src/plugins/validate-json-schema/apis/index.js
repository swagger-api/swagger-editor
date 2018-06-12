// Validation plugin for APIs

import { makeValidationWorker } from "../helpers"

let debouncedValidation = makeValidationWorker()

export const validateSpec = (jsSpec) => ({ specSelectors, errActions }) => {
  const isOAS3 = specSelectors.isOAS3 ? specSelectors.isOAS3() : false
  const isSwagger2 = specSelectors.isSwagger2 ? specSelectors.isSwagger2() : false
  const isAmbiguousVersion = isOAS3 && isSwagger2
  const ourMode = isOAS3 ? "oas3" : "swagger2"
  if(!isAmbiguousVersion && (isOAS3 || isSwagger2)) {
    debouncedValidation({ mode: ourMode, specSelectors, errActions, jsSpec })
  } else {
    // stagger clearing errors, in case there is another debounced validation
    // run happening, which can occur when the user's typing cadence matches
    // the latency of validation
    // TODO: instead of using a timeout, be aware of any pending validation
    // promises, and use them to schedule error clearing.
    setTimeout(() => {
      errActions.clear({
        source: "schema"
      })
    }, 50)
  }
}

export default function() {
  return {
    statePlugins: {
      spec: {
        actions: {
          validateSpec,
        }
      }
    }
  }
}
