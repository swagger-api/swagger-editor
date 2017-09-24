// Validation plugin for APIs

import { makeValidationWorker } from "../helpers"

let debouncedValidation = makeValidationWorker()

export const updateResolved = (ori, {errActions, specSelectors}) => (...args) => {
  ori(...args)
  const isOAS3 = specSelectors.isOAS3 ? specSelectors.isOAS3() : false
  const ourMode = isOAS3 ? "oas3" : "swagger2"
  debouncedValidation({ mode: ourMode, specSelectors, errActions, resolvedSpec: args[0] })
}

export default function() {
  return {
    statePlugins: {
      spec: {
        wrapActions: {
          updateResolved
        }
      }
    }
  }
}
