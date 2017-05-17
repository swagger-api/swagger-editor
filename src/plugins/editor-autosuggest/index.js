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
            const { editor } = context

            // Any other calls for editor#onLoad
            ori(context)

            // Enable autosuggestions ( aka: autocompletions )
            sys.editorActions.enableAutocompletions(context)

            // Add completers ( for autosuggestions )
            editor.completers = sys.editorActions.addAutosuggestionCompleters(context)
            return
          }
        }
      }
    }
  }
}
