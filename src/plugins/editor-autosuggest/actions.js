
// Hook for getting completions
export const getCompletionsSync = () => () => null

// Hook for getting completions ( asynchronously )
export const getCompletionsAsync = () => () => null

// Enable Ace editor autocompletions
export const enableAutocompletions = ({editor}) => () => {
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  })
}

// Add completers. Will fire an action, if autocomplete is enabled
export const addAutosuggestionCompleters = (context) => (sys) => {
  const { editor } = context
  const {
    fn: { getPathForPosition },
    editorActions: { getCompletionsSync=Function.prototype }
  } = sys

  // TODO
  // editor.completer.autoSelect = true
  editor.completers = [
    {
      getCompletions: (...args) => {
        getCompletionsSync({...context, getPathForPosition}, ...args)
      }
    }
  ]
}
