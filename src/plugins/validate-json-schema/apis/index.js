// Validation plugin for APIs

import { makeValidationWorker } from "../helpers"

let debouncedValidation = makeValidationWorker()

export const updateResolved = (ori, {specActions}) => (...args) => {
  ori(...args)
  /*
    To allow us to remove this, we should prefer the practice of
    only _composing_ inside of wrappedActions. It keeps us free to
    remove pieces added by plugins. In this case, I want to toggle validation.
    But I can't look inside the updateResolved action,
    I can only remove it ( which isn't desirable ). However I _can_ remove `validateSpec` action,
    making it a noop. That way, the only overhead I end up with is a bunch of noops inside wrappedActions.
    Which isn't bad.
  */
  const [ spec ] = args
  specActions.validateSpec(spec)
}

export const validateSpec = (resolvedSpec) => ({ specSelectors, errActions }) => {
  const isOAS3 = specSelectors.isOAS3 ? specSelectors.isOAS3() : false
  const ourMode = isOAS3 ? "oas3" : "swagger2"
  debouncedValidation({ mode: ourMode, specSelectors, errActions, resolvedSpec })
}

export default function() {
  return {
    statePlugins: {
      spec: {
        actions: {
          validateSpec,
        },
        wrapActions: {
          updateResolved
        }
      }
    }
  }
}
