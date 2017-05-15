import * as actions from "./actions"
import * as fn from "./fn"

export default function EditorAutosuggestPlugin() {
  return {
    statePlugins: {
      editor: {
        actions,
        fn,
        wrapActions: {
          onLoad: (ori, sys) => (context) => {
            // Editor.onLoad
            ori(context)

            // Enable autosuggestions ( aka: autocompletions )
            sys.editorActions.enableAutocompletions(context)
            // Add and run-when-applicable the completers
            // Will fire editorActions.getCompletions
            sys.editorActions.addAutosuggestionCompleters(context)
            return
          }
        }
      }
    }
  }
}
