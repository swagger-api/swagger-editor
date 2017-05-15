
// Hook for getting completions
export const getCompletions = () => () => null

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
    editorActions,
  } = sys

  // TODO?
  // editor.completer.autoSelect = true
  editor.completers = [
    {
      getCompletions: (...args) => {
        editorActions.getCompletions(context, ...args)
      }
    }
  ]
}
