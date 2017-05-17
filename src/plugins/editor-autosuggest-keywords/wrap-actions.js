import getCompletions from "./get-completions"

// Add an autosuggest completer
export const addAutosuggestionCompleters = (ori, system) => (context) => {
  return ori(context).concat([{
    getCompletions(...args) {
      // Add `context`, then `system` as the last args
      return getCompletions(...args, context, system)
    }
  }])
}
