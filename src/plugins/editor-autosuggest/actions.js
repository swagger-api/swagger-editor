
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

  editor.completers = [
    {
      getCompletions: (...args) => {
        const cb = args[4]
        args[4] = (err, ar) => {
          // Want to see what suggestions are getting through?
          // Add a console.log here
          return cb(err, ar)
        }

        // Make your own suggestions in the console! ( for science of course )
        // if(window.justForFun) {
        //   args[4](null, window.justForFun())
        // }
        editorActions.getCompletions(context, ...args)
      }
    }
  ]
}
