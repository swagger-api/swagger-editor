import * as actions from "./actions"
import * as fn from "./fn"
import * as specSelectors from "./spec-selectors"

export default function EditorAutosuggestPlugin() {
  return {
    fn,
    statePlugins: {
      spec: {
        selectors: specSelectors,
      },
      editor: {
        actions,
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
