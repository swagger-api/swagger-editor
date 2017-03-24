// Validation plugin for APIs

import { makeValidationWorker } from "../helpers"

let debouncedValidation = makeValidationWorker()

export const updateResolved = (ori, {errActions, specSelectors}) => (...args) => {
  ori(...args)
  debouncedValidation({ mode: "apis", specSelectors, errActions, resolvedSpec: args[0] })
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
