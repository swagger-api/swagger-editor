// Base validate plugin that provides a placeholder `validateSpec` that fires
// after `updateResolved` is dispatched.

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

//eslint-disable-next-line no-unused-vars
export const validateSpec = (resolvedSpec) => ({ specSelectors, errActions }) => {

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
