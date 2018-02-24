// Validation plugin for APIs

import { makeValidationWorker } from "../helpers"

let debouncedValidation = makeValidationWorker()

export const validateSpec = (jsSpec) => ({ specSelectors, errActions }) => {
  const isOAS3 = specSelectors.isOAS3 ? specSelectors.isOAS3() : false
  const ourMode = isOAS3 ? "oas3" : "swagger2"
  debouncedValidation({ mode: ourMode, specSelectors, errActions, jsSpec })
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
